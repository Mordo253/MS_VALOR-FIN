import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "../../../../../context/PropertyContex";
import { useAuth } from "../../../../../context/AuthContext";
import PropertyImg from "./PropertyImg";
import PropertyFormUP from "./PropertyFormUP";
import Caracteristicas from "./PropertyCaract";

const PropertyUP = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getProperty, updateProperty } = useProperties();

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
  });

  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState({
    internas: [],
    externas: [],
  });

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
        disponible: Boolean(propertyData.disponible),
      }));

      setImages(propertyData.images || []);

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

        images: images,
        imagesToDelete: imagesToDelete
      };

      const response = await updateProperty(id, dataToSend);

      if (response && response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/properties");
        }, 1500);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }

    } catch (err) {
      setError(err.message || "Error al actualizar la propiedad");
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
