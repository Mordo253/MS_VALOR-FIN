// routes/servicio.routes.js
import express from 'express';
import {
  createServicio,
  getAllServicios,
  getServicioBySlug,
  updateServicio,
  deleteServicio,
  updateAvailability,
  searchServicios,
  getServiciosByCategoria
} from '../controllers/service.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllServicios);
router.get('/search', searchServicios);
router.get('/categoria/:categoria', getServiciosByCategoria); 
router.get('/:slug', getServicioBySlug);

// Rutas protegidas (solo administradores)
router.post('/', auth, createServicio);
router.put('/:slug', auth, updateServicio);
router.delete('/:slug', auth, deleteServicio);
router.patch('/:slug/availability', auth, updateAvailability);

export default router;