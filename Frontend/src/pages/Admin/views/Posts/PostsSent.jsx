import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { usePosts } from "../../../../context/PostContext";
import PropertyImg from "../propertyAU/Property/PropertyImg";
import PostForm from "./PostForm";

const PostsSent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createPost } = usePosts();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    disponible: true,
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar los datos del formulario incluyendo el contenido enriquecido
  const handleFormDataChange = useCallback((newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  // Actualizar las imágenes seleccionadas con todos los metadatos necesarios
  const handleImageUpdate = useCallback(({ images: updatedImages }) => {
    setImages(updatedImages.map(img => ({
      public_id: img.public_id || '',
      secure_url: img.secure_url || '',
      file: img.file || null,
      width: img.width || 0,
      height: img.height || 0,
      format: img.format || '',
      resource_type: img.resource_type || 'image'
    })));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validar contenido HTML no vacío
      const titleText = formData.title.replace(/<[^>]*>/g, '').trim();
      const contentText = formData.content.replace(/<[^>]*>/g, '').trim();

      if (!titleText) {
        throw new Error("El título no puede estar vacío");
      }

      if (!contentText) {
        throw new Error("El contenido no puede estar vacío");
      }

      if (images.length === 0) {
        throw new Error("Debe incluir al menos una imagen del post");
      }

      if (!isAuthenticated) {
        throw new Error("No estás autenticado. Por favor, inicia sesión");
      }

      setIsSubmitting(true);
      setError(null);

      // Preparar datos para enviar al contexto con el formato esperado
      const dataToSend = {
        title: formData.title,
        content: formData.content,
        disponible: Boolean(formData.disponible),
        images: images.map(img => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
          file: img.file,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || '',
          resource_type: img.resource_type || 'image'
        })).filter(img => 
          (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) ||
          (img.secure_url && !img.secure_url.startsWith('blob:'))
        )
      };

      // Verificar que hay al menos una imagen válida después del filtrado
      if (dataToSend.images.length === 0) {
        throw new Error("No hay imágenes válidas para subir");
      }

      const response = await createPost(dataToSend);

      if (response.success) {
        setSuccess(true);
        setFormData({
          title: "",
          content: "",
          disponible: true,
        });
        setImages([]);
        setError(null);
        // Redirigir después de un breve delay para mostrar el mensaje de éxito
        setTimeout(() => navigate("/blog"), 1500);
      } else {
        throw new Error(response.error || "Error al crear el post");
      }
    } catch (err) {
      setError(err.message || "Error al registrar el post");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar Post</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">
            Post registrado exitosamente. Redirigiendo...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <PostForm
            initialData={formData}
            onChange={handleFormDataChange}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Imágenes del Post</h2>
          <PropertyImg
            initialImages={images}
            onImageUpdate={handleImageUpdate}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? "Registrando..." : "Registrar Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostsSent;