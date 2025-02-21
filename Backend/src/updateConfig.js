// updateConfig.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

// Variables requeridas para Cloudinary y MongoDB
const REQUIRED_ENVS = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MONGODB_URI'
];

// Validar variables de entorno requeridas
const missingEnvs = REQUIRED_ENVS.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
  console.error(`❌ Faltan variables de entorno requeridas: ${missingEnvs.join(', ')}`);
  process.exit(1);
}

// Exportar configuración
export const CLOUDINARY = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
};

export const MONGODB_URI = process.env.MONGODB_URI;
