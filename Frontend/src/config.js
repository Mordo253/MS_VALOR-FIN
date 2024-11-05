const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment 
  ? "http://localhost:3000/api"
  : "https://msdevalor.com/api";

export const FRONTEND_URL = isDevelopment 
  ? "http://localhost:5173/"
  : "https://msdevalor.com/";