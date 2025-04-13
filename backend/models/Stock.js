import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: String,
  description: String,
  publishedAt: Date
});

const StockSchema = new mongoose.Schema({
  ticker: { type: String, required: true, unique: true },
  companyName: String,
  news: [ArticleSchema],
  llmSummary: String
});

export default mongoose.model('Stock', StockSchema);
