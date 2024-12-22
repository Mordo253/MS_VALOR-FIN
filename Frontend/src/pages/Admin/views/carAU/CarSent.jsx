import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../../../../context/CarContext";
import { useAuth } from "../../../../context/AuthContext";  // Importamos el contexto de autenticación
import PropertyImg from "../propertyAU/Property/PropertyImg";
import CarForm from "./CarFom";

const CarSent = () => {
  const navigate = useNavigate();
  const { createVehicle } = useVehicles();
  const { user, isAuthenticated } = useAuth();  // Accedemos al estado de autenticación desde el contexto

  const [formData, setFormData] = useState({
    title: "",
    car: "",
    kilometer: "",
    color: "",
    registrationYear: "",
    change: "",
    tractionType: "",
    brand: "",
    model: "",
    place: 0,
    door: "",
    fuel: "",
    disponible: true,
    description: "",
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = useCallback((newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const handleImageUpdate = useCallback(({ images: updatedImages, imagesToDelete: toDelete }) => {
    setImages(updatedImages);
    setImagesToDelete(toDelete);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.car || !formData.brand || !formData.model) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      if (images.length === 0) {
        throw new Error("Debe incluir al menos una imagen del vehículo.");
      }

      setIsSubmitting(true);
      setError(null);

      const dataToSend = {
        ...formData,
        price: Number(formData.price) || 0,
        kilometer: Number(formData.kilometer) || 0,
        registrationYear: Number(formData.registrationYear) || 0,
        door: Number(formData.door) || 0,
        model: Number(formData.model) || 0,
        tractionType: formData.tractionType,
        car: formData.car,
        images: images.map(img => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
          file: img.file,
          resource_type: img.resource_type,
        })),
        imagesToDelete,
        disponible: Boolean(formData.disponible),
        updatedAt: new Date().toISOString(),
      };

      // Verificamos si el usuario está autenticado y obtenemos el token desde el contexto
      if (!isAuthenticated) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      // Usamos el token del contexto de autenticación (se espera que esté en las cookies ya)
      const token = user?.token;  // Asegúrate de que el token esté disponible en el objeto 'user'
      if (!token) {
        throw new Error("No se encontró un token de autenticación.");
      }

      // Enviar la solicitud a la API con el token en los encabezados
      const response = await createVehicle(dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en los encabezados
          "Content-Type": "application/json",
        },
      });

      if (response?.data) {
        setSuccess(true);
        setImages([]);
        setImagesToDelete([]);
        setError(null);
        setTimeout(() => navigate("/cars"), 1500);
      } else {
        throw new Error("No se recibió respuesta del servidor.");
      }
    } catch (err) {
      setError(err.message || "Error al registrar el vehículo.");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar Vehículo</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">
            Vehículo registrado exitosamente. Redirigiendo...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <CarForm 
            initialData={formData} 
            onChange={handleFormDataChange} 
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Imágenes del Vehículo</h2>
          <PropertyImg 
            initialImages={images} 
            onImageUpdate={handleImageUpdate} 
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
          >
            {isSubmitting ? "Registrando..." : "Registrar Vehículo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarSent;
