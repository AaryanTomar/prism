import fetch from 'node-fetch';
import Stock from '../models/Stock.js';
import yahooFinance from 'yahoo-finance2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' });


export const generateStockOverviewWithLLM = async (input) => {
  console.log('📥 Generating stock overview for:', input);

  try {
    const result = await yahooFinance.search(input);

    if (!result.quotes.length) {
      throw new Error(`No match found for input "${input}"`);
    }

    const bestMatch = result.quotes[0];
    const { symbol, shortname } = bestMatch;

    const baseUrl = 'https://newsapi.org/v2/everything';
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const fromDate = oneMonthAgo.toISOString().split('T')[0];

    const fetchNews = async (query) => {
      try {
        const url = `${baseUrl}?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=popularity&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.articles) {
          console.error('❌ No articles returned:', data);
          return [];
        }

        return data.articles.slice(0, 10).map(article => ({
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt
        }));
      } catch (err) {
        console.error('❌ fetchNews error:', err.message);
        return [];
      }
    };

    const companyNews = await fetchNews(shortname);
    const tickerNews = await fetchNews(symbol);
    const combinedNews = [...companyNews, ...tickerNews];

    const prompt = `Do not use any formatting, such as bolding. Based on the following stories, if relevant, for ${shortname} (${symbol}) discuss the financial outlook based on market conditions, competitor performance, and macroeconomic factors (like tariffs, interest rates, or regulation).\n\n` +`Jump straight into the summary and keep it 2-3 sentences in language regular people can understand. Explain clearly and directly in a way someone unfamiliar with finance what factors will affect the company and how.`+
        combinedNews.map((a, i) => `${i + 1}. ${a.title} - ${a.description}`).join('\n');

    const geminiResponse = await model.generateContent(prompt);
    const summary = geminiResponse.response.text();

    const stockData = await Stock.findOneAndUpdate(
      { ticker: symbol },
      { $set: { companyName: shortname, news: combinedNews, llmSummary: summary } },
      { upsert: true, new: true }
    );

    console.log(`✅ Overview saved for ${symbol}`);
    return stockData;
  } catch (err) {
    console.error('❌ Error generating stock overview:', err.message);
    throw err;
  }
};

export const getStockNews = async (req, res) => {
    const { ticker } = req.params;
    const baseUrl = 'https://newsapi.org/v2/everything';
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
  
    try {
      const url = `${baseUrl}?q=${encodeURIComponent(ticker)}&from=${fromDate}&sortBy=popularity&pageSize=10&apiKey=${process.env.NEWS_API}`;
      const response = await fetch(url);
      const data = await response.json();
      const articles = data.articles.slice(0, 20).map(article => ({
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt
      }));
  
      const savedStock = await Stock.findOneAndUpdate(
        { ticker },
        { $set: { news: articles } },
        { upsert: true, new: true }
      );
      res.json({ ticker, articles });
    } catch (err) {
      console.error(' Error fetching stock news:', err);
      res.status(500).json({ message: 'Failed to fetch stock news' });
    }
};
  


