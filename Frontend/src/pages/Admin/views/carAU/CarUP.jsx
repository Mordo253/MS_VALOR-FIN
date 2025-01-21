import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useVehicles } from "../../../../context/CarContext";
import PropertyImg from "../propertyAU/Property/PropertyImg";
import CarForm from "./CarFom";
import PropertyVideo from "../propertyAU/Property/PropertyVideo";

const CarUp = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getVehicle, updateVehicle } = useVehicles();

  const [formData, setFormData] = useState({
    title: "",
    car: "",
    price: 0,
    kilometer: 0,
    tractionType: "",
    model: 0,
    color: "",
    registrationYear: "",
    change: "",
    brand: "",
    fuel: "",
    place: 0,
    door: 0,
    disponible: true,
    description: "",
    codigo: "",
    propietario: "",
  });

  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si no hay autenticación o ID inválido
  useEffect(() => {
    if (!id || !isAuthenticated) {
      navigate("/cars");
    }
  }, [id, isAuthenticated, navigate]);

  // Cargar datos del vehículo
  const loadCarData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVehicle(id);

      if (!response?.data) throw new Error("No se encontraron datos del vehículo");

      const carData = response.data;
      setFormData({
        ...formData,
        title: carData.title || "",
        car: carData.car || "",
        price: Number(carData.price) || 0,
        kilometer: Number(carData.kilometer) || 0,
        tractionType: carData.tractionType || "",
        model: Number(carData.model) || 0,
        color: carData.color || "",
        registrationYear: carData.registrationYear || "",
        change: carData.change || "",
        brand: carData.brand || "",
        fuel: carData.fuel || "",
        place: carData.place || 0,
        door: carData.door || 0,
        disponible: Boolean(carData.disponible),
        description: carData.description || "",
        codigo: carData.codigo || "",
      });
      setImages(carData.images || []);
      // Procesar videos iniciales
      const processedVideos = carData.videos?.map(video => ({
        ...video,
        public_id: video.public_id || `existing_${Date.now()}_${video.id}`,
        isNew: false
      })) || [];
      setVideos(processedVideos);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del vehículo");
    } finally {
      setLoading(false);
    }
  }, [id, getVehicle]);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);

  // Manejar cambios en el formulario
  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Manejar actualizaciones de imágenes
  const handleImageUpdate = ({ images: updatedImages, imagesToDelete: toDelete }) => {
    setImages(updatedImages);
    setImagesToDelete(toDelete);
  };

  const handleVideoUpdate = useCallback(({ videos: updatedVideos, videosToDelete: toDelete }) => {
      setVideos(updatedVideos);
      setVideosToDelete(toDelete);
    }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.car || !formData.tractionType || !formData.model || !formData.description) {
        throw new Error("Por favor complete todos los campos obligatorios");
      }

      setIsSubmitting(true);
      setError(null);

      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        kilometer: Number(formData.kilometer),
        model: Number(formData.model),
        place: Number(formData.place),
        door: Number(formData.door),
        disponible: Boolean(formData.disponible),
        // Videos actualizados
        videos: videos.map(video => ({
          id: video.id,
          url: video.url,
          public_id: video.public_id,
          isNew: video.isNew
        })),
        videosToDelete: videosToDelete.filter(id => !id.startsWith('temp_')),
        images: images
          .map((img) => ({
            public_id: img.public_id || null,
            secure_url: img.secure_url || null,
            file: img.file || null,
          }))
          .filter((img) => img.secure_url || img.file),
        imagesToDelete,
      };

      const timeoutDuration = 30000;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeoutDuration)
      );
  
      const responsePromise = updateVehicle(id, dataToSend);
      const response = await Promise.race([responsePromise, timeoutPromise]);

      if (response && response.data) {
        setSuccess(true);
        setImages([]);
        setImagesToDelete([]);
        setVideos([]);
        setVideosToDelete([]);
        setError(null);
        setTimeout(() => navigate("/cars"), 2000);
      } else {
        throw new Error("Error al actualizar el vehículo");
      }
    } catch (err) {
      console.error("Error detallado:", err);
      setError(err.message || "Error al actualizar el vehículo");
      setSuccess(false);
      
      if (err.response?.data?.message) {
        setError(`Error del servidor: ${err.response.data.message}`);
      } else {
        setError(err.message || "Error al actualizar el vehículo");
      }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Actualizar Vehículo</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">Vehículo actualizado exitosamente</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <CarForm initialData={formData} onChange={handleFormDataChange} />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Imágenes del Vehículo</h2>
          <PropertyImg initialImages={images} onImageUpdate={handleImageUpdate} />
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Videos de la Propiedad</h2>
          <PropertyVideo
            initialVideos={videos}
            onVideoUpdate={handleVideoUpdate}
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
            {isSubmitting ? "Actualizando..." : "Actualizar Vehículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarUp;
