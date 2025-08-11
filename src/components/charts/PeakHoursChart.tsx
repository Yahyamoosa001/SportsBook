import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  data: Array<{
    hour: number;
    bookings: number;
  }>;
}

const PeakHoursChart: React.FC<PeakHoursChartProps> = ({ data }) => {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hour" 
          tickFormatter={formatHour}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(hour: number) => formatHour(hour)}
          formatter={(value: number) => [value, 'Bookings']}
        />
        <Area 
          type="monotone" 
          dataKey="bookings" 
          stroke="#ffc658" 
          fill="#ffc658" 
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PeakHoursChart;
