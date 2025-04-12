import NewsArticle from '../models/newsArticle.js';
import fetch from 'node-fetch';

export const getStockNews = async (req, res) => {
  const { ticker } = req.params;
  const url = `https://newsapi.org/v2/everything?q=${ticker}&sortBy=popularity&pageSize=50&apiKey=${process.env.NEWSAPI_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
      
    // Slice to 50 (just in case) and save selected fields
    const articles = data.articles.slice(0, 50);

    const saved = await Promise.all(
      articles.map(article =>
        NewsArticle.create({
          ticker,
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt
        })
      )
    );

    console.log(`✅ Saved ${saved.length} articles for ${ticker}`);
    res.json(saved);
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch or save news' });
  }
};
