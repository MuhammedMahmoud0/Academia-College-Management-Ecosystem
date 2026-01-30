import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const EnrollmentTrendsChart = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map(item => ({
    year: item.label,
    students: item.value
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-8">Enrollment Trends</h2>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#d1d5db"
              vertical={false}
            />
            <XAxis 
              dataKey="year" 
              axisLine={{ stroke: '#9ca3af', strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 14 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 3600]}
              ticks={[0, 900, 1800, 2700, 3600]}
              axisLine={{ stroke: '#9ca3af', strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: '#4f46e5', fontSize: 14, fontWeight: 500 }}
              dx={-5}
            />
            <Tooltip 
              formatter={(value) => [`${value} students`, 'Enrollment']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
            />
            <Bar 
              dataKey="students" 
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnrollmentTrendsChart;
