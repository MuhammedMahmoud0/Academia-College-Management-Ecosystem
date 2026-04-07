import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const EnrollmentTrendsChart = ({ data, fromYear, toYear, onFromYearChange, onToYearChange, loading }) => {
  // data shape from API: [{ year, student_count }]
  const chartData = (data || []).map(item => ({
    year: String(item.year),
    students: item.student_count,
  }));

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.students), 10) : 100;
  const tickMax = Math.ceil(maxVal / 100) * 100 + 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Enrollment Trends</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <label className="text-xs text-gray-500">From</label>
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => onFromYearChange(fromYear - 1)}
                className="px-1.5 py-1 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-gray-500" />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[40px] text-center">{fromYear}</span>
              <button
                onClick={() => onFromYearChange(Math.min(fromYear + 1, toYear - 1))}
                className="px-1.5 py-1 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <label className="text-xs text-gray-500">To</label>
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => onToYearChange(Math.max(toYear - 1, fromYear + 1))}
                className="px-1.5 py-1 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-gray-500" />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[40px] text-center">{toYear}</span>
              <button
                onClick={() => onToYearChange(toYear + 1)}
                className="px-1.5 py-1 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height: '300px' }}>
          No enrollment data available.
        </div>
      ) : (
        <div style={{ width: '100%', height: '280px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
                tick={{ fill: '#6b7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis
                domain={[0, tickMax]}
                axisLine={{ stroke: '#9ca3af', strokeWidth: 2 }}
                tickLine={false}
                tick={{ fill: '#4f46e5', fontSize: 13, fontWeight: 500 }}
                dx={-5}
              />
              <Tooltip
                formatter={(value) => [`${value} students`, 'Enrolled']}
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
      )}
    </div>
  );
};

export default EnrollmentTrendsChart;
