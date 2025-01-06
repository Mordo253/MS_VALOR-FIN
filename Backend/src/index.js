import app from "./app.js";
import { connectDB } from "./db.js";
import mongoose from "mongoose";

async function main() {
    try {
        // Conectar a MongoDB
        await connectDB();
        console.log('✅ MongoDB conectado correctamente');

        // Inicializar servicios
        await app.initializeServices();

        // Iniciar servidor principal
        app.mainApp.listen(app.MAIN_PORT, () => {
            console.log(`🚀 Servidor principal corriendo en puerto ${app.MAIN_PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
            console.log(`📅 Fecha de inicio: ${new Date().toISOString()}`);
        });

        // Iniciar servidor de sincronización
        app.syncApp.listen(app.SYNC_PORT, () => {
            console.log(`📊 Servidor de sincronización corriendo en puerto ${app.SYNC_PORT}`);
        });

    } catch (error) {
        console.error('❌ Error durante el inicio:', error);
        await cleanup();
        process.exit(1);
    }
}

// Función de limpieza
async function cleanup() {
    try {
        await mongoose.connection.close();
        console.log('✅ Conexiones cerradas correctamente');
    } catch (error) {
        console.error('❌ Error durante el cierre:', error);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🛑 Iniciando cierre graceful...');
    await cleanup();
    process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', async (error) => {
    console.error('❌ Error no capturado:', error);
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    await cleanup();
    process.exit(1);
});

// Iniciar la aplicación
main().catch(async (error) => {
    console.error('❌ Error fatal:', error);
    await cleanup();
    process.exit(1);
});