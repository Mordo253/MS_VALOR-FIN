import mongoose from 'mongoose';
import Post from './models/post.model.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://estebandesarrollo1548:d1NlTd7es2xJjiV3@mscloud.7hfnc.mongodb.net/';
const BATCH_SIZE = 100; // Número de documentos a procesar por lote

async function updatePostCodes() {
  let connection;
  
  try {
    // Conectar a MongoDB con opciones mejoradas
    console.log('🔄 Conectando a MongoDB...');
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Conexión establecida correctamente');

    // Contar total de posts
    const totalPosts = await Post.countDocuments();
    console.log(`📊 Total de posts encontrados: ${totalPosts}`);
    
    if (totalPosts === 0) {
      console.log('⚠️ No se encontraron posts para actualizar');
      return;
    }

    // Variables para seguimiento
    let processedCount = 0;
    let errors = [];
    let startTime = Date.now();

    // Procesar en lotes para mejor rendimiento
    for (let skip = 0; skip < totalPosts; skip += BATCH_SIZE) {
      const posts = await Post.find()
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(BATCH_SIZE);

      // Actualizar posts en el lote actual
      const updates = posts.map((post, index) => {
        const currentNumber = skip + index + 1;
        const codigo = `POST-${String(currentNumber).padStart(5, '0')}`;
        return {
          updateOne: {
            filter: { _id: post._id },
            update: { $set: { codigo } },
            upsert: false
          }
        };
      });

      // Ejecutar actualizaciones en bulk
      try {
        const result = await Post.bulkWrite(updates, { ordered: false });
        processedCount += result.modifiedCount;
        
        // Mostrar progreso
        const progress = ((processedCount / totalPosts) * 100).toFixed(1);
        console.log(`🔄 Progreso: ${progress}% (${processedCount}/${totalPosts})`);
      } catch (error) {
        errors.push(`Error en lote ${skip/BATCH_SIZE + 1}: ${error.message}`);
      }
    }

    // Mostrar resumen final
    const duration = (Date.now() - startTime) / 1000;
    console.log('\n📊 Resumen de la actualización:');
    console.log(`✅ Posts actualizados: ${processedCount}`);
    console.log(`⚡ Tiempo total: ${duration.toFixed(2)} segundos`);
    console.log(`📈 Velocidad: ${(processedCount/duration).toFixed(2)} posts/segundo`);
    
    if (errors.length > 0) {
      console.log('\n⚠️ Errores encontrados:');
      errors.forEach(error => console.log(`- ${error}`));
    }

  } catch (error) {
    console.error('\n❌ Error crítico:', error.message);
    process.exit(1);
  } finally {
    // Cerrar conexión de manera segura
    if (connection) {
      try {
        await mongoose.connection.close();
        console.log('\n✅ Conexión a MongoDB cerrada correctamente');
      } catch (error) {
        console.error('❌ Error al cerrar la conexión:', error.message);
      }
    }
  }
}

// Ejecutar el script con manejo de errores global
updatePostCodes()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });