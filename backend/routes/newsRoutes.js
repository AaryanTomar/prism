import express from 'express'

import { getStockNews } from '../controllers/newsController.js'

const router = express.Router();

router.get('/:ticker', getStockNews);

export default router;