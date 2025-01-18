import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProperties } from "../../../../context/PropertyContex";
import { useAuth } from "../../../../context/AuthContext";
import PropertyImg from "./Property/PropertyImg";
import PropertyFormUP from "./Property/PropertyFormUP";
import Caracteristicas from "./Property/PropertyCaract";
import PropertyVideo from "./Property/PropertyVideo";

const PropertyForm = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { createProperty } = useProperties();

  const [formData, setFormData] = useState({
    title: "",
    codigo: "",
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
    description: "",
    creador: "",
    propietario: "",
  });
 
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState({
    internas: [],
    externas: [],
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleFormDataChange = useCallback((newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const handleCaracteristicasChange = useCallback((newCaracteristicas) => {
    setSelectedCaracteristicas(newCaracteristicas);
  }, []);

  const handleImageUpdate = useCallback(({ images: updatedImages, imagesToDelete: toDelete }) => {
    setImages(updatedImages);
    setImagesToDelete(toDelete);
  }, []);

  const handleVideosChange = useCallback((updatedVideos) => {
    setVideos(updatedVideos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validaciones básicas
      const requiredFields = [
        'title', 'pais', 'departamento', 'ciudad', 'zona', 
        'areaConstruida', 'areaTerreno', 'areaPrivada', 
        'alcobas', 'costo', 'banos', 'garaje', 'estrato',
        'piso', 'tipoInmueble', 'tipoNegocio', 'estado',
        'valorAdministracion', 'anioConstruccion', 'description',
        'propietario'
      ];

      const emptyFields = requiredFields.filter(field => !formData[field]);
      if (emptyFields.length > 0) {
        throw new Error(`Por favor complete los siguientes campos: ${emptyFields.join(', ')}`);
      }

      if (!selectedCaracteristicas.internas.length && !selectedCaracteristicas.externas.length) {
        throw new Error("Debe seleccionar al menos una característica");
      }

      setIsSubmitting(true);
      setError(null);

      const dataToSend = {
        ...formData,
        // Convertir campos numéricos
        areaConstruida: Number(formData.areaConstruida),
        areaTerreno: Number(formData.areaTerreno),
        areaPrivada: Number(formData.areaPrivada),
        alcobas: Number(formData.alcobas),
        costo: Number(formData.costo),
        banos: Number(formData.banos),
        garaje: Number(formData.garaje),
        estrato: Number(formData.estrato),
        piso: Number(formData.piso),
        valorAdministracion: Number(formData.valorAdministracion),
        anioConstruccion: Number(formData.anioConstruccion),
        
        // Arrays y booleanos
        videos: videos,
        disponible: Boolean(formData.disponible),
        
        caracteristicas: [
          ...selectedCaracteristicas.internas.map(name => ({
            name,
            type: "interna",
          })),
          ...selectedCaracteristicas.externas.map(name => ({
            name,
            type: "externa",
          })),
        ],

        // Manejo de imágenes
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
        
        // Metadatos
        updatedAt: new Date().toISOString(),
        
        // Validaciones específicas
        codigo: formData.codigo || `PROP-${Date.now()}`
      };

      // Validaciones adicionales
      if (dataToSend.images.length === 0) {
        throw new Error("Debe incluir al menos una imagen");
      }

      // Validación de tamaño de imágenes
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedImages = dataToSend.images.filter(img => 
        img.file && img.file.length * 0.75 > maxSize
      );
      if (oversizedImages.length > 0) {
        throw new Error("Una o más imágenes exceden el tamaño máximo permitido (5MB)");
      }

      // Manejo de timeout en la petición
      const timeoutDuration = 30000;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeoutDuration)
      );

      console.log("Datos procesados para enviar:", dataToSend);

      const responsePromise = createProperty(dataToSend);
      const response = await Promise.race([responsePromise, timeoutPromise]);

      if (response && response.data) {
        setSuccess(true);
        // Limpiar estados
        setImages([]);
        setVideos([]);
        setImagesToDelete([]);
        setError(null);
        setTimeout(() => {
          navigate("/properties");
        }, 1500);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (err) {
      setError(err.message || "Error al crear la propiedad");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Propiedad</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">Propiedad creada exitosamente</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <PropertyFormUP 
            initialData={formData} 
            onChange={handleFormDataChange}
            isSubmitting={isSubmitting}
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
            videos={videos}
            onVideosChange={handleVideosChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Creando..." : "Crear Propiedad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;