import yahooFinance from 'yahoo-finance2';
import Stock from '../models/Stock.js';
import { generateStockOverviewWithLLM } from './newsController.js';

// Import necessary modules

// MongoDB model (assuming a schema is already defined for stock data)


/**
 * Finds the most relevant stock ticker for a given natural language input.
 * @param {string} input - The natural language input (e.g., "apple").
 * @returns {Promise<string>} - The stock ticker (e.g., "AAPL").
 */
async function getTickerFromInput(input) {
    try {
        const searchResults = await yahooFinance.search(input);
        if (searchResults.quotes && searchResults.quotes.length > 0) {
            return searchResults.quotes[0].symbol; // Return the most relevant ticker
        }
        throw new Error('No ticker found for the given input.');
    } catch (error) {
        console.error('Error fetching ticker:', error.message);
        throw error;
    }
}

/**
 * Retrieves the LLM summary for a given natural language input.
 * @param {string} input - The natural language input.
 * @returns {Promise<string>} - The LLM summary for the stock.
 */
async function getLLMSummary(input) {
    try {
      const ticker = await getTickerFromInput(input);
      console.log("📍 Step 1: Got ticker:", ticker);
  
      let stock = await Stock.findOne({ ticker });
      console.log("📍 Step 2: Queried DB");
  
      if (stock?.llmSummary) {
        console.log("✅ Summary already exists");
        return stock.llmSummary;
      }
  
      console.log('📄 No summary found — generating new one...');
      await generateStockOverviewWithLLM(input);
  
      stock = await Stock.findOne({ ticker });
      if (stock?.llmSummary) {
        console.log("✅ Summary created and saved");
        return stock.llmSummary;
      }
  
      throw new Error('LLM summary not found even after generation.');
    } catch (err) {
      console.error('❌ getLLMSummary error:', err.message);
      throw err;
    }
  }
  
  export {
    getTickerFromInput,
    getLLMSummary,
  };




    