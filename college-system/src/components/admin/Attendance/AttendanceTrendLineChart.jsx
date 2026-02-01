import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AttendanceTrendLineChart = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('Overall');
  const [selectedSemester, setSelectedSemester] = useState('Overall');
  const [selectedCourse, setSelectedCourse] = useState('Overall');

  const chartData = data || [
    { month: 'Jan', rate: 88 },
    { month: 'Feb', rate: 90 },
    { month: 'Mar', rate: 92 },
    { month: 'Apr', rate: 89 },
    { month: 'May', rate: 93 },
    { month: 'Jun', rate: 91 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Trend Over Time</h3>
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
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[80, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}%`, 'Attendance Rate']}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendLineChart;
