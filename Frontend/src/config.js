const isDevelopment = import.meta.env.MODE === 'development'; // Vite establece 'development' o 'production'

export const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? "http://localhost:3000/api" : "https://msdevalor.com/api");
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || (isDevelopment ? "http://localhost:5173/" : "https://msdevalor.com/");
