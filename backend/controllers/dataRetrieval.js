import yahooFinance from 'yahoo-finance2';
import Stock from '../models/Stock.js';

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
        console.log("1");
        // Try to fetch existing summary
        let stock = await Stock.findOne({ ticker });
        console.log("2");
        if (stock?.llmSummary) return stock.llmSummary;
        console.log('No summary found, generating new one...');
    
        // Trigger the route by making an HTTP GET request
        await fetch(`http://localhost:3000/api/news/overview/${ input }`);
    
        // Wait for MongoDB to update
        stock = await Stock.findOne({ ticker });
        if (stock?.llmSummary) return stock.llmSummary;
    
        throw new Error('Summary not found even after generation.');
        } catch (err) {
            console.error('getLLMSummary error:', err.message);
            throw err;
    }
}

export {
    getTickerFromInput,
    getLLMSummary,
};