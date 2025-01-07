import { google } from 'googleapis';
import { GOOGLE_CONFIG, SPREADSHEET_ID } from '../config.js';
import mongoose from 'mongoose';

const SHEET_RANGES = {
    properties: 'Propiedades!A:S',
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

    formatCaracteristicas(caracteristicas) {
        if (!caracteristicas || !Array.isArray(caracteristicas)) {
            return ['', ''];
        }

        const internas = caracteristicas
            .filter(c => c.type === 'interna')
            .map(c => c.name)
            .join(', ');

        const externas = caracteristicas
            .filter(c => c.type === 'externa')
            .map(c => c.name)
            .join(', ');

        return [internas, externas];
    }

    async findRowByCodigo(codigo, range) {
        try {
            const response = await this.sheetsApi.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range
            });

            const values = response.data.values || [];
            // El código está en la segunda columna (índice 1)
            for (let i = 0; i < values.length; i++) {
                if (values[i][1] === codigo) {
                    return i + 1; // +1 porque las filas en Sheets empiezan en 1
                }
            }
            return null;
        } catch (error) {
            console.error('Error buscando fila:', error);
            return null;
        }
    }

    async syncToSheets(document, collectionName) {
        try {
            console.log(`🔄 Sincronizando documento de ${collectionName}:`, {
                id: document._id,
                codigo: document.codigo
            });

            let rowData;
            const timestamp = this.formatDate(new Date());

            switch (collectionName) {
                case 'properties':
                    const [caracteristicasInternas, caracteristicasExternas] = 
                        this.formatCaracteristicas(document.caracteristicas);
                    
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
                        this.formatCloudinaryUrls(document.images),
                        caracteristicasInternas,
                        caracteristicasExternas
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

            // Buscar fila existente por código
            const existingRow = document.codigo ? 
                await this.findRowByCodigo(document.codigo, range) : null;

            if (existingRow) {
                // Actualizar fila existente
                const updateRange = `${range.split('!')[0]}!A${existingRow}`;
                await this.sheetsApi.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: updateRange,
                    valueInputOption: 'RAW',
                    resource: { values: [rowData] }
                });

                console.log(`✅ Datos actualizados en fila ${existingRow}:`, {
                    documentId: document._id,
                    codigo: document.codigo
                });
            } else {
                // Insertar nueva fila
                await this.sheetsApi.spreadsheets.values.append({
                    spreadsheetId: SPREADSHEET_ID,
                    range: range,
                    valueInputOption: 'RAW',
                    resource: { values: [rowData] }
                });

                console.log(`✅ Nueva fila insertada:`, {
                    documentId: document._id,
                    codigo: document.codigo
                });
            }

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