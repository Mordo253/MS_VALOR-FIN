import mongoose from 'mongoose';
import Car from './models/car.model.js'; // Ajusta la ruta según la ubicación de tu modelo

const startUpdating = async () => {
  await mongoose.connect('mongodb+srv://estebandesarrollo1548:d1NlTd7es2xJjiV3@mscloud.7hfnc.mongodb.net/'); // Asegúrate de poner la URL correcta de tu base de datos
  
  try {
    // Obtén todas las propiedades
    const cars = await Car.find();
    let counter = 1;

    for (const car of cars) {
      // Formatea el código "MSV-00000" usando el contador
      const creador = "Juan Fernando González";
      const propietario = " ";
      car.creador = creador;
      car.propietario = propietario;
      await car.save();
      counter += 1;
    }

    console.log('Contenido actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
  } finally {
    mongoose.connection.close();
  }
};

startUpdating();
