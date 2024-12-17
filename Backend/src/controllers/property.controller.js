import mongoose from 'mongoose'; 
import Property from '../models/property.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, caracteristicas, ...propertyData } = req.body;

    // Validaciones iniciales
    if (!propertyData.title || !propertyData.ciudad || !propertyData.costo) {
      throw new Error("Campos requeridos: título, ciudad y costo son obligatorios");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
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

    // Crear la nueva propiedad
    const newProperty = new Property({
      ...propertyData,
      codigo: newCode,
      // Convertir campos numéricos
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
      // Otros campos
      disponible: Boolean(propertyData.disponible),
      caracteristicas: caracteristicas.map(caract => ({
        name: caract.name,
        type: caract.type
      })),
      images: processedImages,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Guardar la propiedad
    const savedProperty = await newProperty.save({ session });
    await session.commitTransaction();

    // Log de éxito
    console.log('Propiedad creada exitosamente:', {
      id: savedProperty._id,
      codigo: savedProperty.codigo,
      caracteristicas: savedProperty.caracteristicas.length,
      imagenes: savedProperty.images.length
    });

    // Enviar respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Propiedad creada exitosamente",
      data: savedProperty,
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createProperty:", {
      message: error.message,
      stack: error.stack
    });

    // Determinar el código de estado HTTP apropiado
    const statusCode = error.message.includes("requeridos") || 
                      error.message.includes("características") ? 400 : 500;

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

// Controlador para actualizar una propiedad
export const updateProperty = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const {
      title, pais, departamento, ciudad, zona, areaConstruida, areaTerreno, areaPrivada,
      alcobas, costo, banos, garaje, estrato, piso, tipoInmueble, tipoNegocio, estado,
      valorAdministracion, anioConstruccion, caracteristicas, description, images,
      imagesToDelete
    } = req.body;

    // Buscar la propiedad existente
    let property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Validar que haya al menos una imagen
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "Debe incluir al menos una imagen" });
    }

    // Actualizar campos básicos de la propiedad
    property.title = title ?? property.title;
    property.pais = pais ?? property.pais;
    property.departamento = departamento ?? property.departamento;
    property.ciudad = ciudad ?? property.ciudad;
    property.zona = zona ?? property.zona;
    property.areaConstruida = Number(areaConstruida) || property.areaConstruida;
    property.areaTerreno = Number(areaTerreno) || property.areaTerreno;
    property.areaPrivada = Number(areaPrivada) || property.areaPrivada;
    property.alcobas = Number(alcobas) || property.alcobas;
    property.costo = Number(costo) || property.costo;
    property.banos = Number(banos) || property.banos;
    property.garaje = Number(garaje) || property.garaje;
    property.estrato = Number(estrato) || property.estrato;
    property.piso = Number(piso) || property.piso;
    property.tipoInmueble = tipoInmueble ?? property.tipoInmueble;
    property.tipoNegocio = tipoNegocio ?? property.tipoNegocio;
    property.estado = estado ?? property.estado;
    property.valorAdministracion = Number(valorAdministracion) || property.valorAdministracion;
    property.anioConstruccion = Number(anioConstruccion) || property.anioConstruccion;
    property.description = description ?? property.description;

    // Actualizar características
    if (caracteristicas && Array.isArray(caracteristicas)) {
      property.caracteristicas = caracteristicas;
    }

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

    // Actualizar el array de imágenes de la propiedad
    property.images = processedImages;

    // Actualizar fecha de modificación
    property.updatedAt = new Date();

    // Guardar los cambios
    const updatedProperty = await property.save();

    // Enviar respuesta exitosa
    res.status(200).json({ 
      success: true,
      message: "Propiedad actualizada exitosamente",
      data: updatedProperty 
    });

  } catch (error) {
    console.error("Error al actualizar la propiedad:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar la propiedad",
      error: error.message 
    });
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
