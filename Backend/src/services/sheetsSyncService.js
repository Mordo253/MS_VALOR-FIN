import { google } from 'googleapis';
import { GOOGLE_CONFIG, SPREADSHEET_ID } from '../config.js';
import mongoose from 'mongoose';

const SHEET_RANGES = {
    properties: 'Propiedades!A:Q',
    cars: 'Vehiculos!A:N',
    posts: 'Posts!A:H'
};

export class SheetsSyncService {
    constructor() {
        this.sheetsApi = null;
        this.watchedCollections = new Map();
        this.isInitialized = false;
        this.ranges = SHEET_RANGES;
    }

    async initialize() {
        try {
            const auth = new google.auth.GoogleAuth(GOOGLE_CONFIG);
            this.sheetsApi = google.sheets({ version: 'v4', auth });
            const sheets = await this.sheetsApi.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
            console.log('📊 Hojas disponibles:', sheets.data.sheets.length);
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('❌ Error inicializando SheetsSyncService:', error);
            throw error;
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/Bogota'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    }

    formatCloudinaryUrls(images) {
        return images?.map(img => {
            const format = img.format?.toLowerCase() || 'jpg';
            return `https://res.cloudinary.com/dspspes2y/image/upload/${img.public_id}.${format}`;
        }).join('\n') || '';
    }

    async syncToSheets(document, collectionName) {
        try {
            console.log(`🔄 Sincronizando documento de ${collectionName}:`, {
                id: document._id,
                hoja: this.ranges[collectionName]
            });

            let rowData;
            const timestamp = this.formatDate(new Date());

            switch (collectionName) {
                case 'properties':
                    rowData = [
                        timestamp,
                        document.codigo || '',
                        document.title || '',
                        document.pais || '',
                        document.ciudad || '',
                        document.zona || '',
                        document.tipoInmueble || '',
                        document.tipoNegocio || '',
                        this.formatCurrency(document.costo || 0),
                        document.areaConstruida?.toString() || '',
                        document.alcobas?.toString() || '',
                        document.banos?.toString() || '',
                        document.estrato?.toString() || '',
                        document.estado || '',
                        document.disponible ? 'Disponible' : 'No disponible',
                        document.description || '',
                        this.formatCloudinaryUrls(document.images)
                    ];
                    break;

                case 'cars':
                    rowData = [
                        timestamp,
                        document.codigo || '',
                        document.title || '',
                        document.brand || '',
                        document.car || '',
                        document.model?.toString() || '',
                        this.formatCurrency(document.price || 0),
                        document.kilometer?.toString() || '',
                        document.color || '',
                        document.registrationYear || '',
                        document.fuel || '',
                        document.disponible ? 'Disponible' : 'No disponible',
                        document.description || '',
                        this.formatCloudinaryUrls(document.images)
                    ];
                    break;

                case 'posts':
                    rowData = [
                        timestamp,
                        document.title?.replace(/<[^>]*>/g, '') || '',
                        document.content?.replace(/<[^>]*>/g, '') || '',
                        document.slug || '',
                        document.disponible ? 'Publicado' : 'No publicado',
                        document.images?.length?.toString() || '0',
                        this.formatDate(document.createdAt),
                        this.formatCloudinaryUrls(document.images)
                    ];
                    break;

                default:
                    console.warn(`⚠️ Tipo de documento no manejado: ${collectionName}`);
                    return;
            }

            const range = this.ranges[collectionName];
            if (!range) {
                console.warn(`⚠️ Rango no definido para colección: ${collectionName}`);
                return;
            }

            const result = await this.sheetsApi.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
                valueInputOption: 'RAW',
                resource: { values: [rowData] }
            });

            console.log(`✅ Datos sincronizados en ${range}:`, {
                documentId: document._id,
                updatedRange: result.data.updates?.updatedRange
            });

        } catch (error) {
            console.error(`❌ Error sincronizando ${collectionName}:`, error);
            throw error;
        }
    }

    async watchCollection(collectionName) {
        if (this.watchedCollections.has(collectionName)) {
            await this.closeStream(collectionName);
        }

        try {
            const collection = mongoose.connection.collection(collectionName);
            const pipeline = [
                { $match: { operationType: { $in: ['insert', 'update', 'replace'] } } }
            ];
            
            const changeStream = collection.watch(pipeline, {
                fullDocument: 'updateLookup'
            });
            
            changeStream.on('change', async (change) => {
                try {
                    await this.syncToSheets(change.fullDocument, collectionName);
                } catch (error) {
                    console.error(`❌ Error procesando cambio en ${collectionName}:`, error);
                }
            });

            changeStream.on('error', async (error) => {
                console.error(`❌ Error en stream de ${collectionName}:`, error);
                this.watchedCollections.delete(collectionName);
                await this.reconnectStream(collectionName);
            });

            this.watchedCollections.set(collectionName, changeStream);
            console.log(`👀 Observando colección: ${collectionName}`);
        } catch (error) {
            console.error(`❌ Error configurando watch en ${collectionName}:`, error);
            throw error;
        }
    }

    async reconnectStream(collectionName, attempt = 1) {
        const maxAttempts = 5;
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);

        if (attempt <= maxAttempts) {
            try {
                await new Promise(resolve => setTimeout(resolve, delay));
                await this.watchCollection(collectionName);
                console.log(`✅ Reconexión exitosa: ${collectionName}`);
            } catch (error) {
                console.error(`❌ Intento ${attempt} fallido: ${collectionName}`);
                await this.reconnectStream(collectionName, attempt + 1);
            }
        } else {
            console.error(`❌ Máximo de intentos alcanzado: ${collectionName}`);
        }
    }

    async closeStream(collectionName) {
        const stream = this.watchedCollections.get(collectionName);
        if (stream) {
            try {
                await stream.close();
                this.watchedCollections.delete(collectionName);
                console.log(`✅ Stream cerrado: ${collectionName}`);
            } catch (error) {
                console.error(`❌ Error cerrando stream de ${collectionName}:`, error);
            }
        }
    }

    async close() {
        for (const [collectionName] of this.watchedCollections) {
            await this.closeStream(collectionName);
        }
        this.isInitialized = false;
        console.log('✅ Servicio de sincronización cerrado');
    }
}