import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader } from 'lucide-react';

const COLORS = {
  '0-30 Days': '#22d3ee',
  '31-60 Days': '#fb923c',
  '60+ Days': '#ef4444',
};

const PaymentAgingChart = ({ data, totalOverdue, loading }) => {
  // data shape from API: [{ label, student_count }]
  const chartData = (data || []).map(item => ({
    name: item.label,
    value: item.student_count,
    fill: COLORS[item.label] || '#9ca3af',
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Outstanding Payments by Aging</h2>
          {totalOverdue != null && (
            <p className="text-sm text-red-500 mt-1 font-medium">
              {totalOverdue} total overdue student{totalOverdue !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: '280px' }}>
          <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height: '280px' }}>
          No payment aging data available.
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ height: '280px', minWidth: 0 }}>
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
                formatter={(value, name) => [`${value} student${value !== 1 ? 's' : ''}`, name]}
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
      )}
    </div>
  );
};

export default PaymentAgingChart;
