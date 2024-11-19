const isDevelopment = import.meta.env.MODE === 'development';

export const API_URL = isDevelopment 
  ? "http://localhost:3000/api" 
  : "https://ms-valor-fin.onrender.com/api";

export const FRONTEND_URL = isDevelopment 
  ? "http://localhost:5173/" 
  : "https://ms-valor-fin.onrender.com";