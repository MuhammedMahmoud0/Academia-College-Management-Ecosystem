import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getStudentsAttendance } from '../../../services/adminAttendanceDashboard';
import { getAllDepartments } from '../../../services/departments';
import { getAllCourses } from '../../../services/courseService';
import SearchableSelect from '../../common/SearchableSelect';

const StudentsAttendanceTable = ({ departments, courses, loadingOptions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);



  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedDepartment) params.department_id = selectedDepartment;
        if (selectedCourse) params.course_code = selectedCourse;
        if (debouncedSearch) params.search = debouncedSearch;

        const data = await getStudentsAttendance(params);
        

        let studentsArray = null;
        if (data && Array.isArray(data.students)) {
           studentsArray = data.students;
        } else if (data && data.data && Array.isArray(data.data.students)) {
           studentsArray = data.data.students;
        } else if (Array.isArray(data)) {
           studentsArray = data;
        }

        if (studentsArray) {
           const formatted = studentsArray.map(item => ({
             id: item.student_user_id || item.id || Math.random().toString(),
             name: item.full_name || item.name || 'Unknown',
             major: item.department_name || item.major || 'None',
             attendance: item.avg_attendance !== undefined ? item.avg_attendance : (item.attendance || 0)
           }));
           setStudentsData(formatted);
        } else {
           console.warn("Could not find students array in response:", data);
           setStudentsData([]);
        }
      } catch (err) {
        console.error('Error fetching students attendance data:', err);
        setStudentsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedDepartment, selectedCourse, debouncedSearch]);

  const getAttendanceColor = (rate) => {
    const numRate = parseInt(rate);
    if (numRate >= 90) return 'text-emerald-600';
    if (numRate >= 80) return 'text-yellow-600';
    if (numRate >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleExportReport = () => {
    if (!studentsData || studentsData.length === 0) return;

    // Prepare data for Excel
    const excelData = studentsData.map(student => ({
      'Student Name': student.name,
      'Department': student.major,
      'Avg. Attendance (%)': student.attendance
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // Adjust column widths purely for better readability
    const colWidths = [{ wpx: 200 }, { wpx: 150 }, { wpx: 120 }];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students_Attendance');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Students_Attendance_Report.xlsx');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[300px] relative">
      {/* Search and Filters Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 min-w-[250px] max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for a student by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filters and Export */}
          <div className="flex flex-wrap gap-3 items-center">
            <SearchableSelect 
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="All Departments"
              loading={loadingOptions}
            />

            <SearchableSelect 
              options={courses}
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="All Courses"
              loading={loadingOptions}
            />

            <button
              onClick={handleExportReport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
           <span className="text-indigo-600 text-sm font-semibold">Loading students...</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Avg. Attendance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {studentsData.length > 0 ? (
              studentsData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{student.major || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No students match the criteria
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsAttendanceTable;
