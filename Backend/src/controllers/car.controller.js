import mongoose from 'mongoose';
import Car from '../models/car.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// ✅ Crear vehículo
export const createCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { images, videos, creador, propietario, ...vehicleData } = req.body;
    if (!vehicleData.title || !vehicleData.price || !vehicleData.brand) {
      throw new Error("Los campos título, precio y marca son obligatorios.");
    }
    if (!creador || !propietario) {
      throw new Error("Los campos creador y propietario son obligatorios.");
    }
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen.");
    }
    if (videos && (!Array.isArray(videos) || videos.some(video => !video.id || !video.url))) {
      throw new Error("El campo videos debe contener objetos con id y url válidos.");
    }

    const lastVehicle = await Car.findOne().sort({ createdAt: -1 }).select("codigo").exec();
    let newCode = "CAR-00001";
    if (lastVehicle?.codigo) {
      const lastCodeNumber = parseInt(lastVehicle.codigo.split("-")[1], 10);
      newCode = `CAR-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    const processedImages = [];
    for (const img of images) {
      if (img.file && (typeof img.file === 'string') && img.file.startsWith('data:')) {
        const result = await uploadImage(img.file, 'vehicles', newCode);
        if (result) {
          processedImages.push({
            ...result,
            width: result.width || 1,
            height: result.height || 1,
            isMain: img.isMain || false,
            gridPosition: img.gridPosition || 0
          });
        }
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente.");
    }

    const newVehicle = new Car({
      ...vehicleData,
      codigo: newCode,
      creador,
      propietario,
      videos: videos || [],
      images: processedImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedVehicle = await newVehicle.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, message: "Vehículo creado exitosamente", data: savedVehicle });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Actualizar vehículo
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de vehículo inválido" });
    }

    const { images, imagesToDelete, ...updateData } = req.body;
    console.log("Datos recibidos en el backend - updateCar:", { 
      imageCount: images?.length, 
      imagesToDeleteCount: imagesToDelete?.length 
    });
    
    const vehicle = await Car.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    }

    // Paso 1: Eliminar imágenes solicitadas
    if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
      console.log("Imágenes a eliminar:", imagesToDelete);
      for (const publicId of imagesToDelete) {
        if (publicId) {
          await deleteImage(publicId, "vehicles", vehicle.codigo);
        }
      }
    }

    // Paso 2: Procesar nuevas imágenes (con campo 'file' que empieza con data:)
    const newUploadedImages = [];
    if (Array.isArray(images)) {
      for (const img of images) {
        if (img.file && typeof img.file === 'string' && img.file.startsWith("data:")) {
          console.log("Procesando nueva imagen para subir");
          const result = await uploadImage(img.file, "vehicles", vehicle.codigo);
          if (result) {
            // Añadir propiedades adicionales que maneja el frontend
            newUploadedImages.push({
              ...result,
              width: result.width || 1,
              height: result.height || 1,
              format: img.format || '',
              isMain: img.isMain || false,
              gridPosition: img.gridPosition || 0
            });
          }
        }
      }
    }

    // Paso 3: Reorganizar las imágenes existentes y combinar con las nuevas
    let updatedImages = [];
    
    if (Array.isArray(images) && images.length > 0) {
      // Crear un mapa de las imágenes existentes por public_id para acceso rápido
      const existingImagesMap = {};
      vehicle.images.forEach(img => {
        if (img.public_id) {
          existingImagesMap[img.public_id] = {
            public_id: img.public_id,
            secure_url: img.secure_url,
            width: img.width || 1,
            height: img.height || 1,
            format: img.format || '',
            resource_type: img.resource_type || 'image'
          };
        }
      });
      
      // Filtrar las imágenes existentes (sin campo file y que no estén en imagesToDelete)
      const retainedImages = images
        .filter(img => !img.file && img.public_id && (!imagesToDelete || !imagesToDelete.includes(img.public_id)))
        .map(img => {
          // Mantener todas las propiedades originales de la imagen existente
          const originalImg = existingImagesMap[img.public_id];
          if (originalImg) {
            return {
              ...originalImg,
              isMain: img.isMain || false,
              gridPosition: img.gridPosition || 0
            };
          }
          return img;
        });
      
      // Combinar imágenes existentes con nuevas subidas manteniendo el orden
      updatedImages = [...retainedImages, ...newUploadedImages];
      
      // Asegurarse de que la imagen principal está marcada correctamente
      updatedImages = updatedImages.map((img, index) => ({
        ...img,
        isMain: index === 0, // La primera es siempre la principal
        gridPosition: index
      }));
    } else {
      // Si no se proporciona un nuevo orden, mantener las imágenes existentes y añadir nuevas
      const existingImages = vehicle.images.filter(img => 
        !imagesToDelete || !imagesToDelete.includes(img.public_id)
      );
      updatedImages = [...existingImages, ...newUploadedImages];
    }

    // Actualizar el vehículo con todas las modificaciones
    Object.assign(vehicle, updateData, { 
      images: updatedImages,
      updatedAt: new Date() 
    });
    
    // Guardar los cambios en la base de datos
    const updatedVehicle = await vehicle.save();
    console.log("Vehículo actualizado exitosamente con", updatedImages.length, "imágenes");
    
    res.json({ 
      success: true, 
      message: "Vehículo actualizado exitosamente", 
      data: updatedVehicle 
    });
  } catch (error) {
    console.error("Error en updateCar:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar vehículo
export const deleteCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de vehículo inválido" });
    }
    const vehicle = await Car.findById(id).session(session);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    }
    for (const image of vehicle.images) {
      await deleteImage(image.public_id, "vehicles", vehicle.codigo);
    }
    await Car.findByIdAndDelete(id).session(session);
    await session.commitTransaction();

    res.status(200).json({ success: true, message: "Vehículo eliminado correctamente" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Obtener todos los vehículos
export const getAllCars = async (_req, res) => {
  try {
    const vehicles = await Car.find();
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener un vehículo por ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de vehículo inválido" });
    }
    const vehicle = await Car.findById(id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehículo no encontrado" });

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Actualizar disponibilidad
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de vehículo inválido" });
    }
    
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { disponible, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    }

    res.json({ success: true, data: updatedCar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener códigos de vehículos (endpoint adicional)
export const getVehicleCodes = async (_req, res) => {
  try {
    const codes = await Car.find().select("codigo").lean();
    const codeList = codes.map(item => item.codigo);
    res.status(200).json({ success: true, data: codeList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};