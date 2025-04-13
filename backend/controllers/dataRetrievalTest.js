// testLLMSummary.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { getTickerFromInput, getLLMSummary } from '../controllers/dataRetrieval.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Test inputs
const testInputs = [
  'Apple',
  'Mattel'
];

// Run test
const runTests = async () => {
  for (const input of testInputs) {
    try {
      console.log(`\n🔍 Getting ticker for: ${input}`);
      const ticker = await getTickerFromInput(input);
      console.log(`✅ Ticker for ${input}: ${ticker}`);

      console.log(`📄 Fetching LLM summary for: ${ticker}`);
      const summary = await getLLMSummary(input);
      console.log(`📘 Summary for ${ticker}:\n${summary}\n`);
    } catch (err) {
      console.error(`❌ Error processing ${input}:`, err.message);
    }
  }

  mongoose.disconnect();
};

runTests();
