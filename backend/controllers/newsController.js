import fetch from 'node-fetch';
import Stock from '../models/Stock.js';
import yahooFinance from 'yahoo-finance2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' });


export const createStockNewsOverview = async (req, res) => {

    console.log('Creating stock news overview...');
    const { input } = req.params;

    console.log('Searching for symbol using input:', input);
    try {
        // Step 1: Use Yahoo to find best matching stock
        const result = await yahooFinance.search(input);

        if (!result.quotes.length) {
            return res.status(404).json({ message: `No match found for input "${input}"` });
        }

        const bestMatch = result.quotes[0];
        const { symbol, shortname } = bestMatch;

        // Step 2: Fetch news from NewsAPI for ticker and company name
        const baseUrl = 'https://newsapi.org/v2/everything';
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const fromDate = oneMonthAgo.toISOString().split('T')[0];

        const fetchNews = async (query) => {
            const url = `${baseUrl}?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=popularity&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            return data.articles.slice(0, 10).map(article => ({
            title: article.title,
            shortname: article.shortname,
            publishedAt: article.publishedAt
        }));
    };

    const nameQuery = bestMatch.shortname || bestMatch.description || symbol;
    const companyNews = await fetchNews(nameQuery);
    const tickerNews = await fetchNews(symbol);

    const combinedNews = [...companyNews, ...tickerNews];

    const geminiResult = await model.generateContent(`Do not use any formatting, such as bolding. Based on the following stories, if relevant, for ${shortname} (${symbol}) discuss the financial outlook based on market conditions, competitor performance, and macroeconomic factors (like tariffs, interest rates, or regulation).\n\n` +
        `Jump straight into the summary and keep it 3-4 sentences. Explain clearly and directly in a way someone unfamiliar with finance what factors will affect the company and how.`+
        combinedNews.map((a, i) => `${i + 1}. ${a.title} - ${a.description}`).join('\n'))
    const summary = geminiResult.response.text();


    // Step 3: Save to MongoDB as one document
    const stockData = await Stock.findOneAndUpdate(
        { ticker: symbol },
        { $set: { companyName: bestMatch.shortname, news: combinedNews, llmSummary: summary } },
        { upsert: true, new: true }
      );

    res.json(stockData);
  } catch (err) {
    console.error('Error generating news overview:', err);
    res.status(500).json({ message: 'Failed to create stock news overview' });
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
  


