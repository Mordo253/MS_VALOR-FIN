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

    const cleanTitle = basicSanitize(title);
    const cleanContent = basicSanitize(content);

    if (!cleanTitle || cleanTitle.trim() === "") {
      throw new Error("El título es obligatorio");
    }

    if (!cleanContent || cleanContent.trim() === "") {
      throw new Error("El contenido es obligatorio");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    const lastPost = await Post.findOne()
      .sort({ createdAt: -1 })
      .select("codigo")
      .exec();

    let newCode = "POST-00001";
    if (lastPost?.codigo) {
      const lastCodeNumber = parseInt(lastPost.codigo.split("-")[1], 10);
      newCode = `POST-${String(lastCodeNumber + 1).padStart(5, "0")}`;
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
        const result = await uploadImage(img.file, "posts", newCode, postData.slug);
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

    const newPost = new Post({
      ...postData,
      title: cleanTitle,
      content: cleanContent,
      codigo: newCode,
      images: processedImages,
      disponible: Boolean(postData.disponible),
    });

    const savedPost = await newPost.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Post creado exitosamente",
      data: savedPost,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en createPost:", error);

    res.status(400).json({
      success: false,
      message: error.message,
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

    const cleanTitle = title ? basicSanitize(title) : post.title;
    const cleanContent = content ? basicSanitize(content) : post.content;

    if (cleanTitle.trim() === '') {
      throw new Error("El título no puede estar vacío");
    }

    if (cleanContent.trim() === '') {
      throw new Error("El contenido no puede estar vacío");
    }

    // Eliminar imágenes solicitadas
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      for (const publicId of imagesToDelete) {
        if (publicId && !publicId.startsWith('temp_')) {
          await deleteImage(publicId, "posts", post.codigo);
        }
      }
      // Filtrar las imágenes que no se van a eliminar
      post.images = post.images.filter(img => !imagesToDelete.includes(img.public_id));
    }

    // Procesar nuevas imágenes
    const newImages = [];
    const maxSize = 5 * 1024 * 1024;

    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
          const approximateSize = img.file.length * 0.75;
          if (approximateSize > maxSize) {
            throw new Error(`Imagen ${img.public_id || 'nueva'} excede el tamaño máximo de 5MB`);
          }

          // Enviando todos los parámetros requeridos a uploadImage
          const result = await uploadImage(img.file, "posts", post.codigo, post.slug);
          if (result) {
            newImages.push({
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
    }

    // SOLUCIÓN: Actualizar el orden de las imágenes existentes
    let processedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      // Si no hay nuevas imágenes para agregar y solo es reordenamiento
      if (newImages.length === 0 && (!imagesToDelete || imagesToDelete.length === 0)) {
        console.log("Actualizando orden de imágenes existentes");
        processedImages = images;
      }
      // Si hay nuevas imágenes o se eliminaron algunas, combinar las existentes con las nuevas
      else {
        console.log("Combinando imágenes existentes con nuevas imágenes");
        // Filtrar solo las imágenes existentes (que no tengan file)
        const existingImages = images.filter(img => !img.file && !img.secure_url.startsWith('blob:'));
        processedImages = [...existingImages, ...newImages];
      }
    } else {
      // Si no se proporcionan imágenes, conservar las actuales menos las eliminadas
      processedImages = post.images;
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
        codigo: postData.codigo || post.codigo,
        images: processedImages,
        disponible: postData.disponible !== undefined ? Boolean(postData.disponible) : post.disponible,
      },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Post actualizado exitosamente",
      data: updatedPost,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error en updatePost:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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

    for (const image of post.images) {
      if (image.public_id) {
        await deleteImage(image.public_id, "posts", post.codigo);
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