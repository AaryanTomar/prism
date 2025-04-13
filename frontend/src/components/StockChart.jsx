import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const StockChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (data && data.c && data.t) {
      const formattedData = data.c.map((price, index) => {
        return {
          date: new Date(data.t[index] * 1000).toLocaleDateString(),
          price
        };
      });
      
      setChartData(formattedData);
    }
  }, [data]);
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;