import axios from 'axios';
import { API_URL } from "../config";

// Obtener todas las propiedades
export const getPropertiesRequest = async () => {
  return await axios.get(`${API_URL}/property/all-properties`);
};

// Crear una propiedad
export const createPropertyRequest = async (property) => {
  const formData = new FormData();
  
  Object.keys(property).forEach(key => {
    if (Array.isArray(property[key])) {
      property[key].forEach(item => formData.append(key, item));
    } else if (key === 'images') {
      property[key].forEach(image => formData.append('images', image));
    } else {
      formData.append(key, property[key]);
    }
  });

  return await axios.post(`${API_URL}/property/properties`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener una propiedad por ID
export const getPropertyRequest = async (id) => {
  return await axios.get(`${API_URL}/property/properties/${id}`);
};

// Actualizar una propiedad
export const updatePropertyRequest = async (id, updatedProperty) => {
  const formData = new FormData();
  
  Object.keys(updatedProperty).forEach(key => {
    if (key !== 'images') {
      formData.append(key, updatedProperty[key]);
    }
  });

  if (updatedProperty.images && updatedProperty.images.length > 0) {
    updatedProperty.images.forEach(image => {
      formData.append('images', image);
    });
  }

  return await axios.put(`${API_URL}/property/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Eliminar una propiedad
export const deletePropertyRequest = async (id) => {
  return await axios.delete(`${API_URL}/property/properties/${id}`);
};
