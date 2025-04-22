import mongoose from 'mongoose';
import Servicio from '../models/service.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// Función simple para limpiar contenido HTML básico (reutilizada)
const basicSanitize = (html) => {
  if (!html) return '';
  
  // Elimina scripts y otros elementos potencialmente peligrosos
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .replace(/onload=/gi, '')
    .trim();
};

export const createServicio = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, title, content, categoria, ...servicioData } = req.body;

    const cleanTitle = basicSanitize(title);
    const cleanContent = basicSanitize(content);

    if (!cleanTitle || cleanTitle.trim() === "") {
      throw new Error("El título del servicio es obligatorio");
    }

    if (!cleanContent || cleanContent.trim() === "") {
      throw new Error("La descripción del servicio es obligatoria");
    }
    
    if (!categoria) {
      throw new Error("La categoría del servicio es obligatoria");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    const lastServicio = await Servicio.findOne()
      .sort({ createdAt: -1 })
      .select("codigo")
      .exec();

    let newCode = "SERV-00001";
    if (lastServicio?.codigo) {
      const lastCodeNumber = parseInt(lastServicio.codigo.split("-")[1], 10);
      newCode = `SERV-${String(lastCodeNumber + 1).padStart(5, "0")}`;
    }

    const processedImages = [];
    const maxSize = 5 * 1024 * 1024;

    for (const img of images) {
      if (img.file && typeof img.file === "string" && img.file.startsWith("data:")) {
        const approximateSize = img.file.length * 0.75;
        if (approximateSize > maxSize) {
          throw new Error(`Imagen ${img.public_id || "nueva"} excede el tamaño máximo de 5MB`);
        }

        // Enviando todos los parámetros requeridos a uploadImage
        const result = await uploadImage(img.file, "servicios", newCode, servicioData.slug);
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
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente");
    }

    const newServicio = new Servicio({
      ...servicioData,
      title: cleanTitle,
      content: cleanContent,
      categoria: categoria,
      codigo: newCode,
      images: processedImages,
      disponible: Boolean(servicioData.disponible),
    });

    const savedServicio = await newServicio.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Servicio creado exitosamente",
      data: savedServicio,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createServicio:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: servicios.length,
      data: servicios
    });
  } catch (error) {
    console.error("Error en getAllServicios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los servicios"
    });
  }
};

export const getServicioBySlug = async (req, res) => {
  try {
    const servicio = await Servicio.findOne({ slug: req.params.slug });
    
    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: servicio
    });
  } catch (error) {
    console.error("Error en getServicioBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el servicio"
    });
  }
};

export const updateServicio = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, imagesToDelete, title, content, categoria, ...servicioData } = req.body;
    const servicio = await Servicio.findOne({ slug: req.params.slug });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const cleanTitle = title ? basicSanitize(title) : servicio.title;
    const cleanContent = content ? basicSanitize(content) : servicio.content;
    const updatedCategoria = categoria || servicio.categoria;

    if (cleanTitle.trim() === '') {
      throw new Error("El título no puede estar vacío");
    }

    if (cleanContent.trim() === '') {
      throw new Error("El contenido no puede estar vacío");
    }

    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        if (publicId && !publicId.startsWith('temp_')) {
          await deleteImage(publicId, "servicios", servicio.codigo);
        }
      }
    }

    const processedImages = [];
    const maxSize = 5 * 1024 * 1024;

    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
          const approximateSize = img.file.length * 0.75;
          if (approximateSize > maxSize) {
            throw new Error(`Imagen ${img.public_id || 'nueva'} excede el tamaño máximo de 5MB`);
          }

          // Enviando todos los parámetros requeridos a uploadImage
          const result = await uploadImage(img.file, "servicios", servicio.codigo, servicio.slug);
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
          processedImages.push(img);
        }
      }
    }

    if (processedImages.length === 0) {
      throw new Error("Debe mantener al menos una imagen");
    }

    const updatedServicio = await Servicio.findOneAndUpdate(
      { slug: req.params.slug },
      {
        ...servicioData,
        title: cleanTitle,
        content: cleanContent,
        categoria: updatedCategoria,
        codigo: servicioData.codigo || servicio.codigo,
        images: processedImages,
        disponible: servicioData.disponible !== undefined ? Boolean(servicioData.disponible) : servicio.disponible,
      },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Servicio actualizado exitosamente",
      data: updatedServicio,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updateServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const deleteServicio = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const servicio = await Servicio.findOne({ slug: req.params.slug }).session(session);
    
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }

    for (const image of servicio.images) {
      if (image.public_id) {
        await deleteImage(image.public_id, "servicios", servicio.codigo);
      }
    }

    await Servicio.findOneAndDelete({ slug: req.params.slug }).session(session);
    await session.commitTransaction();
    
    res.status(200).json({ 
      success: true, 
      message: 'Servicio eliminado correctamente' 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en deleteServicio:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    session.endSession();
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { disponible } = req.body;
    
    if (typeof disponible !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El valor de disponible debe ser un booleano'
      });
    }

    const updatedServicio = await Servicio.findOneAndUpdate(
      { slug: req.params.slug },
      { disponible },
      { new: true }
    );
    
    if (!updatedServicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disponibilidad actualizada correctamente',
      data: updatedServicio
    });
  } catch (error) {
    console.error("Error en updateAvailability:", error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la disponibilidad'
    });
  }
};

export const searchServicios = async (req, res) => {
  try {
    const { query, categoria } = req.query;
    
    if (!query && !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda o una categoría'
      });
    }

    const searchConditions = {};
    
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchConditions.$or = [
        { title: searchRegex },
        { content: searchRegex }
      ];
    }
    
    if (categoria) {
      searchConditions.categoria = categoria;
    }
    
    const servicios = await Servicio.find(searchConditions).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: servicios.length,
      data: servicios
    });
  } catch (error) {
    console.error("Error en searchServicios:", error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar servicios'
    });
  }
};

export const getServiciosByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere especificar una categoría'
      });
    }

    const servicios = await Servicio.find({ 
      categoria: categoria,
      disponible: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: servicios.length,
      data: servicios
    });
  } catch (error) {
    console.error("Error en getServiciosByCategoria:", error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios por categoría'
    });
  }
};