// --- Imports ---
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes.js'
import stockRoutes from './routes/stockRoutes.js';
import aiRoutes from './routes/aiRoutes.js'; // Add this new import

// --- Config ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

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
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ai', aiRoutes); // Add this new route

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});