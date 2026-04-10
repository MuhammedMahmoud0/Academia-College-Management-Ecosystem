import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAttendanceDistribution } from '../../../services/adminAttendanceDashboard';
import { getAllDepartments } from '../../../services/departments';
import { getAllCourses } from '../../../services/courseService';
import SearchableSelect from '../../common/SearchableSelect';

const AttendanceDistributionChart = ({ departments, courses, loadingOptions }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchDistribution = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedDepartment) params.department_id = selectedDepartment;
        if (selectedSemester) params.semester = selectedSemester;
        if (selectedCourse) params.course_code = selectedCourse;

        const data = await getAttendanceDistribution(params);
        
        if (data && data.distribution) {
           const colorMap = {
             'Excellent': '#10b981',
             'Good': '#f59e0b',
             'Fair': '#f97316',
             'Poor': '#ef4444'
           };
           
           const formatted = data.distribution.map(item => ({
             name: `${item.label} (${item.range})`,
             value: item.count > 0 ? item.count : (item.percentage || 0), // Use percentage visually if count is 0 for placeholder cases
             actualCount: item.count,
             color: colorMap[item.label] || '#8884d8'
           }));
           setChartData(formatted);
        } else {
           setChartData([]);
        }
      } catch (err) {
        console.error('Error fetching distribution data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, [selectedDepartment, selectedSemester, selectedCourse]);

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Distribution {loading && <span className="text-sm font-normal text-gray-400">(Loading...)</span>}</h3>
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
        <PieChart>
          <Pie
            data={chartData.length > 0 ? chartData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={chartData.length > 0 ? ({ name, percent }) => `${(percent * 100).toFixed(0)}%` : null}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {(chartData.length > 0 ? chartData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [props.payload.actualCount !== undefined ? `${props.payload.actualCount} students` : `${value} students`, 'Count']} />
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
