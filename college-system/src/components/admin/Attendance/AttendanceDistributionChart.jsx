import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AttendanceDistributionChart = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('Overall');
  const [selectedSemester, setSelectedSemester] = useState('Overall');
  const [selectedCourse, setSelectedCourse] = useState('Overall');

  const chartData = data || [
    { name: 'Excellent (90-100%)', value: 45, color: '#10b981' },
    { name: 'Good (80-89%)', value: 30, color: '#f59e0b' },
    { name: 'Fair (70-79%)', value: 15, color: '#f97316' },
    { name: 'Poor (Below 70%)', value: 10, color: '#ef4444' }
  ];

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Distribution</h3>
      <div className="flex gap-3 items-center mb-4">
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Dept:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Overall">Overall</option>
            <option value="Computer Science">CS</option>
            <option value="Mechanical Engineering">ME</option>
            <option value="Electrical Engineering">EE</option>
            <option value="Civil Engineering">CE</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Overall">Overall</option>
            <option value="Fall 2025">Fall 2025</option>
            <option value="Spring 2026">Spring 2026</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Overall">Overall</option>
            <option value="CS421">CS421</option>
            <option value="CS301">CS301</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span className="text-sm text-gray-700">{entry.payload.name}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceDistributionChart;
