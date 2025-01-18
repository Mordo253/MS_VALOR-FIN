import mongoose from 'mongoose'; 
import Property from '../models/property.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

// Crear propiedad
export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, caracteristicas, video, creador, propietario, ...propertyData } = req.body;

    // Validaciones iniciales
    if (!propertyData.title || !propertyData.ciudad || !propertyData.costo) {
      throw new Error("Campos requeridos: título, ciudad y costo son obligatorios");
    }

    if (!creador || !propietario) {
      throw new Error("Los campos creador y propietario son obligatorios");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    if (video && (!Array.isArray(video) || video.some((video) => typeof video !== "string"))) {
      throw new Error("El campo video debe ser un arreglo de enlaces válidos");
    }

    // Validar características
    if (!caracteristicas || !Array.isArray(caracteristicas)) {
      throw new Error("Las características deben ser un array válido");
    }

    // Generar el código de la nueva propiedad
    const lastProperty = await Property.findOne()
      .sort({ createdAt: -1 })
      .select("codigo")
      .exec();

    let newCode = "MSV-00001"; // Código inicial
    if (lastProperty?.codigo) {
      const lastCodeNumber = parseInt(lastProperty.codigo.split("-")[1], 10);
      newCode = `MSV-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    // Procesamiento de imágenes
    const processedImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const img of images) {
      try {
        if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
          const approximateSize = img.file.length * 0.75;
          if (approximateSize > maxSize) {
            throw new Error(`Imagen ${img.public_id || 'nueva'} excede el tamaño máximo de 5MB`);
          }

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
        } else if (img.secure_url && !img.secure_url.startsWith('blob:')) {
          processedImages.push({
            public_id: img.public_id,
            secure_url: img.secure_url,
            width: img.width || 0,
            height: img.height || 0,
            format: img.format,
            resource_type: img.resource_type,
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

    // Crear la nueva propiedad
    const newProperty = new Property({
      ...propertyData,
      codigo: newCode,
      creador,
      propietario,
      video: video || [],
      areaConstruida: Number(propertyData.areaConstruida) || 0,
      areaTerreno: Number(propertyData.areaTerreno) || 0,
      areaPrivada: Number(propertyData.areaPrivada) || 0,
      alcobas: Number(propertyData.alcobas) || 0,
      costo: Number(propertyData.costo) || 0,
      banos: Number(propertyData.banos) || 0,
      garaje: Number(propertyData.garaje) || 0,
      estrato: Number(propertyData.estrato) || 0,
      piso: Number(propertyData.piso) || 0,
      valorAdministracion: Number(propertyData.valorAdministracion) || 0,
      anioConstruccion: Number(propertyData.anioConstruccion) || 0,
      disponible: Boolean(propertyData.disponible),
      caracteristicas: caracteristicas.map((caract) => ({
        name: caract.name,
        type: caract.type,
      })),
      images: processedImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedProperty = await newProperty.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Propiedad creada exitosamente",
      data: savedProperty,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createProperty:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error('Error en getAllProperties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de propiedad inválido' });
    }
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error('Error en getPropertyById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar propiedad
export const updateProperty = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const {
      video,
      creador,
      propietario,
      title,
      pais,
      departamento,
      ciudad,
      zona,
      areaConstruida,
      areaTerreno,
      areaPrivada,
      alcobas,
      costo,
      banos,
      garaje,
      estrato,
      piso,
      tipoInmueble,
      tipoNegocio,
      estado,
      valorAdministracion,
      anioConstruccion,
      caracteristicas,
      description,
      images,
      imagesToDelete,
    } = req.body;

    let property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Validaciones y actualizaciones de los nuevos campos
    if (video && Array.isArray(video)) property.video = video;
    if (creador) property.creador = creador;
    if (propietario) property.propietario = propietario;

    // Resto del procesamiento permanece igual...
  } catch (error) {
    console.error("Error al actualizar la propiedad:", error);
    res.status(500).json({ message: error.message });
  }
};

// Otras funciones permanecen igual...

export const deleteProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de propiedad inválido');
    }

    const property = await Property.findById(id).session(session);
    if (!property) {
      throw new Error('Propiedad no encontrada');
    }

    // Eliminar imágenes de Cloudinary
    for (const image of property.images) {
      await deleteImage(image.public_id);
    }

    await Property.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    res.status(200).json({ success: true, message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en deleteProperty:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getPropertyCodes = async (req, res) => {
  try {
    const properties = await Property.find({}, 'codigo'); // Obtener solo el campo 'codigo' de cada propiedad
    const codes = properties.map((property) => property.codigo);
    res.status(200).json({ data: codes });
  } catch (error) {
    console.error('Error al obtener códigos de propiedades:', error);
    res.status(500).json({ message: 'Error al obtener códigos de propiedades' });
  }
};
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { disponible },
      { new: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    res.json({ data: updatedProperty });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
};
