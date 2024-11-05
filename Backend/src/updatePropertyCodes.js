import mongoose from 'mongoose';
import Property from './models/property.model.js'; // Ajusta la ruta según la ubicación de tu modelo

const startUpdating = async () => {
  await mongoose.connect('mongodb+srv://estebandesarrollo1548:d1NlTd7es2xJjiV3@mscloud.7hfnc.mongodb.net/'); // Asegúrate de poner la URL correcta de tu base de datos
  
  try {
    // Obtén todas las propiedades
    const properties = await Property.find();
    let counter = 1;

    for (const property of properties) {
      // Formatea el código "MSV-00000" usando el contador
      const codigo = `MSV-${String(counter).padStart(5, '0')}`;
      property.codigo = codigo;
      await property.save();
      counter += 1;
    }

    console.log('Códigos actualizados correctamente');
  } catch (error) {
    console.error('Error al actualizar los códigos:', error);
  } finally {
    mongoose.connection.close();
  }
};

startUpdating();
