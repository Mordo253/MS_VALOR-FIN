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
    useful_room: "",
    description: "",
    videos: "",
    creador: "",
    propietario: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
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

  const handleVideoUpdate = useCallback(({ videos: updatedVideos, videosToDelete: toDelete }) => {
    setVideos(updatedVideos);
    setVideosToDelete(toDelete);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validaciones básicas
      const requiredFields = [
        "title",
        "pais",
        "departamento",
        "ciudad",
        "zona",
        "areaConstruida",
        "areaTerreno",
        "areaPrivada",
        "alcobas",
        "costo",
        "banos",
        "garaje",
        "estrato",
        "piso",
        "tipoInmueble",
        "tipoNegocio",
        "estado",
        "valorAdministracion",
        "anioConstruccion",
        "useful_room",
        "description",
        "propietario",
      ];

      const emptyFields = requiredFields.filter((field) => !formData[field]);
      if (emptyFields.length > 0) {
        throw new Error(`Por favor complete los siguientes campos: ${emptyFields.join(", ")}`);
      }

      if (!selectedCaracteristicas.internas.length && !selectedCaracteristicas.externas.length) {
        throw new Error("Debe seleccionar al menos una característica");
      }

      setIsSubmitting(true);
      setError(null);

      const dataToSend = {
        ...formData,
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
        useful_room: Number(formData.useful_room),
        disponible: Boolean(formData.disponible),
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
        // Actualización del manejo de videos
        videos: videos.map(video => ({
          id: video.id,
          url: video.url,
          public_id: video.public_id,
          isNew: video.isNew
        })),
        videosToDelete: videosToDelete.filter(id => !id.startsWith('temp_')),
        
        images: images.map((img) => {
          if (img.file && typeof img.file === "string" && img.file.startsWith("data:")) {
            return {
              public_id: img.public_id,
              secure_url: img.secure_url,
              file: img.file,
              resource_type: "image",
            };
          }
          return {
            public_id: img.public_id,
            secure_url: img.secure_url,
            resource_type: img.resource_type,
          };
        }),
        imagesToDelete: imagesToDelete.filter((id) => !id.startsWith("temp_")),
        updatedAt: new Date().toISOString(),
        codigo: formData.codigo || `PROP-${Date.now()}`,
      };

      if (dataToSend.images.length === 0) {
        throw new Error("Debe incluir al menos una imagen");
      }

      console.log("Datos procesados para enviar:", dataToSend);

      const response = await createProperty(dataToSend);

      if (response && response.data) {
        setSuccess(true);
        setImages([]);
        setVideos([]);
        setVideosToDelete([]);
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
          <PropertyImg initialImages={images} onImageUpdate={handleImageUpdate} />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Videos de la Propiedad</h2>
          <PropertyVideo initialVideos={videos} onVideoUpdate={handleVideoUpdate} />
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