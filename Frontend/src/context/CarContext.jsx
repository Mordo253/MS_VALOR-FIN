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

  // Obtener todos los vehículos
  const getAllVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/car/all-cars`);
      console.log('Respuesta del servidor:', response.data); // Para depuración

      if (response.data && Array.isArray(response.data.data)) {
        setVehicles(response.data.data); // Asegura que sea un array
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      setError('Error al cargar los vehículos. Por favor, intenta de nuevo.');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo vehículo
  const createVehicle = async (vehicleData) => {
    try {
      const response = await axios.post(`${API_URL}/car/cars`, vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles([...vehicles, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error al crear vehículo:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Obtener un vehículo por ID
  const getVehicle = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/car/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  };

  // Actualizar un vehículo
  const updateVehicle = async (id, vehicleData) => {
    try {
      const response = await axios.put(`${API_URL}/car/cars/${id}`, vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles(vehicles.map(v => v._id === id ? response.data : v));
      return response.data;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      throw error;
    }
  };

  // Eliminar un vehículo
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_URL}/car/cars/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw error;
    }
  };

  // Proveer el contexto a los componentes hijos
  return (
    <VehicleContext.Provider value={{
      vehicles,
      loading,
      error,
      getAllVehicles,
      createVehicle,
      getVehicle,
      updateVehicle,
      deleteVehicle
    }}>
      {children}
    </VehicleContext.Provider>
  );
};
