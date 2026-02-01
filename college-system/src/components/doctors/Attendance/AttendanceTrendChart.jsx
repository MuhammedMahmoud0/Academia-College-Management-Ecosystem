import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AttendanceTrendChart = ({ data }) => {
  const chartData = data || [
    { week: 'Week 1', rate: 85 },
    { week: 'Week 2', rate: 88 },
    { week: 'Week 3', rate: 92 },
    { week: 'Week 4', rate: 90 }
  ];

  const getBarColor = (rate) => {
    if (rate >= 90) return '#6366f1';
    if (rate >= 75) return '#8b5cf6';
    return '#a855f7';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">Attendance Trend</h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value}%`, 'Attendance Rate']}
          />
          <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;
