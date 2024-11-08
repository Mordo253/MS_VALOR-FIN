import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import scraperRoutes from "./routes/scraper.routes.js";
import carRoutes from "./routes/car.routes.js";
import { FRONTEND_URL } from "./config.js";

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
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

// Servir archivos estáticos y manejar rutas del frontend en producción
if (process.env.NODE_ENV === 'production') {
    // Servir archivos estáticos desde el directorio dist de React
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Manejar todas las rutas que no sean API
    app.get('/*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        } else {
            next();
        }
    });
}

// Manejo de errores 404 para rutas de API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "API recurso no encontrado" });
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