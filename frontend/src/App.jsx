import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import StockChart from './components/StockChart';
import CompanyProfile from './components/CompanyProfile';
import FinancialMetrics from './components/FinancialMetrics';
import News from './components/News';
import AILearning from './components/AILearning';

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const API_BASE_URL = 'http://localhost:3000/api/stocks';

  const MemoizedNews = useMemo(() => {
    return ticker ? <News ticker={ticker} /> : null;
  }, [ticker]);
  
  // Add memoized component for AILearning
  const MemoizedAILearning = useMemo(() => {
    return ticker && stockData && profile ? 
      <AILearning ticker={ticker} profile={profile} stockData={stockData} /> : null;
  }, [ticker, stockData, profile]);

  const fetchStockData = async () => {
    if (!ticker) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const endDate = Math.floor(Date.now() / 1000);
      let startDate;
      
      switch(timeframe) {
        case '1W':
          startDate = endDate - 60 * 60 * 24 * 7; // 1 week
          break;
        case '1M':
          startDate = endDate - 60 * 60 * 24 * 30; // 1 month
          break;
        case '3M':
          startDate = endDate - 60 * 60 * 24 * 90; // 3 months
          break;
        case '6M':
          startDate = endDate - 60 * 60 * 24 * 180; // 6 months
          break;
        case '1Y':
          startDate = endDate - 60 * 60 * 24 * 365; // 1 year
          break;
        default:
          startDate = endDate - 60 * 60 * 24 * 30; // Default to 1 month
      }
      
      if (!stockData) {
        const [quoteResponse, profileResponse, financialsResponse, historicalResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/quote/${ticker}`),
          axios.get(`${API_BASE_URL}/profile/${ticker}`),
          axios.get(`${API_BASE_URL}/financials/${ticker}`),
          axios.get(`${API_BASE_URL}/candles/${ticker}?resolution=D&from=${startDate}&to=${endDate}`)
        ]);
        
        setStockData(quoteResponse.data);
        setProfile(profileResponse.data);
        setFinancials(financialsResponse.data);
        setHistoricalData(historicalResponse.data);
      } else {
        const historicalResponse = await axios.get(
          `${API_BASE_URL}/candles/${ticker}?resolution=D&from=${startDate}&to=${endDate}`
        );
        setHistoricalData(historicalResponse.data);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please check if the server is running and the ticker is valid.');
      
      if (!stockData) {
        setStockData(null);
        setProfile(null);
        setFinancials(null);
        setHistoricalData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker) {
      setStockData(null);
      fetchStockData();
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker && stockData) {
      fetchStockData();
    }
  }, [timeframe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTicker(inputValue.trim().toUpperCase());
    }
  };

  const handleTimeframeChange = (newTimeframe) => {
    if (ticker) {
      setTimeframe(newTimeframe);
    }
  };

  const calculatePriceChange = () => {
    if (!stockData) return { change: 0, percentChange: 0 };
    
    const change = stockData.c - stockData.pc;
    const percentChange = (change / stockData.pc) * 100;
    
    return {
      change: change.toFixed(2),
      percentChange: percentChange.toFixed(2)
    };
  };

  const { change, percentChange } = calculatePriceChange();
  const isPositive = change >= 0;

// home page
const renderWelcomePage = () => (
  <div className="welcome-message">
    <h2>STOCK VISUALIZER</h2>
    <p>Enter a ticker symbol to view detailed price information, financials, and news.</p>
    
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a ticker (e.g., AAPL)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
    
    <div className="example-tickers">
      <span>Examples</span>
      <div>
        <button onClick={() => {setInputValue('AAPL'); setTicker('AAPL');}}>AAPL</button>
        <button onClick={() => {setInputValue('MSFT'); setTicker('MSFT');}}>MSFT</button>
        <button onClick={() => {setInputValue('GOOGL'); setTicker('GOOGL');}}>GOOGL</button>
        <button onClick={() => {setInputValue('AMZN'); setTicker('AMZN');}}>AMZN</button>
      </div>
    </div>
  </div>
);

// search ticker content
// search ticker content
const renderDashboard = () => (
  <>
    <header className="app-header">
      <div className="stock-info">
        <div className="stock-header">
          <h2>{ticker}</h2>
          {profile && <span className="company-name">{profile.name}</span>}
        </div>
        <div className="stock-price">
          <span className="current-price">${stockData.c.toFixed(2)}</span>
          <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{percentChange}%)
          </span>
        </div>
      </div>
      
      <div className="title-search">
        <h1>STOCK VISUALIZER</h1>
        
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a ticker (e.g., AAPL)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>

    <div className="enhanced-dashboard-grid">
      <div className="stock-data-section">
        <div className="chart-section">
          <div className="timeframe-selector">
            <button className={timeframe === '1W' ? 'active' : ''} onClick={() => handleTimeframeChange('1W')}>1W</button>
            <button className={timeframe === '1M' ? 'active' : ''} onClick={() => handleTimeframeChange('1M')}>1M</button>
            <button className={timeframe === '3M' ? 'active' : ''} onClick={() => handleTimeframeChange('3M')}>3M</button>
            <button className={timeframe === '6M' ? 'active' : ''} onClick={() => handleTimeframeChange('6M')}>6M</button>
            <button className={timeframe === '1Y' ? 'active' : ''} onClick={() => handleTimeframeChange('1Y')}>1Y</button>
          </div>
          {historicalData && <StockChart data={historicalData} />}
        </div>
        
        <div className="info-panels">
          {profile && <CompanyProfile profile={profile} />}
          {financials && <FinancialMetrics 
            financials={financials} 
            stockData={stockData} 
            profile={profile} 
          />}
        </div>
      </div>

      <div className="news-section">
        {MemoizedNews}
        {MemoizedAILearning}
      </div>
    </div>
  </>
);

  return (
    <div className="app-container">
      {loading && <div className="loading">Loading data for {ticker}...</div>}
      
      {error && <div className="error">{error}</div>}

      {!ticker && !loading && !error && renderWelcomePage()}

      {stockData && !loading && renderDashboard()}
    </div>
  );
}

export default App;