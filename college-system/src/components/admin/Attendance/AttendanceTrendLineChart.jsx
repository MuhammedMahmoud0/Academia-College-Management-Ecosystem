import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAttendanceTrend } from '../../../services/adminAttendanceDashboard';
import { getAllDepartments } from '../../../services/departments';
import { getAllCourses } from '../../../services/courseService';
import SearchableSelect from '../../common/SearchableSelect';

const AttendanceTrendLineChart = ({ departments, courses, loadingOptions }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedDepartment) params.department_id = selectedDepartment;
        if (selectedSemester) params.semester = selectedSemester;
        if (selectedCourse) params.course_code = selectedCourse;

        const data = await getAttendanceTrend(params);
        
        if (data && data.trend) {
           const formatted = data.trend.map(item => ({
             month: item.month_label || item.month,
             rate: item.attendance_rate
           }));
           setChartData(formatted);
        } else {
           setChartData([]);
        }
      } catch (err) {
        console.error('Error fetching trend data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [selectedDepartment, selectedSemester, selectedCourse]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Trend Over Time {loading && <span className="text-sm font-normal text-gray-400">(Loading...)</span>}</h3>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Dept:</label>
          <SearchableSelect 
            options={departments}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            placeholder="Select Department"
            loading={loadingOptions}
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="">Overall</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-600 font-medium">Course:</label>
          <SearchableSelect 
            options={courses}
            value={selectedCourse}
            onChange={setSelectedCourse}
            placeholder="Select Course"
            loading={loadingOptions}
          />
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
            domain={['auto', 'auto']}
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
