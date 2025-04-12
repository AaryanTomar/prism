// --- Imports ---
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import stockRoutes from './routes/stockRoutes.js';

// --- Config ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

console.log('API Key loaded:', process.env.FINNHUB_API_KEY ? 'Yes (length: ' + process.env.FINNHUB_API_KEY.length + ')' : 'No');

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- Test Route ---
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong 🏓 from backend' });
});

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('Welcome to Stock API! Use /api/stocks/quote/SYMBOL to get stock quotes.');
  });  
  
// --- Routes ---
app.use('/api', stockRoutes);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
