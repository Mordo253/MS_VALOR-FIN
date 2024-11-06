import axios from 'axios';
import { API_URL } from "../config";

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logs en desarrollo
if (import.meta.env.DEV) {
  api.interceptors.request.use(config => {
    console.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log('✅ Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
      return response;
    },
    error => {
      console.error('❌ Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );
}

// Obtener todas las propiedades
export const getPropertiesRequest = () => {
  return api.get('/property/all-properties');
};

// Crear una propiedad
export const createPropertyRequest = (property) => {
  const formData = new FormData();
  
  Object.entries(property).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, item));
    } else if (key === 'images' && value) {
      value.forEach(image => formData.append('images', image));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return api.post('/property/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener una propiedad por ID
export const getPropertyRequest = (id) => {
  return api.get(`/property/properties/${id}`);
};

// Actualizar una propiedad
export const updatePropertyRequest = (id, updatedProperty) => {
  const formData = new FormData();
  
  Object.entries(updatedProperty).forEach(([key, value]) => {
    if (key !== 'images' && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (updatedProperty.images?.length > 0) {
    updatedProperty.images.forEach(image => {
      formData.append('images', image);
    });
  }

  return api.put(`/property/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Eliminar una propiedad
export const deletePropertyRequest = (id) => {
  return api.delete(`/property/properties/${id}`);
};