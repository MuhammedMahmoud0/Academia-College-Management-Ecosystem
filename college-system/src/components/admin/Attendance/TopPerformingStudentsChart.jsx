import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopPerformingStudentsChart = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('Overall');
  const [selectedSemester, setSelectedSemester] = useState('Overall');
  const [selectedCourse, setSelectedCourse] = useState('Overall');

  const chartData = data || [
    { name: 'Sarah J.', rate: 98 },
    { name: 'David C.', rate: 95 },
    { name: 'Emily R.', rate: 94 },
    { name: 'James M.', rate: 93 },
    { name: 'Lisa K.', rate: 92 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Performing Students</h3>
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
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}%`, 'Attendance Rate']}
          />
          <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#10b981" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPerformingStudentsChart;
