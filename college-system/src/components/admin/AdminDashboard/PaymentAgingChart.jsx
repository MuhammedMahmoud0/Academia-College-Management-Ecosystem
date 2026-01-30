import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PaymentAgingChart = ({ data }) => {
  const getColor = (category) => {
    switch (category) {
      case '0-30 Days':
        return '#22d3ee'; // cyan-400
      case '31-60 Days':
        return '#fb923c'; // orange-400
      case '60+ Days':
        return '#ef4444'; // red-500
      default:
        return '#9ca3af'; // gray-400
    }
  };

  // Transform data for Recharts
  const chartData = data.map(item => ({
    name: item.category,
    value: item.value,
    fill: getColor(item.category)
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-8">Outstanding Payments by Aging</h2>
      
      <div className="flex items-center justify-center" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="square"
              iconSize={12}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentAgingChart;
