import mongoose from 'mongoose';
import Car from '../models/car.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

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

    let newCode = "CAR-00001"; // Código inicial
    if (lastCar?.codigo) {
      const lastCodeNumber = parseInt(lastCar.codigo.split("-")[1], 10);
      newCode = `CAR-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    // Procesamiento de imágenes
    const processedImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const img of images) {
      if (img.file && typeof img.file === "string" && img.file.startsWith("data:")) {
        // Validar tamaño de imagen
        const approximateSize = img.file.length * 0.75;
        if (approximateSize > maxSize) {
          throw new Error(`La imagen ${img.public_id || "nueva"} excede el tamaño máximo de 5MB`);
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
            resource_type: result.resource_type,
          });
        }
      } else if (img.secure_url) {
        // Mantener imagen existente
        processedImages.push({
          public_id: img.public_id,
          secure_url: img.secure_url,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format,
          resource_type: img.resource_type,
        });
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
      updatedAt: new Date(),
    });

    // Guardar el carro
    const savedCar = await newCar.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Carro creado exitosamente",
      data: savedCar,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createCar:", error);

    res.status(error.message.includes("requeridos") || error.message.includes("imagen") ? 400 : 500).json({
      success: false,
      message: error.message,
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: carId } = req.params;
    const { images, imagesToDelete, ...carData } = req.body;

    // Buscar el carro existente
    const existingCar = await Car.findById(carId);
    if (!existingCar) {
      throw new Error("Carro no encontrado");
    }

    // Validaciones iniciales
    if (!carData.title || !carData.car || !carData.tractionType) {
      throw new Error("Campos requeridos: título, tipo de carro y tipo de tracción son obligatorios");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    // Manejar eliminación de imágenes
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        if (publicId && !publicId.startsWith("temp_")) {
          try {
            await deleteImage(publicId); // Función para eliminar imágenes del almacenamiento
          } catch (error) {
            console.error(`Error al eliminar imagen ${publicId}:`, error);
          }
        }
      }
    }

    // Procesamiento de imágenes
    const processedImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const img of images) {
      if (img.file && typeof img.file === "string" && img.file.startsWith("data:")) {
        // Validar tamaño de imagen
        const approximateSize = img.file.length * 0.75;
        if (approximateSize > maxSize) {
          throw new Error(`La imagen ${img.public_id || "nueva"} excede el tamaño máximo de 5MB`);
        }

        // Subir nueva imagen
        const result = await uploadImage(img.file); // Función para subir imágenes al almacenamiento
        if (result) {
          processedImages.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width || 0,
            height: result.height || 0,
            format: result.format || "jpg", // Valor predeterminado
            resource_type: result.resource_type || "image",
          });
        }
      } else if (img.secure_url) {
        // Mantener imagen existente
        processedImages.push({
          public_id: img.public_id || "",
          secure_url: img.secure_url,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || "jpg", // Valor predeterminado
          resource_type: img.resource_type || "image",
        });
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente");
    }

    // Actualizar datos del carro
    Object.assign(existingCar, {
      ...carData,
      model: Number(carData.model) || existingCar.model,
      price: Number(carData.price) || existingCar.price,
      kilometer: Number(carData.kilometer) || existingCar.kilometer,
      disponible: Boolean(carData.disponible),
      images: processedImages,
      updatedAt: new Date(),
    });

    // Guardar los cambios
    const updatedCar = await existingCar.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Carro actualizado exitosamente",
      data: updatedCar,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updateCar:", error);

    res.status(error.message.includes("requeridos") || error.message.includes("imagen") ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
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

