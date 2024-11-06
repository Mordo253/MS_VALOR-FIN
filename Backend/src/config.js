import { config } from "dotenv";
config();

export const PORT = process.env.PORT;
export const MONGODB_URI =process.env.MONGODB_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000/api';
export const LOCAL_URL = process.env.LOCAL_URL;


export const CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME']
export const CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET']
export const CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY']
