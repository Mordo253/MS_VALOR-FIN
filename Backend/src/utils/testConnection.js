import { google } from 'googleapis';
import { GOOGLE_CONFIG, SPREADSHEET_ID } from '../config.js';

export const testConnections = async () => {
    try {
        // Probar conexión con Google Sheets
        const auth = new google.auth.GoogleAuth(GOOGLE_CONFIG);
        const sheets = google.sheets({ version: 'v4', auth });

        // Verificar acceso y permisos
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });

        // Verificar que las hojas necesarias existen
        const requiredSheets = ['Propiedades', 'Vehiculos', 'Posts'];
        const existingSheets = response.data.sheets.map(sheet => sheet.properties.title);

        console.log('📊 Hojas disponibles:', existingSheets);

        // Verificar permisos intentando leer datos
        await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1:A1'
        });

        console.log('✅ Conexión exitosa con Google Sheets');
        console.log('✅ Permisos de lectura/escritura verificados');

        return true;
    } catch (error) {
        if (error.code === 403) {
            console.error('❌ Error de permisos en Google Sheets.',
                'Verifica que la cuenta de servicio tiene acceso a la hoja.');
            console.error('🔑 Cuenta de servicio:', GOOGLE_CONFIG.credentials.client_email);
        } else if (error.code === 404) {
            console.error('❌ Hoja de cálculo no encontrada.',
                'Verifica el SPREADSHEET_ID:', SPREADSHEET_ID);
        } else {
            console.error('❌ Error conectando con Google Sheets:', error.message);
        }
        throw error;
    }
};