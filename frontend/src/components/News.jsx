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
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          console.log(`Fetching data for ${ticker}...`);
          // Use the full URL to ensure it reaches the correct endpoint
          const response = await axios.get(`http://localhost:3000/api/news/data/${ticker}`);
          
          console.log('Response received:', response.status);
          console.log('Response data:', response.data);
          
          if (response.data) {
            setNewsData(response.data.news || []);
            setSummary(response.data.llmSummary || '');
            console.log('Set summary to:', response.data.llmSummary);
            lastFetchedTickerRef.current = ticker;
          }
        } catch (err) {
          console.error('Error fetching news data:', err);
          setError('Failed to load news data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
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
    </div>
  );
};

export default News;