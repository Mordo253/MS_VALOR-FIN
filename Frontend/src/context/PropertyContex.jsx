import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración para enviar cookies
  axios.defaults.withCredentials = true;

  // Obtener todas las propiedades
  const getAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.get(`${API_URL}/property/all-properties`);
      if (response.data && Array.isArray(response.data.data)) {
        setProperties(response.data.data);
        setFilteredProperties(response.data.data);
      } else {
        setProperties([]);
        setFilteredProperties([]);
      }
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      setError('Error al cargar las propiedades. Por favor, intenta de nuevo.');
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar propiedades en función de los filtros proporcionados
  const filterProperties = (filters) => {
    let filtered = properties;

    if (filters.zona) {
      filtered = filtered.filter((property) => property.zona === filters.zona);
    }

    if (filters.tipoInmueble) {
      filtered = filtered.filter((property) => property.tipoInmueble === filters.tipoInmueble);
    }

    if (filters.costo) {
      filtered = filtered.filter((property) => property.costo <= parseInt(filters.costo, 10));
    }

    if (filters.alcobas) {
      filtered = filtered.filter((property) => property.alcobas === parseInt(filters.alcobas, 10));
    }
    if (filters.banos) {
      filtered = filtered.filter((property) => property.banos === parseInt(filters.banos, 10));
    }

    setFilteredProperties(filtered);
  };

  const createProperty = async (propertyData) => {
    try {
      const response = await axios.post(`${API_URL}/property/properties`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProperties([...properties, response.data]);
      setFilteredProperties([...properties, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error al crear propiedad:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const getProperty = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/property/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedad:', error);
      throw error;
    }
  };

  const getPropertyCodes = async () => {
    try {
      const response = await axios.get(`${API_URL}/property/property-codes`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener códigos de propiedades:', error);
      throw error;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const formData = new FormData();
      
      Object.keys(propertyData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyData[key]);
        }
      });

      if (propertyData.images && propertyData.images.length > 0) {
        propertyData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.put(`${API_URL}/property/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProperties(properties.map(p => p._id === id ? response.data.data : p));
      setFilteredProperties(properties.map(p => p._id === id ? response.data.data : p));

      return response.data;
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      throw error;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/property/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
      setFilteredProperties(properties.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      throw error;
    }
  };

  // Nueva función para alternar disponibilidad
 // PropertyContext.jsx

const toggleAvailability = async (id, currentAvailability) => {
  try {
    const response = await axios.patch(`${API_URL}/property/properties/${id}/availability`, {
      disponible: !currentAvailability,
    });
    // Actualiza la lista de propiedades
    setProperties(properties.map(p => p._id === id ? response.data.data : p));
    setFilteredProperties(properties.map(p => p._id === id ? response.data.data : p));
  } catch (error) {
    console.error('Error al cambiar disponibilidad:', error);
    throw error;
  }
};


  return (
    <PropertyContext.Provider value={{
      properties,
      filteredProperties,
      loading,
      error,
      getAllProperties,
      getPropertyCodes,
      filterProperties,
      createProperty,
      getProperty,
      updateProperty,
      deleteProperty,
      toggleAvailability, // Asegúrate de exportar esta función
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
