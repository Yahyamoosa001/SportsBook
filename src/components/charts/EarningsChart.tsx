import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsChartProps {
  data: Array<{
    month: string;
    earnings: number;
  }>;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
        />
        <Bar dataKey="earnings" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
