import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { SheetsSyncService } from './services/sheetsSyncService.js';
import { testConnections } from './utils/testConnection.js';

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import scraperRoutes from "./routes/scraper.routes.js";
import carRoutes from "./routes/car.routes.js";
import postRoutes from "./routes/post.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import publicRoutes from "./routes/publicaciones.routes.js";

// Cargar variables de entorno
dotenv.config();

// Crear dos aplicaciones Express separadas
const mainApp = express();
const syncApp = express();

// Variables de configuración
const MONGODB_URI = process.env.MONGODB_URI;
const MAIN_PORT = process.env.PORT || 3000;
const SYNC_PORT = process.env.SYNC_PORT || 3001;

// Servicio de sincronización con Google Sheets
let syncService;

// Configuración de CORS
const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL,
    'https://msdevalor.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3002'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Configurar mainApp (Aplicación principal)
mainApp.use(cors(corsOptions));
mainApp.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' }
}));
mainApp.use(morgan("dev"));
mainApp.use(cookieParser());
mainApp.use(express.json({ limit: '50mb' }));
mainApp.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar syncApp (Aplicación de sincronización)
syncApp.use(cors(corsOptions));
syncApp.use(express.json());
syncApp.use(morgan("dev"));

// Función de inicialización de servicios
const initializeServices = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // Conectar a MongoDB solo si no está conectado
            await mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('✅ MongoDB conectado correctamente');
        }

        // Verificar conexión con Google Sheets
        await testConnections();
        console.log('✅ Google Sheets conectado correctamente');

        // Inicializar servicio de sincronización
        if (!syncService) {
            syncService = new SheetsSyncService();
            await syncService.initialize();
            
            // Configurar observadores para las colecciones
            const collections = ['posts', 'properties', 'cars'];
            for (const collection of collections) {
                await syncService.watchCollection(collection);
                console.log(`✅ Observando colección: ${collection}`);
            }
            
            console.log('✅ Servicio de sincronización iniciado correctamente');
        }
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        throw error; // Propagar el error para manejo superior
    }
};

// Rutas para mainApp
mainApp.use("/api/auth", authRoutes);
mainApp.use("/api/property", propertyRoutes);
mainApp.use("/api/car", carRoutes);
mainApp.use("/api/post", postRoutes);
mainApp.use("/api/service", serviceRoutes);
mainApp.use("/api/public", publicRoutes);
mainApp.use("/api", scraperRoutes);

// Rutas para syncApp
syncApp.get('/sync/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState;
    const mongoStates = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            mongodb: {
                status: mongoStates[mongoStatus] || 'Unknown',
                connected: mongoStatus === 1
            },
            googleSheets: {
                status: Boolean(syncService) ? 'Connected' : 'Disconnected',
                connected: Boolean(syncService)
            }
        },
        environment: process.env.NODE_ENV,
        uptime: process.uptime()
    });
});

// Middleware para rutas no encontradas
mainApp.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

syncApp.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta de sincronización no encontrada'
    });
});

// Manejador de errores global
const errorHandler = (err, req, res, next) => {
    console.error('Error en el servidor:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method
    });

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? {
            details: err.message,
            stack: err.stack
        } : 'Error interno'
    });
};

// Aplicar manejador de errores a ambas apps
mainApp.use(errorHandler);
syncApp.use(errorHandler);

// Exportar todo lo necesario
export default {
    mainApp,
    syncApp,
    initializeServices,
    MAIN_PORT,
    SYNC_PORT,
    syncService
};