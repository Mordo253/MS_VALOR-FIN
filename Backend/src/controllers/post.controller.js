import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// Función simple para limpiar contenido HTML básico
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

export const createPost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, title, content, ...postData } = req.body;

    // Limpieza básica del contenido
    const cleanTitle = basicSanitize(title);
    const cleanContent = basicSanitize(content);

    if (!cleanTitle || cleanTitle.trim() === '') {
      throw new Error("El título es obligatorio");
    }

    if (!cleanContent || cleanContent.trim() === '') {
      throw new Error("El contenido es obligatorio");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    const processedImages = [];
    const maxSize = 5 * 1024 * 1024;

    for (const img of images) {
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
            resource_type: result.resource_type
          });
        }
      }
    }

    if (processedImages.length === 0) {
      throw new Error("No se pudo procesar ninguna imagen correctamente");
    }

    const newPost = new Post({
      ...postData,
      title: cleanTitle,
      content: cleanContent,
      images: processedImages,
      disponible: Boolean(postData.disponible)
    });

    const savedPost = await newPost.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Post creado exitosamente",
      data: savedPost
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createPost:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error("Error en getAllPosts:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los posts"
    });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Error en getPostBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el post"
    });
  }
};

export const updatePost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { images, imagesToDelete, title, content, ...postData } = req.body;
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      throw new Error("Post no encontrado");
    }

    // Limpieza básica del contenido
    const cleanTitle = title ? basicSanitize(title) : post.title;
    const cleanContent = content ? basicSanitize(content) : post.content;

    if (cleanTitle.trim() === '') {
      throw new Error("El título no puede estar vacío");
    }

    if (cleanContent.trim() === '') {
      throw new Error("El contenido no puede estar vacío");
    }

    // Procesar imágenes a eliminar
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        if (publicId && !publicId.startsWith('temp_')) {
          await deleteImage(publicId);
        }
      }
    }

    // Procesar nuevas imágenes y mantener las existentes
    const processedImages = [];
    const maxSize = 5 * 1024 * 1024;

    if (images && Array.isArray(images)) {
      for (const img of images) {
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
              resource_type: result.resource_type
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

    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {
        ...postData,
        title: cleanTitle,
        content: cleanContent,
        images: processedImages,
        disponible: postData.disponible !== undefined ? Boolean(postData.disponible) : post.disponible
      },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Post actualizado exitosamente",
      data: updatedPost
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updatePost:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

export const deletePost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findOne({ slug: req.params.slug }).session(session);
    
    if (!post) {
      throw new Error('Post no encontrado');
    }

    // Eliminar todas las imágenes asociadas
    for (const image of post.images) {
      if (image.public_id) {
        await deleteImage(image.public_id);
      }
    }

    await Post.findOneAndDelete({ slug: req.params.slug }).session(session);
    await session.commitTransaction();
    
    res.status(200).json({ 
      success: true, 
      message: 'Post eliminado correctamente' 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en deletePost:", error);
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

    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { disponible },
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disponibilidad actualizada correctamente',
      data: updatedPost
    });
  } catch (error) {
    console.error("Error en updateAvailability:", error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la disponibilidad'
    });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error("Error en searchPosts:", error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar posts'
    });
  }
};