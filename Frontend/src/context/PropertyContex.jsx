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
  const filterProperties = useCallback((filters) => {
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
  }, [properties]);

  const createProperty = async (propertyData) => {
    try {
      // Transformar características
      const formattedCaracteristicas = [
        ...(propertyData.caracteristicas?.internas || []).map(name => ({ name, type: 'interna' })),
        ...(propertyData.caracteristicas?.externas || []).map(name => ({ name, type: 'externa' }))
      ];

      console.log("Datos originales recibidos:", propertyData);
  
      // Procesar los datos numéricos y otros campos
      const processedData = {
        ...propertyData,
        areaConstruida: Number(propertyData.areaConstruida) || 0,
        areaTerreno: Number(propertyData.areaTerreno) || 0,
        areaPrivada: Number(propertyData.areaPrivada) || 0,
        alcobas: Number(propertyData.alcobas) || 0,
        costo: Number(propertyData.costo) || 0,
        banos: Number(propertyData.banos) || 0,
        garaje: Number(propertyData.garaje) || 0,
        estrato: Number(propertyData.estrato) || 0,
        piso: Number(propertyData.piso) || 0,
        valorAdministracion: Number(propertyData.valorAdministracion) || 0,
        anioConstruccion: Number(propertyData.anioConstruccion) || 0,
        useful_room: Number(propertyData.useful_room) || 0,
        videos: propertyData.videos || [], // Cambiar a array vacío
        creador: propertyData.creador || 'Administrador', // Valor por defecto
        propietario: propertyData.propietario || 'Desconocido', // Valor por defecto
        caracteristicas: formattedCaracteristicas // Usar características formateadas
      };
  
      console.log("Datos procesados antes de enviar:", processedData);
  
      // Enviar los datos al backend
      const response = await axios.post(`${API_URL}/property/properties`, processedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Validar la respuesta del backend
      if (!response.data || !response.data.data) {
        console.error("Respuesta del servidor incompleta:", response);
        throw new Error("La respuesta del servidor no contiene los datos esperados");
      }
  
      const newProperty = response.data.data;
  
      // Actualizar el estado del contexto
      setProperties((prev) => [...prev, newProperty]);
      setFilteredProperties((prev) => [...prev, newProperty]);
  
      console.log("Propiedad creada con éxito:", newProperty);
  
      return { success: true, data: newProperty };
    } catch (error) {
      console.error("Error al crear propiedad:", error.response || error.message);
  
      const errorMessage = error.response?.data?.message || "Error al comunicarse con el servidor";
  
      return { success: false, error: errorMessage };
    }
  };
  
   // Obtener una propiedad específica
   const getProperty = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/property/properties/${id}`);
      if (!response.data) {
        throw new Error('No se encontraron datos de la propiedad');
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedad:', error);
      throw error;
    }
  };

  // Obtener códigos de propiedades
  const getPropertyCodes = async () => {
    try {
      const response = await axios.get(`${API_URL}/property/property-codes`);
      if (!response.data || !response.data.data) {
        throw new Error('No se pudieron obtener los códigos de propiedades');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener códigos de propiedades:', error);
      throw error;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      // Transformar características para actualización
      const formattedCaracteristicas = [
        ...(propertyData.caracteristicas?.internas || []).map(name => ({ name, type: 'interna' })),
        ...(propertyData.caracteristicas?.externas || []).map(name => ({ name, type: 'externa' }))
      ];

      const processedData = {
        ...propertyData,
        caracteristicas: formattedCaracteristicas,
        areaConstruida: Number(propertyData.areaConstruida) || 0,
        areaTerreno: Number(propertyData.areaTerreno) || 0,
        areaPrivada: Number(propertyData.areaPrivada) || 0,
        alcobas: Number(propertyData.alcobas) || 0,
        costo: Number(propertyData.costo) || 0,
        banos: Number(propertyData.banos) || 0,
        garaje: Number(propertyData.garaje) || 0,
        estrato: Number(propertyData.estrato) || 0,
        piso: Number(propertyData.piso) || 0,
        valorAdministracion: Number(propertyData.valorAdministracion) || 0,
        anioConstruccion: Number(propertyData.anioConstruccion) || 0,
        useful_room: Number(propertyData.useful_room) || 0,
        videos: propertyData.videos || [],
        disponible: Boolean(propertyData.disponible),
        images: propertyData.images,
        imagesToDelete: propertyData.imagesToDelete || []
      };
  
      console.log("Datos procesados antes de enviar:", processedData);
  
      const response = await axios.put(
        `${API_URL}/property/properties/${id}`,
        processedData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
  
      if (!response.data || !response.data.data) {
        throw new Error('La respuesta del servidor no contiene los datos esperados');
      }
  
      const updatedProperty = response.data.data;
  
      // Actualizar estados
      setProperties(prev => prev.map(p => p._id === id ? updatedProperty : p));
      setFilteredProperties(prev => prev.map(p => p._id === id ? updatedProperty : p));
  
      return response.data;
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la propiedad');
    }
  };

  // Eliminar propiedad
  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/property/properties/${id}`);

      setProperties(prevProperties => prevProperties.filter(p => p._id !== id));
      setFilteredProperties(prevFiltered => prevFiltered.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      throw error;
    }
  };

  // Alternar disponibilidad de propiedad
  const toggleAvailability = async (id, currentAvailability) => {
    try {
      const response = await axios.patch(`${API_URL}/property/properties/${id}/availability`, {
        disponible: !currentAvailability,
      });

      if (response.data && response.data.data) {
        const updatedProperty = response.data.data;

        setProperties(prevProperties =>
          prevProperties.map(p => p._id === id ? updatedProperty : p)
        );

        setFilteredProperties(prevFiltered =>
          prevFiltered.map(p => p._id === id ? updatedProperty : p)
        );
      }

      return response.data;
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
      toggleAvailability
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export default PropertyProvider;