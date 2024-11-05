import axios from 'axios';
import { API_URL } from "../config";

// Obtener todas las Vehiculo
export const getCarsRequest = async () => {
  return await axios.get(API_URL);
};

// Crear una Vehiculo
export const createCarRequest = async (car) => {
  const formData = new FormData();
  
  Object.keys(car).forEach(key => {
    if (Array.isArray(car[key])) {
      car[key].forEach(item => formData.append(key, item));
    } else if (key === 'images') {
      car[key].forEach(image => formData.append('images', image));
    } else {
      formData.append(key, car[key]);
    }
  });

  return await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener una Vehiculo por ID
export const getCarRequest = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Actualizar una Vehiculo
export const updateCarRequest = async (id, updatedcar) => {
  return await axios.put(`${API_URL}/${id}`, updatedcar);
};

// Eliminar una Vehiculo
export const deleteCarRequest = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
