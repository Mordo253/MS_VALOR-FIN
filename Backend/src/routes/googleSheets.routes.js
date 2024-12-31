import { Router } from 'express';
import { exportToGoogleSheets } from '../controllers/property.controller.js';

const router = Router();

// Nueva ruta para exportar datos
router.get('/export-to-sheets', exportToGoogleSheets);

export default router;
