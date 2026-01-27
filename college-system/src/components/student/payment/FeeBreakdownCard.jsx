import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FeeBreakdownCard = ({ semester, fees, totalDue }) => {
  const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

  const chartData = fees.map(fee => ({
    name: fee.name,
    value: parseFloat(fee.amount.replace('$', '').replace(',', '').replace('-', ''))
  }));

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Fee Breakdown - {semester}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          {fees.map((fee, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-xs sm:text-[15px]">{fee.name}</span>
              <span className={`font-semibold text-gray-900 text-xs sm:text-[15px] ${fee.amount.startsWith('-') ? 'text-emerald-500' : ''}`}>
                {fee.amount}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-200">
            <span className="text-base sm:text-lg font-bold text-indigo-600">Total Due</span>
            <span className="text-base sm:text-lg font-bold text-indigo-600">${totalDue.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-4">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{ paddingTop: '30px', fontSize: '13px', lineHeight: '1.8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FeeBreakdownCard;
