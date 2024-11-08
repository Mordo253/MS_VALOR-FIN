import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import scraperRoutes from "./routes/scraper.routes.js";
import carRoutes from "./routes/car.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

// Configuración de la ruta para ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// Configuración de seguridad
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' }
}));

// Middleware para manejo de datos y cookies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));
app.use(cookieParser());

// Confirmación de URL del frontend
console.log('FRONTEND_URL:', FRONTEND_URL);

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/car", carRoutes);
app.use("/api", scraperRoutes);

// Sirve los archivos estáticos de la carpeta "build"
app.use(express.static(path.join(__dirname, 'build')));

// Redirige todas las rutas desconocidas a "index.html" para que React maneje el enrutado
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(err.status || 500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

export default app;
