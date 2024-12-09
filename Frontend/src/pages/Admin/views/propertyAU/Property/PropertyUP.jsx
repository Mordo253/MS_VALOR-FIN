import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProperties } from "../../../../../context/PropertyContex";
import { API_URL } from "../../../../../config";
import Cookies from "js-cookie";
import { useAuth } from "../../../../../context/AuthContext";
import PropertyImg from "./PropertyImg";
import PropertyFormUP from "./PropertyFormUP";
import Caracteristicas from "./PropertyCaract";

const PropertyUP = () => {
  const { id } = useParams(); // Obtenemos el id de la propiedad desde la URL
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getProperty } = useProperties(); // Función para obtener datos de la propiedad

  // Estados principales
  const [propertyData, setPropertyData] = useState(null);
  const [images, setImages] = useState([]); // Imágenes de la propiedad
  const [imagesToDelete, setImagesToDelete] = useState([]); // Imágenes para eliminar
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState({
    internas: [],
    externas: [],
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirigir si el ID no existe o el usuario no está autenticado
  useEffect(() => {
    if (!id || !isAuthenticated) {
      navigate("/properties");
    }
  }, [id, isAuthenticated, navigate]);

  // Cargar datos iniciales de la propiedad
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        console.log("Obteniendo propiedad con ID:", id);
        const response = await getProperty(id);
        console.log("Respuesta del backend:", response);

        if (response && response.data) {
          setPropertyData(response.data);
          setImages(response.data.images || []);

          // Configurar características a partir de la propiedad
          const internas = response.data.caracteristicas
            .filter((c) => c.type === "interna")
            .map((c) => c.name);
          const externas = response.data.caracteristicas
            .filter((c) => c.type === "externa")
            .map((c) => c.name);

          console.log("Características internas:", internas);
          console.log("Características externas:", externas);

          setSelectedCaracteristicas({ internas, externas });
        } else {
          setError("No se encontraron datos de la propiedad");
        }
      } catch (err) {
        setError("Error al cargar la propiedad");
        console.error("Error al obtener la propiedad:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, getProperty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedCaracteristicas.internas.length && !selectedCaracteristicas.externas.length) {
        setError("Debe seleccionar al menos una característica");
        return;
      }

      setLoading(true);

      const token = Cookies.get("token");
      console.log("Token recibido:", token);

      if (!token) {
        navigate("/login");
        throw new Error("Token no encontrado. Por favor, inicia sesión.");
      }

      // Formatear características
      const formattedCaracteristicas = [
        ...selectedCaracteristicas.internas.map((name) => ({
          name,
          type: "interna",
        })),
        ...selectedCaracteristicas.externas.map((name) => ({
          name,
          type: "externa",
        })),
      ];

      // Datos a enviar
      const updatedData = {
        ...propertyData,
        caracteristicas: formattedCaracteristicas,
        images: images.map((img) => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
        })),
        imagesToDelete: imagesToDelete.map((img) => img.public_id),
      };

      const response = await fetch(`${API_URL}/property/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la propiedad. Asegúrese de estar autenticado.");
      }

      setSuccess(true);
      navigate("/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    <div className="property-up">
      <h1>Actualizar Propiedad</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Propiedad actualizada exitosamente</p>}

      <form onSubmit={handleSubmit}>
        {/* Componente PropertyFormUP */}
        <PropertyFormUP propertyId={id} />

        {/* Componente Características */}
        <Caracteristicas
          initialSelected={selectedCaracteristicas} // Pasa el estado actual
          onChange={setSelectedCaracteristicas} // Maneja los cambios
        />

        {/* Gestión de imágenes */}
        <PropertyImg
          initialImages={images}
          onImageUpdate={({ images: updatedImages, imagesToDelete: toDelete }) => {
            setImages(updatedImages);
            setImagesToDelete(toDelete);
          }}
        />

        {/* Botón de envío */}
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Actualizar Propiedad"}
        </button>
      </form>
    </div>
  );
};

export default PropertyUP;

