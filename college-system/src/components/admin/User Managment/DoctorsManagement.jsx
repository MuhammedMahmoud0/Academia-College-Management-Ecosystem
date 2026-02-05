import { useState, useEffect, useRef } from 'react';
import DropDownMenu from './DropDownMenu';
import EditModal from './EditModal';
import ResetPasswordModal from './ResetPasswordModa';

export default function DoctorsManagement() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [resettingDoctor, setResettingDoctor] = useState(null);
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Evelyn Reed', doctorId: 'ST-001', department: 'Computer Science', courses: 2, status: 'Active', initials: 'ER', color: 'bg-purple-400' },
    { id: 2, name: 'Dr. Samuel Chen', doctorId: 'ST-002', department: 'Computer Science', courses: 1, status: 'Active', initials: 'SC', color: 'bg-blue-400' },
    { id: 3, name: 'Dr. Olivia Garcia', doctorId: 'ST-003', department: 'Engineering', courses: 2, status: 'On Leave', initials: 'OG', color: 'bg-orange-400' },
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

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditUser = (doctor) => {
    setOpenMenuId(null);
    setEditingDoctor(doctor);
  };

  const handleSaveEdit = (updatedDoctor) => {
    setDoctors(doctors.map(d => 
      d.id === updatedDoctor.id ? updatedDoctor : d
    ));
    setEditingDoctor(null);
  };

  const handleResetPassword = (doctor) => {
    setOpenMenuId(null);
    setResettingDoctor(doctor);
  };

  const handleConfirmReset = (doctor) => {
    alert(`Password reset link sent to ${doctor.name}'s email.`);
    setResettingDoctor(null);
  };

  const handleDeleteUser = (doctorId) => {
    setOpenMenuId(null);
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      setDoctors(doctors.filter(d => d.id !== doctorId));
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-8xl ">
       

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
          <table className="w-full h-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
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
              {doctors.map((doctor, index) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${doctor.color} flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {doctor.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.doctorId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doctor.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doctor.courses}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        doctor.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative" ref={openMenuId === doctor.id ? menuRef : null}>
                      <button
                        onClick={() => toggleMenu(doctor.id)}
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

                      {openMenuId === doctor.id && (
                        <DropDownMenu
                          user={doctor}
                          index={index}
                          totalUsers={doctors.length}
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

      {editingDoctor && (
        <EditModal
          user={editingDoctor}
          onClose={() => setEditingDoctor(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resettingDoctor && (
        <ResetPasswordModal
          user={resettingDoctor}
          onClose={() => setResettingDoctor(null)}
          onConfirm={handleConfirmReset}
        />
      )}
    </div>
  );
}