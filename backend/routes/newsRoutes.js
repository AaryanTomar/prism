// newsRoutes.js
import express from 'express';
import { getLLMSummary } from '../controllers/dataRetrieval.js';
import Stock from '../models/Stock.js';

const router = express.Router();

router.get('/data/:ticker', async (req, res) => {
  const { ticker } = req.params;
  console.log(`📌 Received request for ticker: ${ticker}`);
  
  try {
    // First check the database directly
    console.log(`📌 Checking database for ${ticker}`);
    const stockData = await Stock.findOne({ ticker });
    console.log(`📌 Database result: ${stockData ? 'Found' : 'Not found'}`);
    
    // If we have a summary already, return it
    if (stockData && stockData.llmSummary) {
      console.log(`📌 Found existing summary for ${ticker}`);
      return res.json({
        news: stockData.news || [],
        llmSummary: stockData.llmSummary
      });
    }
    
    // Otherwise generate a new summary
    console.log(`📌 No summary found, generating for ${ticker}`);
    const summary = await getLLMSummary(ticker);
    console.log(`📌 Summary generation complete: ${summary ? 'Success' : 'Failed'}`);
    
    // Get the latest data after summary generation
    const updatedStockData = await Stock.findOne({ ticker });
    
    res.json({
      news: updatedStockData?.news || [],
      llmSummary: summary
    });
  } catch (err) {
    console.error(`❌ ERROR in /data/${ticker}:`, err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;
``