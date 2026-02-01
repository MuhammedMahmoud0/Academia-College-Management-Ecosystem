import React, { useState } from 'react';
import EditAttendanceModal from './EditAttendanceModal';

const AttendanceGrid = ({ attendanceData, onUpdateAttendance }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    studentId: null,
    studentName: '',
    date: '',
    currentStatus: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
      case 'P':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Absent':
      case 'A':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusAbbreviation = (status) => {
    switch (status) {
      case 'Present':
        return 'P';
      case 'Absent':
        return 'A';
      default:
        return status;
    }
  };

  const handleCellClick = (studentId, studentName, date, status) => {
    setModalState({
      isOpen: true,
      studentId,
      studentName,
      date,
      currentStatus: status
    });
  };

  const handleSaveAttendance = (newStatus) => {
    onUpdateAttendance(modalState.studentId, modalState.date, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Grid</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200 sticky left-0 bg-gray-50">
                Student
              </th>
              {attendanceData.dates.map((date) => (
                <th
                  key={date}
                  className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap"
                >
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800 border-b border-gray-200 sticky left-0 bg-white">
                  {student.name}
                </td>
                {attendanceData.dates.map((date) => {
                  const status = student.attendance[date] || '-';
                  return (
                    <td
                      key={date}
                      className="px-4 py-3 text-center border-b border-gray-200"
                    >
                      <button
                        onClick={() => handleCellClick(student.id, student.name, date, status)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm border-2 transition-all hover:scale-105 ${getStatusColor(status)}`}
                      >
                        {getStatusAbbreviation(status)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
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
