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
      if (img.file && img.file.startsWith('data:')) {
        const result = await uploadImage(img.file, 'vehicles', newCode);
        if (result) {
          processedImages.push(result);
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
    const vehicle = await Car.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    }

    if (Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        await deleteImage(publicId, "vehicles", vehicle.codigo);
      }
      vehicle.images = vehicle.images.filter(img => !imagesToDelete.includes(img.public_id));
    }

    if (Array.isArray(images)) {
      for (const img of images) {
        if (img.file && img.file.startsWith("data:")) {
          const result = await uploadImage(img.file, "vehicles", vehicle.codigo);
          if (result) vehicle.images.push(result);
        }
      }
    }

    Object.assign(vehicle, updateData, { updatedAt: new Date() });
    await vehicle.save();

    res.json({ success: true, message: "Vehículo actualizado exitosamente", data: vehicle });
  } catch (error) {
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

