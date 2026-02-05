import { useState, useEffect, useRef } from 'react';
import DropDownMenu from './DropDownMenu';
import EditModal from './EditModal';
import ResetPasswordModal from './ResetPasswordModa';

export default function StudentManagement() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [resettingStudent, setResettingStudent] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, name: 'Student A1', studentId: 'AC-123457', major: 'Computer Science', year: 1, status: 'Active' },
    { id: 2, name: 'Student B2', studentId: 'AC-123458', major: 'Engineering', year: 2, status: 'Inactive' },
    { id: 3, name: 'Student C3', studentId: 'AC-123459', major: 'Business', year: 3, status: 'Active' },
    { id: 4, name: 'Student D4', studentId: 'AC-123460', major: 'Computer Science', year: 4, status: 'Inactive' },
    { id: 5, name: 'Student E5', studentId: 'AC-123461', major: 'Engineering', year: 1, status: 'Active' },
    { id: 6, name: 'Student F6', studentId: 'AC-123462', major: 'Business', year: 2, status: 'Inactive' },
    { id: 7, name: 'Student G7', studentId: 'AC-123463', major: 'Computer Science', year: 3, status: 'Active' },
    { id: 8, name: 'Student H8', studentId: 'AC-123464', major: 'Engineering', year: 4, status: 'Inactive' },
    { id: 9, name: 'Student I9', studentId: 'AC-123465', major: 'Business', year: 1, status: 'Active' },
    { id: 10, name: 'Student J10', studentId: 'AC-123466', major: 'Computer Science', year: 2, status: 'Inactive' },
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const getAvatarColor = (id) => {
    const colors = [
      'bg-purple-400',
      'bg-purple-500',
      'bg-indigo-400',
      'bg-violet-400',
      'bg-purple-300',
      'bg-indigo-500',
      'bg-purple-600',
      'bg-violet-500',
      'bg-indigo-600',
      'bg-purple-400',
    ];
    return colors[id - 1] || 'bg-purple-400';
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditUser = (student) => {
    setOpenMenuId(null);
    setEditingStudent(student);
  };

  const handleSaveEdit = (updatedStudent) => {
    setStudents(students.map(s => 
      s.id === updatedStudent.id ? { ...updatedStudent, major: updatedStudent.department } : s
    ));
    setEditingStudent(null);
  };

  const handleResetPassword = (student) => {
    setOpenMenuId(null);
    setResettingStudent(student);
  };

  const handleConfirmReset = (student) => {
    alert(`Password reset link sent to ${student.name}'s email.`);
    setResettingStudent(null);
  };

  const handleDeleteUser = (studentId) => {
    setOpenMenuId(null);
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-8xl ">
       
        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                          student.id
                        )} flex items-center justify-center text-white font-semibold`}
                      >
                        S{student.id}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.major}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.year}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative" ref={openMenuId === student.id ? menuRef : null}>
                      <button
                        onClick={() => toggleMenu(student.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openMenuId === student.id && (
                        <DropDownMenu
                          user={student}
                          index={index}
                          totalUsers={students.length}
                          onEdit={handleEditUser}
                          onResetPassword={handleResetPassword}
                          onDelete={handleDeleteUser}
                          profileLink="/dashboard/user-management/management-profile"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {editingStudent && (
        <EditModal
          user={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resettingStudent && (
        <ResetPasswordModal
          user={resettingStudent}
          onClose={() => setResettingStudent(null)}
          onConfirm={handleConfirmReset}
        />
      )}
    </div>
  );
}