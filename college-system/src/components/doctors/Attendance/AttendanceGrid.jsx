import React, { useState, useMemo } from 'react';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import EditAttendanceModal from './EditAttendanceModal';

const AttendanceGrid = ({ attendanceData, onUpdateAttendance }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    studentId: null,
    studentName: '',
    date: '',
    currentStatus: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'p':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'absent':
      case 'a':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
    }
  };

  const getStatusAbbreviation = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'P';
      case 'absent':
        return 'A';
      default:
        return '-';
    }
  };

  const handleCellClick = (studentId, studentName, date, status) => {
    setModalState({
      isOpen: true,
      studentId,
      studentName,
      date,
      currentStatus: status === '-' ? 'Present' : status
    });
  };

  const handleSaveAttendance = (newStatus) => {
    onUpdateAttendance(modalState.studentId, modalState.date, newStatus);
  };

  // Filtering and Sorting Logic
  const processedData = useMemo(() => {
    const dates = attendanceData.dates || [];
    const students = attendanceData.students || [];

    const isDateSearch = /^\d/.test(searchTerm);
    
    // Filter dates if it looks like a date search e.g. "2025" or "10"
    const displayDates = isDateSearch 
      ? dates.filter(d => d.includes(searchTerm))
      : dates;

    // Filter students if it looks like a name search
    let displayStudents = students.filter(s => 
      isDateSearch 
        ? true 
        : s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort students by name
    displayStudents.sort((a, b) => {
      const nameA = a.full_name?.toLowerCase() || '';
      const nameB = b.full_name?.toLowerCase() || '';
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return { displayDates, displayStudents };
  }, [attendanceData, searchTerm, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-bold text-slate-900">Attendance Grid</h2>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Name or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Sort Button */}
          <button
            onClick={toggleSort}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <span>Sort</span>
            {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 flex items-center gap-2">
                Student
              </th>
              {processedData.displayDates.map((date) => (
                <th
                  key={date}
                  className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {processedData.displayStudents.length === 0 ? (
              <tr>
                <td colSpan={processedData.displayDates.length + 1} className="px-6 py-8 text-center text-gray-500 italic">
                  No records found matching your search.
                </td>
              </tr>
            ) : (
              processedData.displayStudents.map((student) => (
                <tr key={student.student_user_id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 sticky left-0 bg-white/95 backdrop-blur shadow-[1px_0_0_0_rgba(0,0,0,0.05)] border-r border-gray-100 min-w-[200px] whitespace-nowrap">
                    {student.full_name}
                  </td>
                  {processedData.displayDates.map((date) => {
                    const statusObj = student.attendance?.[date];
                    const status = statusObj?.status || '-';
                    return (
                      <td
                        key={date}
                        className="px-4 py-2 text-center"
                      >
                        <button
                          onClick={() => handleCellClick(student.student_user_id, student.full_name, date, status)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-xs border transition-all hover:shadow-md ${getStatusColor(status)} m-auto`}
                        >
                          {getStatusAbbreviation(status)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditAttendanceModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        studentName={modalState.studentName}
        date={modalState.date}
        currentStatus={modalState.currentStatus}
        onSave={handleSaveAttendance}
      />
    </div>
  );
};

export default AttendanceGrid;
