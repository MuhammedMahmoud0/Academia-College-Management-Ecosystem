import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { getLowestAttendance } from '../services/doctorAttendance';

const LowestAttendanceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { lecture_id, tutorial_lab_id, courseName, courseCode } = state;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    // If no ids provided, maybe redirected here by mistake
    if (!lecture_id && !tutorial_lab_id) {
      navigate('/dashboard/doctor-attendance');
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = { limit: 1000 };
        if (lecture_id) params.lecture_id = lecture_id;
        if (tutorial_lab_id) params.tutorial_lab_id = tutorial_lab_id;

        const res = await getLowestAttendance(params);
        setStudents(res.students || []);
      } catch (error) {
        console.error("Failed to fetch lowest attendance students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [lecture_id, tutorial_lab_id, navigate]);

  // Handle derived states: filtering array and sorting it
  const processedStudents = students
    .filter(student => student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.attendance_percentage - b.attendance_percentage;
      } else {
        return b.attendance_percentage - a.attendance_percentage;
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 min-h-screen rounded-xl">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lowest Attendance</h1>
          <p className="text-gray-500 mt-1">
            {courseCode && courseName ? `${courseCode}: ${courseName}` : 'All Students'}
          </p>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4 sm:space-y-0">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort Filter */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <span>Sort by Percentage</span>
          {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : processedStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sessions Attended
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedStudents.map((student, idx) => (
                  <tr key={student.student_user_id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {student.avatar_url ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={student.avatar_url} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                              {student.full_name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {student.present_count} / {student.total_sessions}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({student.absent_count} absences)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        student.attendance_percentage < 50 
                          ? 'bg-red-100 text-red-800' 
                          : student.attendance_percentage < 75 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.attendance_percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default LowestAttendanceDetails;
