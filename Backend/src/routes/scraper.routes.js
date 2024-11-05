import express from 'express';
import { getFinancialData, updateFinancialData } from '../controllers/scraper.controller.js';

const router = express.Router();

router.get('/financial-data', getFinancialData);
router.post('/update-data', updateFinancialData);

export default router;