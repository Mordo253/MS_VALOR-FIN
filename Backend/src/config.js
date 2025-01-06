import { config } from "dotenv";
import { google } from 'googleapis';

config();

// Función para validar variables requeridas
const validateRequiredEnvs = () => {
    const required = [
        'GOOGLE_PROJECT_ID',
        'GOOGLE_CLIENT_EMAIL',
        'GOOGLE_PRIVATE_KEY',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_SPREADSHEET_ID'
    ];

    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
    }
};

// Validar variables al iniciar
validateRequiredEnvs();

// Server & MongoDB configs
export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;

// URLs
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000/api';
export const LOCAL_URL = process.env.LOCAL_URL;

// Cloudinary configs
export const CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME'];
export const CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET'];
export const CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY'];

// Google configuration
export const GOOGLE_CONFIG = {
    credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID?.trim(),
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
        client_email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
        client_id: process.env.GOOGLE_CLIENT_ID?.trim(),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
};

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID?.trim();

// Log de configuración (solo información no sensible)
console.log('Google Sheets Configuration:', {
    project_id: GOOGLE_CONFIG.credentials.project_id,
    client_email: GOOGLE_CONFIG.credentials.client_email,
    spreadsheet_id: SPREADSHEET_ID,
    private_key_provided: Boolean(GOOGLE_CONFIG.credentials.private_key),
});

// Helper function to initialize Google Sheets client with error handling mejorado
export const initGoogleSheets = async () => {
    try {
        const auth = new google.auth.GoogleAuth(GOOGLE_CONFIG);
        const sheetsApi = google.sheets({ version: 'v4', auth });
        
        // Verificar la conexión intentando acceder a la hoja
        await sheetsApi.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });
        
        console.log('✅ Google Sheets client initialized successfully');
        return sheetsApi;
    } catch (error) {
        if (error.code === 403) {
            console.error('❌ Error de permisos: Verifica que la cuenta de servicio tiene acceso a la hoja');
            console.error('🔑 Cuenta de servicio:', GOOGLE_CONFIG.credentials.client_email);
        } else if (error.code === 404) {
            console.error('❌ Hoja no encontrada: Verifica el SPREADSHEET_ID');
            console.error('📑 SPREADSHEET_ID:', SPREADSHEET_ID);
        } else {
            console.error('❌ Error inicializando Google Sheets:', error.message);
        }
        throw error;
    }
};

// Función para verificar el formato de la private key
const isPrivateKeyValid = GOOGLE_CONFIG.credentials.private_key.includes('BEGIN PRIVATE KEY') && 
                         GOOGLE_CONFIG.credentials.private_key.includes('END PRIVATE KEY');

if (!isPrivateKeyValid) {
    console.error('❌ Warning: El formato de la private key parece incorrecto');
}