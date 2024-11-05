import mongoose from 'mongoose'; 
import Property from '../models/property.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

export const createProperty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar la última propiedad creada para obtener el último código
    const lastProperty = await Property.findOne().sort({ createdAt: -1 }).select('codigo').exec();
    let newCode = 'MSV-00001'; // Valor por defecto si no hay propiedades previas

    if (lastProperty?.codigo) {
      const lastCodeNumber = parseInt(lastProperty.codigo.split('-')[1], 10);
      newCode = `MSV-${String(lastCodeNumber + 1).padStart(5, '0')}`;
    }

    // Crear la nueva propiedad con el código generado
    const newProperty = new Property({
      ...req.body,
      codigo: newCode, // Agregar el código generado
      caracteristicas_internas: req.body.caracteristicas_internas || [],
      caracteristicas_externas: req.body.caracteristicas_externas || [],
    });

    if (req.files?.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const image of images) { 
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.mimetype)) {
          throw new Error('Tipo de archivo no permitido');
        }

        const result = await uploadImage(image.tempFilePath, {
          folder: 'properties',
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        });

        newProperty.images.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type
        });

        await fs.unlink(image.tempFilePath);
      }
    }

    const savedProperty = await newProperty.save({ session });
    await session.commitTransaction();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en createProperty:', error);
    res.status(500).json({ success: false, message: error.message });
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
      valorAdministracion, anioConstruccion, caracteristicas, description, images
    } = req.body;

    // Buscar la propiedad existente
    let property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Actualizar campos básicos de la propiedad usando el operador nullish (??) 
    // para mantener el valor existente si el nuevo es null o undefined
    property.title = title ?? property.title;
    property.pais = pais ?? property.pais;
    property.departamento = departamento ?? property.departamento;
    property.ciudad = ciudad ?? property.ciudad;
    property.zona = zona ?? property.zona;
    property.areaConstruida = areaConstruida ?? property.areaConstruida;
    property.areaTerreno = areaTerreno ?? property.areaTerreno;
    property.areaPrivada = areaPrivada ?? property.areaPrivada;
    property.alcobas = alcobas ?? property.alcobas;
    property.costo = costo ?? property.costo;
    property.banos = banos ?? property.banos;
    property.garaje = garaje ?? property.garaje;
    property.estrato = estrato ?? property.estrato;
    property.piso = piso ?? property.piso;
    property.tipoInmueble = tipoInmueble ?? property.tipoInmueble;
    property.tipoNegocio = tipoNegocio ?? property.tipoNegocio;
    property.estado = estado ?? property.estado;
    property.valorAdministracion = valorAdministracion ?? property.valorAdministracion;
    property.anioConstruccion = anioConstruccion ?? property.anioConstruccion;
    property.description = description ?? property.description;

    // Actualizar características si se proporcionan
    if (caracteristicas && Array.isArray(caracteristicas)) {
      property.caracteristicas = caracteristicas;
    }

    // Manejar actualización de imágenes
    if (images && Array.isArray(images)) {
      // Obtener IDs de imágenes actuales
      const currentImageIds = property.images.map(img => img.public_id);
      // Obtener IDs de imágenes nuevas
      const newImageIds = images.map(img => img.public_id);

      // Encontrar imágenes a eliminar (están en current pero no en new)
      const imagesToDelete = currentImageIds.filter(id => !newImageIds.includes(id));

      // Eliminar imágenes de Cloudinary
      for (const publicId of imagesToDelete) {
        if (!publicId.startsWith('blob:')) {
          try {
            await deleteImage(publicId);
          } catch (error) {
            console.error(`Error al eliminar imagen ${publicId}:`, error);
          }
        }
      }

      // Procesar nuevas imágenes
      const processedImages = [];
      for (const img of images) {
        if (img.file) {
          // Es una nueva imagen que necesita ser subida
          try {
            const result = await uploadImage(img.file);
            processedImages.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type
            });
          } catch (error) {
            console.error('Error al subir nueva imagen:', error);
          }
        } else {
          // Es una imagen existente que se mantiene
          processedImages.push(img);
        }
      }

      // Actualizar el array de imágenes de la propiedad
      property.images = processedImages;
    }

    // Guardar los cambios
    await property.save();

    // Enviar respuesta exitosa
    res.status(200).json(property);

  } catch (error) {
    console.error("Error al actualizar la propiedad:", error);
    res.status(500).json({ 
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
