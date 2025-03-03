import mongoose from 'mongoose';
import Property from '../models/property.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// ✅ Crear propiedad
export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Datos recibidos en el backend:", req.body);


  try {
    const { images, caracteristicas, videos, creador, propietario, ...propertyData } = req.body;

    if (!propertyData.title || !propertyData.ciudad || !propertyData.costo) {
      throw new Error("Los campos título, ciudad y costo son obligatorios.");
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
    if (!Array.isArray(caracteristicas)) {
      throw new Error("Las características deben ser un array válido.");
    }

    const lastProperty = await Property.findOne().sort({ createdAt: -1 }).select("codigo").exec();
    let newCode = "MSV-00001";
    if (lastProperty?.codigo) {
      const lastCodeNumber = parseInt(lastProperty.codigo.split("-")[1], 10);
      newCode = `MSV-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    const processedImages = [];
    for (const img of images) {
      if (img.file && img.file.startsWith('data:')) {
        const result = await uploadImage(img.file, 'properties', newCode);
        if (result) {
          processedImages.push(result);
        }
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente.");
    }

    const newProperty = new Property({
      ...propertyData,
      codigo: newCode,
      creador,
      propietario,
      videos: videos || [],
      caracteristicas,
      images: processedImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedProperty = await newProperty.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, message: "Propiedad creada exitosamente", data: savedProperty });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Actualizar propiedad
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de propiedad inválido" });
    }

    const { images, imagesToDelete, ...updateData } = req.body;
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Propiedad no encontrada" });
    }

    if (Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        await deleteImage(publicId, "properties", property.codigo);
      }
      property.images = property.images.filter(img => !imagesToDelete.includes(img.public_id));
    }

    if (Array.isArray(images)) {
      for (const img of images) {
        if (img.file && img.file.startsWith("data:")) {
          const result = await uploadImage(img.file, "properties", property.codigo);
          if (result) property.images.push(result);
        }
      }
    }

    Object.assign(property, updateData, { updatedAt: new Date() });
    await property.save();

    res.json({ success: true, message: "Propiedad actualizada exitosamente", data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener todas las propiedades
export const getAllProperties = async (_req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error('Error en getAllProperties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener una propiedad por ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de propiedad inválido' });
    }
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error('Error en getPropertyById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar propiedad
export const deleteProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de propiedad inválido' });
    }

    const property = await Property.findById(id).session(session);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
    }

    for (const image of property.images) {
      await deleteImage(image.public_id, 'properties', property.codigo);
    }

    await Property.findByIdAndDelete(id).session(session);
    await session.commitTransaction();

    res.status(200).json({ success: true, message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Obtener códigos de propiedades
export const getPropertyCodes = async (_req, res) => {
  try {
    const properties = await Property.find({}, 'codigo');
    const codes = properties.map(prop => prop.codigo);
    res.status(200).json({ success: true, data: codes });
  } catch (error) {
    console.error('Error al obtener códigos de propiedades:', error);
    res.status(500).json({ success: false, message: 'Error al obtener códigos de propiedades' });
  }
};

// ✅ Actualizar disponibilidad de la propiedad
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de propiedad inválido' });
    }

    const { disponible } = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(id, { disponible }, { new: true });
    
    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
    }

    res.json({ success: true, data: updatedProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar disponibilidad' });
  }
};