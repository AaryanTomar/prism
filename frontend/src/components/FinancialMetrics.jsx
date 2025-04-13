import React from 'react';

const FinancialMetrics = ({ financials, stockData, profile }) => {
  if (!financials || !financials.metric) {
    return <div className="financials-container">No financial metrics available</div>;
  }

  const { metric } = financials;
    
  // formatting
  const formatMarketCap = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    if (value >= 1000) {
      return `$${(value / 1000000).toFixed(2)}T`;
    } else {
      return `$${(value / 1000).toFixed(2)}B`;
    }
  };
      
  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    if (value < 0.1) {
      return `${(value * 100).toFixed(3)}%`;
    } else {
      return `${value.toFixed(2)}%`;
    }
  };
  
  const formatPrice = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `$${value.toFixed(2)}`;
  };
  
  const formatLargeNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    return `$${(value / 1000000).toFixed(2)}T`;
  };
  
  // display
  const keyMetrics = [
    { 
      label: 'Open', 
      value: stockData ? stockData.o : null, 
      format: formatPrice 
    },
    { 
      label: 'High', 
      value: stockData ? stockData.h : null, 
      format: formatPrice 
    },
    { 
      label: 'Low', 
      value: stockData ? stockData.l : null, 
      format: formatPrice 
    },
    { 
      label: 'Market Cap', 
      value: profile ? profile.marketCapitalization : null, 
      format: formatLargeNumber 
    },
    { 
      label: 'P/E Ratio', 
      value: metric.peBasicExclExtraTTM, 
      format: (value) => value ? value.toFixed(2) : 'N/A' 
    },
    { 
      label: 'Div Yield', 
      value: metric.dividendYieldIndicatedAnnual, 
      format: formatPercent 
    },
    { 
      label: '52-wk High', 
      value: metric['52WeekHigh'], 
      format: formatPrice 
    },
    { 
      label: '52-wk Low', 
      value: metric['52WeekLow'], 
      format: formatPrice 
    }
  ];

  return (
    <div className="financials-container">
      <h3>Key Metrics</h3>
      
      <div className="key-metrics">
        <table>
          <tbody>
            {keyMetrics.map((metric, index) => (
              <tr key={index}>
                <td className="metric-label">{metric.label}</td>
                <td className="metric-value">
                  {metric.value === null || metric.value === undefined 
                    ? 'N/A' 
                    : metric.format(metric.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialMetrics;