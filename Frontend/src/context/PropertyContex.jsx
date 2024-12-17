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
      console.log("Datos que se envían al backend:", propertyData);
  
      // Procesar los datos numéricos
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
        anioConstruccion: Number(propertyData.anioConstruccion) || 0
      };

  
      console.log("Datos procesados antes de enviar:", processedData);
  
      // Enviar los datos al backend como JSON
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
      // Manejo detallado de errores
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

  // Actualizar propiedad
const updateProperty = async (id, propertyData) => {
  try {
    console.log("Datos recibidos para actualizar:", propertyData);

    // Procesar los datos numéricos y básicos
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
      caracteristicas: propertyData.caracteristicas || [],
      disponible: Boolean(propertyData.disponible),
      updatedAt: new Date().toISOString(),
      // Procesar imágenes
      images: (propertyData.images || []).map(img => ({
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
      imagesToDelete: (propertyData.imagesToDelete || []).filter(id => 
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

    // Configurar la petición con timeout y límites adecuados
    const response = await axios.put(
      `${API_URL}/property/properties/${id}`, 
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

    const updatedProperty = response.data.data;

    // Actualizar estados locales
    setProperties(prevProperties =>
      prevProperties.map(p => p._id === updatedProperty._id ? updatedProperty : p)
    );

    setFilteredProperties(prevFiltered =>
      prevFiltered.map(p => p._id === updatedProperty._id ? updatedProperty : p)
    );

    return response.data;

  } catch (error) {
    console.error('Error al actualizar propiedad:', error);
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
      throw new Error('Error al actualizar la propiedad. Por favor, intente nuevamente.');
    }
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
