import {v2 as cloudinary} from 'cloudinary'
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY} from '../config.js'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
})
// Función para subir la imagen a Cloudinary
export const uploadImage = async (filePath) => {
  try {
    // Cargar la imagen a la carpeta 'properties' en Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'properties',  // Puedes personalizar la carpeta donde se subirán las imágenes
    });
    return result;  // Devolver el resultado de Cloudinary
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw error;  // Lanzar el error para manejarlo en el controlador
  }
};

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}