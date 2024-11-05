import mongoose from 'mongoose';
import Property from './models/property.model.js'; // Ajusta la ruta según la ubicación de tu modelo

const startUpdatingAvailability = async () => {
  await mongoose.connect('mongodb+srv://estebandesarrollo1548:d1NlTd7es2xJjiV3@mscloud.7hfnc.mongodb.net/', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }); // Asegúrate de poner la URL correcta de tu base de datos
  
  try {
    // Obtén todas las propiedades que aún no tienen el campo "disponible"
    const properties = await Property.find({ disponible: { $exists: false } });
    let counter = 0;

    for (const property of properties) {
      // Agrega el campo "disponible" con valor predeterminado true (o false según prefieras)
      property.disponible = true;
      await property.save();
      counter += 1;
    }

    console.log(`Campo 'disponible' agregado correctamente a ${counter} propiedades.`);
  } catch (error) {
    console.error('Error al agregar el campo "disponible":', error);
  } finally {
    mongoose.connection.close();
  }
};

startUpdatingAvailability();
