import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const News = ({ ticker }) => {
  const [newsData, setNewsData] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchedTickerRef = useRef('');

  useEffect(() => {
    if (ticker && ticker !== lastFetchedTickerRef.current) {
      const fetchNews = async () => {
        setLoading(true);
        setError(null);
        
        try {
          console.log(`Fetching news for ${ticker}...`);
          const response = await axios.get(`http://localhost:3000/api/news/overview/${ticker}`);
          
          if (response.data) {
            setNewsData(response.data.news || []);
            setSummary(response.data.llmSummary || '');
            lastFetchedTickerRef.current = ticker;
          }
        } catch (err) {
          console.error('Error fetching news data:', err);
          setError('Failed to load news data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [ticker]);

  if (loading && !newsData.length) {
    return (
      <div className="news-container loading">
        <h3>Loading news for {ticker}...</h3>
      </div>
    );
  }

  if (error && !newsData.length) {
    return (
      <div className="news-container error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h3>News & Analysis</h3>
      
      {summary && (
        <div className="news-summary">
          <h4>AI-Generated Analysis</h4>
          <div className="summary-content">
            {summary.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>
      )}
      
      <div className="news-articles">
        <h4>Recent News</h4>
        {newsData.length > 0 ? (
          <ul className="article-list">
            {newsData.slice(0, 5).map((article, index) => (
              <li key={index} className="article-item">
                <div className="article-title">{article.title}</div>
                <div className="article-date">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-news">No recent news found for {ticker}</p>
        )}
      </div>
    </div>
  );
};

export default News;