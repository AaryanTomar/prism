import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// debugging
console.log('STOCKROUTES - API key first 4 chars:', process.env.FINNHUB_API_KEY ? process.env.FINNHUB_API_KEY.substring(0, 4) : 'undefined');
console.log('STOCKROUTES - API key length:', process.env.FINNHUB_API_KEY ? process.env.FINNHUB_API_KEY.length : 0);

// Get stock quote
router.get('/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        console.log(`Requesting quote for ${symbol}`);
        
        const response = await fetch(quoteUrl);
        console.log('Response status:', response.status);
        
        if (response.status !== 200) {
          return res.status(response.status).json({ 
            error: `Finnhub returned status ${response.status}` 
          });
        }
        
        const data = await response.json();
        console.log('Quote data:', data);
        res.json(data);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
      }    
});

export default router;

