import { API_URL } from "../config";
import axios from "./axios";

// Función para iniciar sesión
export const loginRequest = async (user) => {
  return await axios.post(`${API_URL}/auth/login`, user, {
    withCredentials: true,
  });
};

// Función para verificar el token
export const verifyTokenRequest = async () => {
  return await axios.get(`${API_URL}/auth/verify`, {
    withCredentials: true,
  });
};

// Función para cambiar la contraseña
export const changePasswordRequest = async (oldPassword, newPassword) => {
  return await axios.put(
    `${API_URL}/auth/change-password`,
    { oldPassword, newPassword },
    { withCredentials: true }
  );
};
