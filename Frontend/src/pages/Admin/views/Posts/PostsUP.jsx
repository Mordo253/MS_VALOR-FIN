import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { usePosts } from "../../../../context/PostContext";
import PropertyImg from "../propertyAU/Property/PropertyImg";
import PostsForm from "./PostForm";

const PostsUP = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getPost, updatePost } = usePosts();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    disponible: true,
  });

  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug || !isAuthenticated) {
      navigate("/blog");
    }
  }, [slug, isAuthenticated, navigate]);

  const loadPostData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPost(slug);

      if (!response?.data) {
        throw new Error("No se encontraron datos del post");
      }

      const postData = response.data;
      
      // Asegurar que los datos cargados mantengan el formato HTML
      setFormData({
        title: postData.title || "",
        content: postData.content || "",
        disponible: Boolean(postData.disponible),
      });

      // Procesar las imágenes existentes con todos los campos requeridos
      setImages((postData.images || []).map(img => ({
        public_id: img.public_id || '',
        secure_url: img.secure_url || '',
        width: img.width || 0,
        height: img.height || 0,
        format: img.format || '',
        resource_type: img.resource_type || 'image'
      })));
    } catch (err) {
      setError(err.message || "Error al cargar los datos del post");
    } finally {
      setLoading(false);
    }
  }, [slug, getPost]);

  useEffect(() => {
    loadPostData();
  }, [loadPostData]);

  const handleFormDataChange = useCallback((newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const handleImageUpdate = useCallback(({ images: updatedImages, imagesToDelete: toDelete }) => {
    // Asegurar que las imágenes nuevas tengan todos los campos necesarios
    setImages(updatedImages.map(img => ({
      public_id: img.public_id || '',
      secure_url: img.secure_url || '',
      file: img.file || null,
      width: img.width || 0,
      height: img.height || 0,
      format: img.format || '',
      resource_type: img.resource_type || 'image'
    })));

    // Filtrar los IDs de imágenes a eliminar
    setImagesToDelete(toDelete.filter(id => typeof id === 'string' && !id.startsWith('temp_')));
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

      setIsSubmitting(true);
      setError(null);

      // Preparar datos para enviar al contexto
      const dataToSend = {
        title: formData.title,
        content: formData.content,
        disponible: Boolean(formData.disponible),
        images: images.map(img => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
          file: img.file || null,
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || '',
          resource_type: img.resource_type || 'image'
        })).filter(img => 
          (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) ||
          (img.secure_url && !img.secure_url.startsWith('blob:'))
        ),
        imagesToDelete: imagesToDelete
      };

      // Verificar que quede al menos una imagen después del filtrado
      if (dataToSend.images.length === 0) {
        throw new Error("Debe mantener al menos una imagen del post");
      }

      const response = await updatePost(slug, dataToSend);

      if (response?.data) {
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          navigate("/blog");
        }, 2000);
      } else {
        throw new Error("Error al actualizar el post");
      }
    } catch (err) {
      setError(err.message || "Error al actualizar el post");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Actualizar Post</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">
            Post actualizado exitosamente. Redirigiendo...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <PostsForm
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
            {isSubmitting ? "Actualizando..." : "Actualizar Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostsUP;