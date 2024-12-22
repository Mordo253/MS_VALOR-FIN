import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useVehicles } from "../../../../context/CarContext";
import PropertyImg from "../propertyAU/Property/PropertyImg";
import CarForm from "./CarFom";

const CarUP = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getVehicle, updateVehicle } = useVehicles();

  const [formData, setFormData] = useState({
    title: "",
    car: "",
    price: "",
    kilometer: "",
    color: "",
    registrationYear: "",
    change: "",
    tractionType: "",
    brand: "",
    model: "",
    place: "",
    door: "",
    fuel: "",
    description: "",
    disponible: true,
  });

  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      navigate("/cars");
      return;
    }
  }, [id, isAuthenticated, navigate]);

  const loadCarData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVehicle(id);

      if (!response || !response.data) {
        throw new Error("No se encontraron datos del vehículo");
      }

      const carData = response.data;
      setFormData({
        ...carData,
        price: Number(carData.price) || 0,
        kilometer: Number(carData.kilometer) || 0,
        registrationYear: Number(carData.registrationYear) || 0,
        door: Number(carData.door) || 0,
        disponible: Boolean(carData.disponible),
      });
      setImages(carData.images || []);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del vehículo");
    } finally {
      setLoading(false);
    }
  }, [id, getVehicle]);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);

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
      // Validación de campos obligatorios
      if (!formData.title || !formData.brand || !formData.model || !formData.price) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      setIsSubmitting(true);
      setError(null);

      // Preparación de datos antes de enviarlos
      const dataToSend = {
        ...formData,
        images: images.map((img) => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
          file: img.file,  // Asumimos que esta es la imagen base64 o el archivo en formato adecuado
          resource_type: img.resource_type || "image",  // Por defecto es imagen
        })),
        imagesToDelete,  // Imágenes que deben eliminarse
        disponible: Boolean(formData.disponible),  // Asegurarse de que el campo sea booleano
      };

      // Enviar los datos al controlador
      const response = await updateVehicle(id, dataToSend);

      if (response?.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/cars");
        }, 2000);
      } else {
        throw new Error("Error al actualizar el vehículo");
      }
    } catch (err) {
      setError(err.message || "Error al actualizar el vehículo");
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

export default CarUP;
