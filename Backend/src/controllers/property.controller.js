import mongoose from 'mongoose';
import Property from '../models/property.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// ✅ Crear propiedad
export const createProperty = async (req, res) => {
  let session;
  try {
    // Iniciar sesión y transacción
    session = await mongoose.startSession();
    session.startTransaction();
    
    console.log("Datos recibidos en el backend:", req.body);
    console.log("IP del cliente:", req.ip);
    console.log("Agente de usuario:", req.headers['user-agent']);

    const { images, caracteristicas, videos, creador, propietario, ...propertyData } = req.body;

    // Validación exhaustiva de datos con mensajes específicos
    const validationErrors = [];
    
    // Validar campos obligatorios básicos
    if (!propertyData.title) validationErrors.push("El título es obligatorio");
    if (!propertyData.ciudad) validationErrors.push("La ciudad es obligatoria");
    if (!propertyData.costo) validationErrors.push("El costo es obligatorio");
    
    // Validar campos de identificación
    if (!creador) {
      validationErrors.push("El campo creador es obligatorio");
      console.log("Creador no especificado en la solicitud");
    } else {
      console.log("Creador identificado:", creador);
    }
    
    if (!propietario) {
      validationErrors.push("El campo propietario es obligatorio");
      console.log("Propietario no especificado en la solicitud");
    } else {
      console.log("Propietario identificado:", propietario);
    }
    
    // Validar imágenes
    if (!images) {
      validationErrors.push("El campo images es obligatorio");
    } else if (!Array.isArray(images)) {
      validationErrors.push("El campo images debe ser un array");
      console.log("Tipo de 'images' recibido:", typeof images);
    } else if (images.length === 0) {
      validationErrors.push("Debe incluir al menos una imagen");
    } else {
      console.log(`Número de imágenes recibidas: ${images.length}`);
      // Validar formato de cada imagen
      images.forEach((img, index) => {
        if (!img.file) {
          validationErrors.push(`La imagen #${index + 1} no tiene propiedad 'file'`);
        } else if (typeof img.file !== 'string' || !img.file.startsWith('data:')) {
          validationErrors.push(`La imagen #${index + 1} no tiene un formato de base64 válido`);
        }
      });
    }
    
    // Validar videos (si existen)
    if (videos) {
      if (!Array.isArray(videos)) {
        validationErrors.push("El campo videos debe ser un array");
        console.log("Tipo de 'videos' recibido:", typeof videos);
      } else {
        videos.forEach((video, index) => {
          if (!video.id) validationErrors.push(`El video #${index + 1} no tiene ID`);
          if (!video.url) validationErrors.push(`El video #${index + 1} no tiene URL`);
        });
      }
    }
    
    // Validar características
    if (!caracteristicas) {
      validationErrors.push("El campo características es obligatorio");
    } else if (!Array.isArray(caracteristicas)) {
      validationErrors.push("El campo características debe ser un array");
      console.log("Tipo de 'caracteristicas' recibido:", typeof caracteristicas);
    }
    
    // Si hay errores de validación, lanzar excepción con todos los errores
    if (validationErrors.length > 0) {
      throw new Error(`Errores de validación: ${validationErrors.join(", ")}`);
    }

    // Generar código único
    console.log("Generando código único para la propiedad...");
    const lastProperty = await Property.findOne().sort({ createdAt: -1 }).select("codigo").exec();
    let newCode = "MSV-00001";
    if (lastProperty?.codigo) {
      const lastCodeNumber = parseInt(lastProperty.codigo.split("-")[1], 10);
      newCode = `MSV-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }
    console.log("Código generado:", newCode);

    // Procesar imágenes
    console.log("Iniciando procesamiento de imágenes...");
    const processedImages = [];
    let imageErrors = [];
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        if (img.file && img.file.startsWith('data:')) {
          console.log(`Procesando imagen #${i + 1}...`);
          const result = await uploadImage(img.file, 'properties', newCode);
          if (result) {
            processedImages.push(result);
            console.log(`Imagen #${i + 1} procesada exitosamente`);
          } else {
            imageErrors.push(`La imagen #${i + 1} no pudo ser procesada (resultado nulo)`);
          }
        } else {
          imageErrors.push(`La imagen #${i + 1} no tiene un formato válido`);
        }
      } catch (imgError) {
        console.error(`Error al procesar imagen #${i + 1}:`, imgError);
        imageErrors.push(`Error al procesar imagen #${i + 1}: ${imgError.message}`);
      }
    }

    if (processedImages.length === 0) {
      throw new Error(`No se pudo procesar ninguna imagen correctamente. Errores: ${imageErrors.join(", ")}`);
    } else if (imageErrors.length > 0) {
      console.warn("Algunas imágenes no pudieron ser procesadas:", imageErrors);
    }

    // Crear la propiedad
    console.log("Creando objeto de propiedad...");
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

    // Guardar la propiedad
    console.log("Guardando propiedad en la base de datos...");
    const savedProperty = await newProperty.save({ session });
    console.log("Propiedad guardada con éxito. ID:", savedProperty._id);
    
    // Confirmar transacción
    await session.commitTransaction();
    console.log("Transacción confirmada");

    // Enviar respuesta exitosa
    res.status(201).json({ 
      success: true, 
      message: "Propiedad creada exitosamente", 
      data: savedProperty 
    });
    
  } catch (error) {
    console.error("Error en createProperty:", error);
    
    // Información detallada del error
    let errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
    
    // Si es un error de MongoDB, añadir detalles específicos
    if (error.code) {
      errorDetails.code = error.code;
      errorDetails.codeName = error.codeName;
      
      // Errores específicos de MongoDB
      if (error.code === 11000) {
        errorDetails.message = "Datos duplicados detectados. Posible propiedad ya existente.";
        if (error.keyValue) {
          errorDetails.duplicateKey = error.keyValue;
        }
      }
    }
    
    // Abortar transacción si está activa
    if (session) {
      try {
        await session.abortTransaction();
        console.log("Transacción abortada debido a un error");
      } catch (abortError) {
        console.error("Error al abortar la transacción:", abortError);
      }
    }
    
    // Determinar código de respuesta apropiado
    let statusCode = 500;
    if (error.message.includes("validación") || error.name === "ValidationError") {
      statusCode = 400;
    } else if (error.code === 11000) {
      statusCode = 409; // Conflicto por duplicación
    }
    
    // Enviar respuesta con detalles del error
    res.status(statusCode).json({ 
      success: false, 
      message: error.message,
      details: errorDetails,
      source: "createProperty"
    });
  } finally {
    // Cerrar sesión si está abierta
    if (session) {
      session.endSession();
      console.log("Sesión de base de datos cerrada");
    }
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