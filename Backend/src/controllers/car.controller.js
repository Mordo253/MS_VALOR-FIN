import mongoose from 'mongoose';
import Car from '../models/car.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const createCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, ...carData } = req.body;

    // Validaciones iniciales
    if (!carData.title || !carData.car || !carData.tractionType) {
      throw new Error("Campos requeridos: título, tipo de carro y tipo de tracción son obligatorios");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    // Generar el código único para el nuevo carro
    const lastCar = await Car.findOne()
      .sort({ createdAt: -1 })
      .select("codigo")
      .exec();

    let newCode = "MSV-001"; // Código inicial
    if (lastCar?.codigo) {
      const lastCodeNumber = parseInt(lastCar.codigo.split("-")[1], 10);
      newCode = `CAR-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    // Procesamiento de imágenes
    const processedImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const img of images) {
      try {
        if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
          // Validar tamaño de imagen
          const approximateSize = img.file.length * 0.75;
          if (approximateSize > maxSize) {
            throw new Error(`Imagen ${img.public_id || 'nueva'} excede el tamaño máximo de 5MB`);
          }

          // Subir nueva imagen
          const result = await uploadImage(img.file);
          if (result) {
            processedImages.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width || 0,
              height: result.height || 0,
              format: result.format,
              resource_type: result.resource_type
            });
          }
        } else if (img.secure_url && !img.secure_url.startsWith('blob:')) {
          // Mantener imagen existente
          processedImages.push({
            public_id: img.public_id,
            secure_url: img.secure_url,
            width: img.width || 0,
            height: img.height || 0,
            format: img.format,
            resource_type: img.resource_type
          });
        }
      } catch (error) {
        console.error('Error procesando imagen:', error);
        throw new Error(`Error al procesar imagen: ${error.message}`);
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente");
    }

    // Crear el nuevo carro
    const newCar = new Car({
      ...carData,
      codigo: newCode,
      model: Number(carData.model) || 0,
      price: Number(carData.price) || 0,
      kilometer: Number(carData.kilometer) || 0,
      disponible: Boolean(carData.disponible),
      images: processedImages,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Guardar el carro
    const savedCar = await newCar.save({ session });
    await session.commitTransaction();

    // Log de éxito
    console.log('Carro creado exitosamente:', {
      id: savedCar._id,
      codigo: savedCar.codigo,
      imágenes: savedCar.images.length
    });

    // Enviar respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Carro creado exitosamente",
      data: savedCar,
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createCar:", {
      message: error.message,
      stack: error.stack
    });

    // Determinar el código de estado HTTP apropiado
    const statusCode = error.message.includes("requeridos") || 
                      error.message.includes("imagen") ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
      error: {
        type: error.name,
        details: error.message,
        path: error.path
      }
    });
  } finally {
    session.endSession();
  }
};


export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    console.error('Error en getAllCars:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de vehículo inválido' });
    }
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.error('Error en getCarById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id: carId } = req.params;
    const {
      title, car, codigo, tractionType, model, price, kilometer, disponible,
      description, images, imagesToDelete
    } = req.body;

    // Buscar el carro existente
    let carData = await Car.findById(carId);
    if (!carData) {
      return res.status(404).json({ 
        success: false,
        message: "Carro no encontrado" 
      });
    }

    // Validaciones iniciales
    if (!images || images.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Debe incluir al menos una imagen" 
      });
    }

    // Validar datos numéricos
    const validNumber = (value) => !isNaN(Number(value)) && isFinite(value);
    
    if (model && !validNumber(model)) {
      return res.status(400).json({ 
        success: false,
        message: "El modelo debe ser un número válido" 
      });
    }
    
    if (price && !validNumber(price)) {
      return res.status(400).json({ 
        success: false,
        message: "El precio debe ser un número válido" 
      });
    }
    
    if (kilometer && !validNumber(kilometer)) {
      return res.status(400).json({ 
        success: false,
        message: "El kilometraje debe ser un número válido" 
      });
    }

    // Actualizar campos básicos del carro con validación de nulos
    carData.title = title ?? carData.title;
    carData.car = car ?? carData.car;
    carData.codigo = codigo ?? carData.codigo;
    carData.tractionType = tractionType ?? carData.tractionType;
    carData.model = validNumber(model) ? Number(model) : carData.model;
    carData.price = validNumber(price) ? Number(price) : carData.price;
    carData.kilometer = validNumber(kilometer) ? Number(kilometer) : carData.kilometer;
    carData.disponible = disponible !== undefined ? Boolean(disponible) : carData.disponible;
    carData.description = description ?? carData.description;

    // Manejar eliminación de imágenes
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        if (publicId && !publicId.startsWith('temp_')) {
          try {
            await deleteImage(publicId);
            console.log(`Imagen eliminada exitosamente: ${publicId}`);
          } catch (error) {
            console.error(`Error al eliminar imagen ${publicId}:`, error);
          }
        }
      }
    }

    // Procesar imágenes
    const processedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        try {
          if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
            // Es una nueva imagen en base64
            const result = await uploadImage(img.file);
            if (result) {
              processedImages.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type
              });
            }
          } else if (img.secure_url && !img.secure_url.startsWith('blob:')) {
            // Es una imagen existente válida
            processedImages.push({
              public_id: img.public_id,
              secure_url: img.secure_url,
              width: img.width || 0,
              height: img.height || 0,
              format: img.format,
              resource_type: img.resource_type
            });
          }
        } catch (error) {
          console.error('Error procesando imagen:', error);
        }
      }
    }

    // Validar que haya imágenes después del procesamiento
    if (processedImages.length === 0) {
      return res.status(400).json({ message: "No se pudo procesar ninguna imagen correctamente" });
    }

    // Actualizar el array de imágenes del carro
    carData.images = processedImages;

    // Actualizar fecha de modificación
    carData.updatedAt = new Date();

    // Guardar los cambios
    const updatedCar = await carData.save();

    // Enviar respuesta exitosa
    res.status(200).json({ 
      success: true,
      message: "Carro actualizado exitosamente",
      data: updatedCar 
    });

  } catch (error) {
    console.error("Error al actualizar el carro:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar el carro",
      error: error.message 
    });
  }
};


export const deleteCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de vehículo inválido');
    }

    const car = await Car.findById(id).session(session);
    if (!car) {
      throw new Error('Vehículo no encontrado');
    }

    for (const image of car.images) {
      await deleteImage(image.public_id);
    }

    await Car.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    res.status(200).json({ success: true, message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en deleteCar:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { disponible },
      { new: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    res.json({ data: updatedCar });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
};

