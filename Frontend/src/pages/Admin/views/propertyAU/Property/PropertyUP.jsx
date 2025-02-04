import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "../../../../../context/PropertyContex";
import { useAuth } from "../../../../../context/AuthContext";
import PropertyImg from "./PropertyImg";
import PropertyFormUP from "./PropertyFormUP";
import Caracteristicas from "./PropertyCaract";
import PropertyVideo from "./PropertyVideo";

const PropertyUP = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getProperty, updateProperty } = useProperties();

  const [formData, setFormData] = useState({
    title: "",
    pais: "",
    departamento: "",
    ciudad: "",
    zona: "",
    areaConstruida: "",
    areaTerreno: "",
    areaPrivada: "",
    alcobas: "",
    costo: "",
    banos: "",
    garaje: "",
    estrato: "",
    piso: "",
    tipoInmueble: "",
    tipoNegocio: "",
    estado: "",
    disponible: true,
    valorAdministracion: "",
    anioConstruccion: "",
    useful_room: "",
    description: "",
    propietario: "",
  });

  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState({
    internas: [],
    externas: [],
  });
  const [videos, setVideos] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      navigate("/properties");
      return;
    }
  }, [id, isAuthenticated, navigate]);

  const loadPropertyData = useCallback(async () => {
    if (!id || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getProperty(id);

      if (!response || !response.data) {
        throw new Error("No se encontraron datos de la propiedad");
      }

      const propertyData = response.data;
      setFormData(prev => ({
        ...prev,
        ...propertyData,
        areaConstruida: Number(propertyData.areaConstruida) || "",
        areaTerreno: Number(propertyData.areaTerreno) || "",
        areaPrivada: Number(propertyData.areaPrivada) || "",
        alcobas: Number(propertyData.alcobas) || "",
        costo: Number(propertyData.costo) || "",
        banos: Number(propertyData.banos) || "",
        garaje: Number(propertyData.garaje) || "",
        estrato: Number(propertyData.estrato) || "",
        piso: Number(propertyData.piso) || "",
        valorAdministracion: Number(propertyData.valorAdministracion) || "",
        anioConstruccion: Number(propertyData.anioConstruccion) || "",
        useful_room: Number(propertyData.useful_room) || "",
        disponible: Boolean(propertyData.disponible),
      }));

      setImages(propertyData.images || []);
      
      // Procesar videos iniciales
      const processedVideos = propertyData.videos?.map(video => ({
        ...video,
        public_id: video.public_id || `existing_${Date.now()}_${video.id}`,
        isNew: false
      })) || [];
      setVideos(processedVideos);

      const internas = propertyData.caracteristicas
        .filter((c) => c.type === "interna")
        .map((c) => c.name);
      const externas = propertyData.caracteristicas
        .filter((c) => c.type === "externa")
        .map((c) => c.name);

      setSelectedCaracteristicas({ internas, externas });

    } catch (err) {
      setError(err.message || "Error al cargar la propiedad");
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, getProperty]);

  useEffect(() => {
    loadPropertyData();
  }, [loadPropertyData]);

  const handleFormDataChange = useCallback((newData) => {
    setFormData(newData);
  }, []);

  const handleCaracteristicasChange = useCallback((newCaracteristicas) => {
    setSelectedCaracteristicas(newCaracteristicas);
  }, []);

  const handleImageUpdate = useCallback(({ images: updatedImages, imagesToDelete: toDelete }) => {
    setImages(updatedImages);
    setImagesToDelete(toDelete);
  }, []);

  const handleVideoUpdate = useCallback(({ videos: updatedVideos, videosToDelete: toDelete }) => {
    setVideos(updatedVideos);
    setVideosToDelete(toDelete);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!formData.title || !formData.ciudad || !formData.costo) {
        throw new Error("Por favor complete todos los campos requeridos");
      }
  
      if (!selectedCaracteristicas.internas.length && !selectedCaracteristicas.externas.length) {
        throw new Error("Debe seleccionar al menos una característica");
      }
  
      setIsSubmitting(true);
      setError(null);
  
      const dataToSend = {
        ...formData,
        areaConstruida: Number(formData.areaConstruida) || 0,
        areaTerreno: Number(formData.areaTerreno) || 0,
        areaPrivada: Number(formData.areaPrivada) || 0,
        alcobas: Number(formData.alcobas) || 0,
        costo: Number(formData.costo) || 0,
        banos: Number(formData.banos) || 0,
        garaje: Number(formData.garaje) || 0,
        estrato: Number(formData.estrato) || 0,
        piso: Number(formData.piso) || 0,
        valorAdministracion: Number(formData.valorAdministracion) || 0,
        anioConstruccion: Number(formData.anioConstruccion) || 0,
        useful_room: Number(formData.useful_room) || 0,
        
        caracteristicas: [
          ...selectedCaracteristicas.internas.map((name) => ({
            name,
            type: "interna",
          })),
          ...selectedCaracteristicas.externas.map((name) => ({
            name,
            type: "externa",
          })),
        ],

        // Videos actualizados
        videos: videos.map(video => ({
          id: video.id,
          url: video.url,
          public_id: video.public_id,
          isNew: video.isNew
        })),
        videosToDelete: videosToDelete.filter(id => !id.startsWith('temp_')),
        
        images: images.map(img => {
          if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
            return {
              public_id: img.public_id,
              secure_url: img.secure_url,
              file: img.file,
              resource_type: 'image'
            };
          }
          return {
            public_id: img.public_id,
            secure_url: img.secure_url,
            resource_type: img.resource_type
          };
        }),
        
        imagesToDelete: imagesToDelete.filter(id => !id.startsWith('temp_')),
        disponible: Boolean(formData.disponible),
        updatedAt: new Date().toISOString()
      };
  
      if (dataToSend.images.length === 0) {
        throw new Error("Debe incluir al menos una imagen");
      }
  
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedImages = dataToSend.images.filter(img => 
        img.file && img.file.length * 0.75 > maxSize
      );
  
      if (oversizedImages.length > 0) {
        throw new Error("Una o más imágenes exceden el tamaño máximo permitido (5MB)");
      }
  
      const timeoutDuration = 30000;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeoutDuration)
      );
  
      const responsePromise = updateProperty(id, dataToSend);
      const response = await Promise.race([responsePromise, timeoutPromise]);
  
      if (response && response.data) {
        setSuccess(true);
        setImages([]);
        setImagesToDelete([]);
        setVideos([]);
        setVideosToDelete([]);
        setError(null);
        
        setTimeout(() => {
          navigate("/properties");
        }, 1500);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
  
    } catch (err) {
      console.error("Error detallado:", err);
      setError(err.message || "Error al actualizar la propiedad");
      setSuccess(false);
      
      if (err.response?.data?.message) {
        setError(`Error del servidor: ${err.response.data.message}`);
      } else {
        setError(err.message || "Error al actualizar la propiedad");
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Actualizar Propiedad</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">Propiedad actualizada exitosamente</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <PropertyFormUP
            initialData={formData}
            onChange={handleFormDataChange}
            isSubmitting={isSubmitting}
            isUpdate={true}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Características de la Propiedad</h2>
          <Caracteristicas
            initialSelected={selectedCaracteristicas}
            onChange={handleCaracteristicasChange}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Imágenes de la Propiedad</h2>
          <PropertyImg
            initialImages={images}
            onImageUpdate={handleImageUpdate}
          />
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
            className={`inline-flex justify-center px-6 py-3 border border-transparent
              text-base font-medium rounded-md shadow-sm text-white
              ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? "Guardando..." : "Actualizar Propiedad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyUP;