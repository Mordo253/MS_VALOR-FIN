import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from '../config.js';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para subir imágenes
export const uploadImage = async (file, type, codigo, slug) => {
  try {
    if (!file || !file.startsWith('data:')) {
      throw new Error('Archivo de imagen inválido');
    }

    if (!codigo && !slug) {
      throw new Error('Debe proporcionarse un código o un slug.');
    }

    const folderPath = `${type}/${codigo || slug}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: folderPath,
      transformation: [
        { width: 1080, height: 1350, crop: 'fill' },
      ],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw error;
  }
};

// Función para eliminar una imagen
export const deleteImage = async (publicId, type, codigo) => {
  try {
    if (!publicId) {
      throw new Error('No se proporcionó un publicId válido');
    }

    if (!codigo) {
      throw new Error('Código de referencia no proporcionado');
    }

    await cloudinary.uploader.destroy(publicId);
    return true;

  } catch (error) {
    console.error('Error al eliminar la imagen de Cloudinary:', error);
    throw error;
  }
};