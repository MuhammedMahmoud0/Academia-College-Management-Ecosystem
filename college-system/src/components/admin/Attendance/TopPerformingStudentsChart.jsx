import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTopPerformingStudents } from '../../../services/adminAttendanceDashboard';
import { getAllDepartments } from '../../../services/departments';
import { getAllCourses } from '../../../services/courseService';
import SearchableSelect from '../../common/SearchableSelect';

const TopPerformingStudentsChart = ({ departments, courses, loadingOptions }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchTopStudents = async () => {
      setLoading(true);
      try {
        const params = { limit: 5 };
        if (selectedDepartment) params.department_id = selectedDepartment;
        if (selectedSemester) params.semester = selectedSemester;
        if (selectedCourse) params.course_code = selectedCourse;

        const data = await getTopPerformingStudents(params);
        
        if (data && data.students) {
           const formatted = data.students.map(item => ({
             name: item.full_name,
             rate: item.attendance_percentage
           }));
           setChartData(formatted);
        } else {
           setChartData([]);
        }
      } catch (err) {
        console.error('Error fetching top performing students data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, [selectedDepartment, selectedSemester, selectedCourse]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Performing Students {loading && <span className="text-sm font-normal text-gray-400">(Loading...)</span>}</h3>
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
