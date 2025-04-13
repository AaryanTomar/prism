import React from 'react';

const FinancialMetrics = ({ financials, stockData, profile }) => {
  if (!financials || !financials.metric) {
    return <div className="financials-container">No financial metrics available</div>;
  }

  const { metric } = financials;

  // formatting helpers
  const formatMarketCap = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return value >= 1000
      ? `$${(value / 1000000).toFixed(2)}T`
      : `$${(value / 1000).toFixed(2)}B`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return value < 0.1
      ? `${(value * 100).toFixed(3)}%`
      : `${value.toFixed(2)}%`;
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `$${value.toFixed(2)}`;
  };

  const formatLargeNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `$${(value / 1000000).toFixed(2)}T`;
  };

  const keyMetrics = [
    { label: 'Open', value: stockData?.o, format: formatPrice },
    { label: 'High', value: stockData?.h, format: formatPrice },
    { label: 'Low', value: stockData?.l, format: formatPrice },
    { label: 'Market Cap', value: profile?.marketCapitalization, format: formatLargeNumber },
    { label: 'P/E Ratio', value: metric.peBasicExclExtraTTM, format: (v) => v ? v.toFixed(2) : 'N/A' },
    { label: 'Div Yield', value: metric.dividendYieldIndicatedAnnual, format: formatPercent },
    { label: '52-wk High', value: metric['52WeekHigh'], format: formatPrice },
    { label: '52-wk Low', value: metric['52WeekLow'], format: formatPrice }
  ];

  return (
    <div className="financials-container">
      <h3>Key Metrics</h3>
      <div className="key-metrics-grid">
        {keyMetrics.map((metric, index) => (
          <div className="metric-item" key={index}>
            <span className="label">{metric.label}</span>
            <span className="value">
              {metric.value === null || metric.value === undefined
                ? 'N/A'
                : metric.format(metric.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;