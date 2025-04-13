import express from 'express';
import { getStockNews, createStockNewsOverview } from '../controllers/newsController.js';

const router = express.Router();

router.get('/:ticker', getStockNews);
router.get('/overview/:input', createStockNewsOverview);

export default router;
