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

  // Crear un nuevo vehículo
  const createVehicle = async (vehicleData) => {
    try {
      console.log("Datos que se envían al backend:", vehicleData);

      // Eliminar el campo 'codigo' ya que lo genera automáticamente el backend
      const { codigo, ...vehicleDataWithoutCodigo } = vehicleData;

      // Procesar los datos numéricos de forma correcta
      const processedData = {
        ...vehicleDataWithoutCodigo,
        price: Number(vehicleData.price) || 0,
        kilometer: Number(vehicleData.kilometer) || 0,
        registrationYear: Number(vehicleData.registrationYear) || 0,
        door: Number(vehicleData.door) || 0,
        model: vehicleData.model || "",  // Si model es string, no convertirlo a number
      };

      console.log("Datos procesados antes de enviar:", processedData);

      // Enviar los datos al backend como JSON
      const response = await axios.post(`${API_URL}/car/cars`, processedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Validar la respuesta del backend
      if (!response.data || !response.data.data) {
        console.error("Respuesta del servidor incompleta:", response);
        throw new Error("La respuesta del servidor no contiene los datos esperados");
      }

      const newCar = response.data.data;

      // Actualizar el estado del contexto
      setVehicles((prev) => [...prev, newCar]);

      console.log("Vehículo creado con éxito:", newCar);

      return { success: true, data: newCar };
    } catch (err) {
      // Manejo detallado de errores
      console.error("Error al crear vehículo:", err.response || err.message);

      const errorMessage = err.response?.data?.message || "Error al comunicarse con el servidor";

      return { success: false, error: errorMessage };
    }
  };

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

  const updateVehicle = async (id, vehicleData) => {
    try {
      console.log("Datos recibidos para actualizar:", vehicleData);
  
      // Procesar los datos numéricos y básicos
      const processedData = {
        ...vehicleData,
        precio: Number(vehicleData.precio) || 0,
        año: Number(vehicleData.año) || 0,
        kilometraje: Number(vehicleData.kilometraje) || 0,
        disponible: Boolean(vehicleData.disponible),
        updatedAt: new Date().toISOString(),
        // Procesar imágenes
        images: (vehicleData.images || []).map(img => ({
          public_id: img.public_id,
          secure_url: img.secure_url,
          file: img.file || null,
          resource_type: img.resource_type || 'image'
        })).filter(img => {
          // Mantener solo imágenes válidas
          if (img.file && typeof img.file === 'string' && img.file.startsWith('data:')) {
            return true; // Imágenes nuevas con base64
          }
          if (img.secure_url && !img.secure_url.startsWith('blob:')) {
            return true; // Imágenes existentes con URL válida
          }
          return false;
        }),
        // Imágenes a eliminar (filtrar IDs temporales)
        imagesToDelete: (vehicleData.imagesToDelete || []).filter(id => 
          typeof id === 'string' && !id.startsWith('temp_')
        )
      };
  
      // Validaciones adicionales
      if (!processedData.images || processedData.images.length === 0) {
        throw new Error('Debe incluir al menos una imagen');
      }
  
      // Verificar tamaño de imágenes base64
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedImages = processedData.images.filter(img => 
        img.file && typeof img.file === 'string' && 
        (img.file.length * 0.75) > maxSize
      );
  
      if (oversizedImages.length > 0) {
        throw new Error('Una o más imágenes exceden el tamaño máximo permitido (5MB)');
      }
  
      // Log seguro (sin mostrar datos base64 completos)
      console.log("Datos procesados antes de enviar:", {
        ...processedData,
        images: processedData.images.map(img => ({
          ...img,
          file: img.file ? 'base64_data_present' : 'no_file',
          secure_url: img.secure_url ? 'url_present' : 'no_url'
        }))
      });
  
      // Realizar la petición
      const response = await axios.put(
        `${API_URL}/car/cars/${id}`, 
        processedData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000, // 30 segundos
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
  
      // Verificar respuesta
      if (!response.data || !response.data.data) {
        console.error('Respuesta del servidor incompleta:', response);
        throw new Error('La respuesta del servidor no contiene los datos esperados');
      }
  
      const updatedVehicle = response.data.data;
  
      // Actualizar estado local
      setVehicles(prevVehicles =>
        prevVehicles.map(v => v._id === updatedVehicle._id ? updatedVehicle : v)
      );
  
      return response.data;
  
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
  
      // Manejar errores específicos
      if (error.response?.status === 413) {
        throw new Error('Las imágenes son demasiado grandes. Por favor, reduzca su tamaño.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('La operación tardó demasiado tiempo. Por favor, intente nuevamente.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Error al actualizar el vehículo. Por favor, intente nuevamente.');
      }
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
