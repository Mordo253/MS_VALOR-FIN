import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import scraperRoutes from "./routes/scraper.routes.js";
import carRoutes from "./routes/car.routes.js";
import { updateFinancialData, getFinancialData } from './controllers/scraper.controller.js';
import { FRONTEND_URL } from "./config.js";

const app = express();

// Verifica si la variable de entorno FRONTEND_URL se carga correctamente
console.log('FRONTEND_URL:', FRONTEND_URL);  // Aquí imprimimos el valor de FRONTEND_URL

// CORS: Permitir solicitudes desde el frontend
app.use(cors({
    origin: FRONTEND_URL, // El frontend debe ser especificado aquí
    credentials: true, // Permitir cookies/credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // Preflight cache duration
}));

// Configuración de seguridad con Helmet
app.use(helmet({
    contentSecurityPolicy: false, // Deshabilitado si usas políticas CSP personalizadas
    crossOriginEmbedderPolicy: false, // Deshabilitado si no se usa COEP
    xssFilter: true, // Protege contra XSS
    noSniff: true, // Deshabilita la detección de contenido
    hidePoweredBy: true, // Esconde información de tecnología utilizada
    frameguard: { action: 'deny' } // Impide que la página se cargue en un iframe
}));

// Middleware de parseo y manejo de cookies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));
app.use(cookieParser());

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/car", carRoutes);
app.use("/api", scraperRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Si es un error de MongoDB
    if (err.name === 'MongoError' || err.name === 'ValidationError') {
        return res.status(422).json({
            message: 'Error de base de datos',
            error: err.message
        });
    }

    // Si es un error de autenticación
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Error de autenticación',
            error: err.message
        });
    }

    // Error genérico
    res.status(err.status || 500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido. Cerrando servidor gracefully...');
    process.exit(0);
});

// Manejo de promesas no capturadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa no manejada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    process.exit(1);
});

export default app;
