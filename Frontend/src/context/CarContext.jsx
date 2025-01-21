import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

// Crear el contexto para los vehículos
const VehicleContext = createContext();

// Hook personalizado para acceder al contexto
export const useVehicles = () => useContext(VehicleContext);

// Proveedor del contexto
export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Configuración para enviar cookies
  axios.defaults.withCredentials = true;

  // Obtener todos los vehículos
  const getAllVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_URL}/car/all-cars`);
      if (data?.success && Array.isArray(data.data)) {
        setVehicles(data.data);
      } else {
        setVehicles([]);
        throw new Error(data?.message || 'Error al cargar los vehículos.');
      }
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      setError(err.message || 'Error al cargar los vehículos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  
  // Obtener un vehículo por ID
  const getVehicle = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/car/cars/${id}`);
      if (!response.data) {
        throw new Error('No se encontraron datos del vehículo');
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  };

  // Crear un nuevo vehículo
  const createVehicle = async (vehicleData) => {
    try {
      // Validar y procesar los datos antes de enviarlos
      const processedData = {
        ...vehicleData,
        price: Number(vehicleData.price) || 0,
        kilometer: Number(vehicleData.kilometer) || 0,
        registrationYear: Number(vehicleData.registrationYear) || 0,
        door: Number(vehicleData.door) || 0,
        disponible: Boolean(vehicleData.disponible),
        images: vehicleData.images.map((img) => ({
          public_id: img.public_id || null,
          secure_url: img.secure_url || null,
          file: img.file || null,
          resource_type: img.resource_type || "image",
        })),
      };

      // Enviar los datos al backend
      const response = await axios.post(`${API_URL}/car/cars`, processedData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.data || !response.data.data) {
        throw new Error('La respuesta del servidor no contiene los datos esperados.');
      }

      // Actualizar el estado global
      const newVehicle = response.data.data;
      setVehicles((prev) => [...prev, newVehicle]);

      console.log('Vehículo creado con éxito:', newVehicle);
      return { success: true, data: newVehicle };
    } catch (err) {
      console.error('Error al crear vehículo:', err.response || err.message);
      return {
        success: false,
        error: err.response?.data?.message || 'Error al comunicarse con el servidor.',
      };
    }
  };

  // Actualizar un vehículo existente
  const updateVehicle = async (id, vehicleData) => {
    try {
      // Validar y procesar los datos antes de enviarlos
      const processedData = {
        ...vehicleData,
        price: Number(vehicleData.price) || 0,
        kilometer: Number(vehicleData.kilometer) || 0,
        registrationYear: Number(vehicleData.registrationYear) || 0,
        door: Number(vehicleData.door) || 0,
        disponible: Boolean(vehicleData.disponible),
        images: vehicleData.images.map((img) => ({
          public_id: img.public_id || null,
          secure_url: img.secure_url || null,
          file: img.file || null,
          resource_type: img.resource_type || "image",
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || "",
        })),
        imagesToDelete: vehicleData.imagesToDelete || [],
      };

      // Enviar datos al backend
      const response = await axios.put(`${API_URL}/car/cars/${id}`, processedData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Error al actualizar el vehículo.');
      }

      // Actualizar el vehículo en el estado global
      const updatedVehicle = response.data.data;
      setVehicles((prev) => prev.map((v) => (v._id === updatedVehicle._id ? updatedVehicle : v)));

      console.log('Vehículo actualizado con éxito:', updatedVehicle);
      return { success: true, data: updatedVehicle };
    } catch (err) {
      console.error('Error al actualizar vehículo:', err.message);
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar el vehículo.',
      };
    }
  };
  

  // Eliminar un vehículo
  const deleteVehicle = async (id) => {
    try {
      setError(null);

      const { data } = await axios.delete(`${API_URL}/car/cars/${id}`);
      if (data?.success) {
        setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== id));
      } else {
        throw new Error(data?.message || 'Error al eliminar el vehículo.');
      }
    } catch (err) {
      console.error('Error al eliminar vehículo:', err.response?.data || err.message);
      throw err;
    }
  };

  // Alternar disponibilidad de propiedad
  const toggleAvailability = async (id, currentAvailability) => {
    try {
      const response = await axios.patch(`${API_URL}/car/cars/${id}/availability`, {
        disponible: !currentAvailability,
      });

      if (response.data && response.data.data) {
        const updatedCar = response.data.data;

        setVehicles(prevProperties =>
          prevProperties.map(p => p._id === id ? updatedCar : p)
        );

        setFilteredVehicles(prevFiltered =>
          prevFiltered.map(p => p._id === id ? updatedCar : p)
        );
      }

      return response.data;
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      throw error;
    }
  };

  // Proveer el contexto a los componentes hijos
  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        error,
        getAllVehicles,
        createVehicle,
        getVehicle,
        updateVehicle,
        toggleAvailability,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};