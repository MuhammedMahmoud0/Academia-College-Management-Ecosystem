import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


export default function DoctorsManagement() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  // Sample doctor data
  const doctors = [
    { id: 1, name: 'Dr. Evelyn Reed', doctorId: 'ST-001', department: 'Computer Science', courses: 2, status: 'Active', initials: 'ER', color: 'bg-purple-400' },
    { id: 2, name: 'Dr. Samuel Chen', doctorId: 'ST-002', department: 'Computer Science', courses: 1, status: 'Active', initials: 'SC', color: 'bg-blue-400' },
    { id: 3, name: 'Dr. Olivia Garcia', doctorId: 'ST-003', department: 'Engineering', courses: 2, status: 'On Leave', initials: 'OG', color: 'bg-orange-400' },
  ];

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
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

                    {/* Dropdown Menu */}
                    {openMenuId === doctor.id && (
                      <div className={`absolute right-0 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200 ${
                        index >= doctors.length - 2 ? 'bottom-full mb-2' : 'mt-2'
                      }`}>
                        <div className="py-1">
                        <Link to="/dashboard/user-management/management-profile"> <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Full Profile
                          </button></Link> 
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit User
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Password
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete User
                          </button>
                        </div>
                      </div>
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
    </div>
  );
}