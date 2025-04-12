import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const TIINGO_API_TOKEN = process.env.TIINGO_API_TOKEN;

// debugging
console.log('STOCKROUTES - API key first 4 chars:', process.env.FINNHUB_API_KEY ? process.env.FINNHUB_API_KEY.substring(0, 4) : 'undefined');
console.log('STOCKROUTES - API key length:', process.env.FINNHUB_API_KEY ? process.env.FINNHUB_API_KEY.length : 0);
console.log('STOCKROUTES - Tiingo API token first 4 chars:', process.env.TIINGO_API_TOKEN ? process.env.TIINGO_API_TOKEN.substring(0, 4) : 'undefined');
console.log('STOCKROUTES - Tiingo API token length:', process.env.TIINGO_API_TOKEN ? process.env.TIINGO_API_TOKEN.length : 0);

// API req helper
async function makeAPIRequest(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
  
// finnhub - stock quotes prices and percentage
router.get('/quote/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      console.log(`Requesting quote for ${symbol} from Finnhub`);
      
      const data = await makeAPIRequest(quoteUrl);
      res.json(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      res.status(500).json({ error: error.message });
    }    
  });
    
  // finnhub - company info
  router.get('/profile/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
      
      console.log(`Requesting company profile for ${symbol} from Finnhub`);
      const data = await makeAPIRequest(url);
      res.json(data);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // finnhub - basic financials
  router.get('/financials/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const url = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
      
      console.log(`Requesting financials for ${symbol} from Finnhub`);
      const data = await makeAPIRequest(url);
      res.json(data);
    } catch (error) {
      console.error('Error fetching financials:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // tiingo - historical data
  router.get('/candles/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const { resolution = 'D', from, to } = req.query;
      
      // Convert Unix timestamps to YYYY-MM-DD format for Tiingo
      const fromDate = new Date(parseInt(from) * 1000).toISOString().split('T')[0];
      const toDate = new Date(parseInt(to) * 1000).toISOString().split('T')[0];
      
      // Map resolution to Tiingo format
      let resampleFreq;
      switch (resolution.toUpperCase()) {
        case 'D': resampleFreq = 'daily'; break;
        case 'W': resampleFreq = 'weekly'; break;
        case 'M': resampleFreq = 'monthly'; break;
        default: resampleFreq = 'daily';
      }
      
      console.log(`Requesting historical data for ${symbol} from ${fromDate} to ${toDate} from Tiingo`);
      
      const url = `https://api.tiingo.com/tiingo/daily/${symbol}/prices?startDate=${fromDate}&endDate=${toDate}&resampleFreq=${resampleFreq}&token=${TIINGO_API_TOKEN}`;
      const data = await makeAPIRequest(url);
      
      // Format the data to match Finnhub's format
      const formattedData = {
        s: "ok",
        t: [], // timestamps
        o: [], // open
        h: [], // high
        l: [], // low
        c: [], // close
        v: []  // volume
      };
      
      data.forEach(candle => {
        formattedData.t.push(new Date(candle.date).getTime() / 1000);
        formattedData.o.push(candle.open);
        formattedData.h.push(candle.high);
        formattedData.l.push(candle.low);
        formattedData.c.push(candle.close);
        formattedData.v.push(candle.volume);
      });
      
      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).json({ error: error.message });
    }
  });  

export default router;

