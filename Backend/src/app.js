import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import scraperRoutes from "./routes/scraper.routes.js";
import carRoutes from "./routes/car.routes.js";
import postRoutes from "./routes/post.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS actualizada usando la variable de entorno FRONTEND_URL
const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL,
    'https://www.msdevalor.com', // Usar la variable de entorno
    'http://localhost:5173',  // Frontend en desarrollo
    'http://localhost:3000'   // Frontend en preview
];

app.use(cors({
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
}));

// Configuración de Helmet para mejorar la seguridad
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' }
}));

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logger para las solicitudes HTTP
app.use(morgan("dev"));

// Middleware para manejar las cookies
app.use(cookieParser());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/car", carRoutes);
app.use("/api/post", postRoutes);
app.use("/api", scraperRoutes);

// Manejador de errores 404 para rutas de API
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
