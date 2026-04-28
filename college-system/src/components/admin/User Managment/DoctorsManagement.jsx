import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DropDownMenu from './DropDownMenu';
import EditModal from './EditModal';
import ResetPasswordModal from './ResetPasswordModa';
import DeleteUserModal from './DeleteUserModal';
import UserTableSearchBar from './UserTableSearchBar';
import UserTableFilters from './UserTableFilters';
import {
  deleteManagedUser,
  getManagedDoctors,
  updateManagedUser,
} from '../../../services/userManagement';
import { useToast } from '../../../hooks/useToast';

export default function DoctorsManagement({ refreshToken = 0 }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [resettingDoctor, setResettingDoctor] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const toast = useToast();

  const fetchDoctors = useCallback(async (page = 1, limit = 10, search = '', role = 'all') => {
    try {
      setIsLoading(true);
      const response = await getManagedDoctors({ page, limit, search, role });
      setDoctors(response?.data || []);
      setMeta(response?.meta || { total: 0, page, limit, totalPages: 1 });
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load doctors/faculty.';
      toast.error(message);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDoctors(1, 10, activeSearchTerm, selectedRole);
  }, [fetchDoctors, activeSearchTerm, selectedRole, refreshToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedQuery = searchTerm.trim();
      if (normalizedQuery === activeSearchTerm) {
        return;
      }
      setActiveSearchTerm(normalizedQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, activeSearchTerm]);

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

  const getAvatarColor = (id) => {
    const colors = [
      'bg-indigo-500',
      'bg-sky-500',
      'bg-emerald-500',
      'bg-rose-500',
      'bg-violet-500',
      'bg-cyan-500',
      'bg-amber-500',
      'bg-teal-500',
    ];

    const charCode = String(id || '').charCodeAt(0) || 0;
    return colors[charCode % colors.length] || 'bg-indigo-500';
  };

  const getNameInitials = (name) => {
    const parts = String(name || '').trim().split(' ').filter(Boolean);
    if (!parts.length) {
      return 'DR';
    }

    return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  };

  const getDepartment = (user) => {
    return (
      user?.doctor_profiles?.departments?.name
      || user?.faculty_profiles?.departments?.name
      || user?.department
      || '-'
    );
  };

  const getCoursesCount = (user) => {
    return (
      user?.doctor_profiles?.courses_count
      ?? user?.faculty_profiles?.courses_count
      ?? user?.courses_count
      ?? user?.courses
      ?? '-'
    );
  };

  const getUserCode = (user) => {
    const roleMap = {
      doctor: 'Doctor',
      teaching_assistant: 'Teaching Assistant',
    };

    return (
      roleMap[user?.role]
      || (user?.role ? user.role.replace('_', ' ') : '')
      ||
      user?.doctor_profiles?.doctor_id
      || user?.faculty_profiles?.faculty_id
      || user?.national_id
      || '-'
    );
  };

  const normalizeCellValue = (value) => {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'object') {
      return value.email || value.text || value.value || '-';
    }

    const normalized = String(value).trim();
    if (!normalized || normalized === '[object Object]') {
      return '-';
    }

    return normalized;
  };

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
      return '-';
    }

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('en-GB');
  };

  const getStaffProfileLink = (doctor) => {
    return doctor?.id ? `/dashboard/user-management/staff/${doctor.id}/profile` : '/dashboard/user-management';
  };

  const roleOptions = useMemo(() => {
    const uniqueRoles = Array.from(new Set(doctors.map((doctor) => doctor.role).filter(Boolean)));
    return [
      { value: 'all', label: 'All Roles' },
      ...uniqueRoles.map((role) => ({
        value: role,
        label: role.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      })),
    ];
  }, [doctors]);

  const departmentOptions = useMemo(() => {
    const uniqueDepartments = Array.from(
      new Set(doctors.map((doctor) => getDepartment(doctor)).filter((department) => department && department !== '-'))
    );

    return [
      { value: 'all', label: 'All Departments' },
      ...uniqueDepartments.map((department) => ({
        value: department,
        label: department,
      })),
    ];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const name = String(doctor?.full_name || doctor?.name || '').toLowerCase();
      const email = normalizeCellValue(doctor?.email).toLowerCase();
      const code = String(getUserCode(doctor) || '').toLowerCase();
      const department = String(getDepartment(doctor) || '').toLowerCase();
      const searchMatch = !query || name.includes(query) || email.includes(query) || code.includes(query);
      const departmentMatch = selectedDepartment === 'all' || department === selectedDepartment.toLowerCase();

      return searchMatch && departmentMatch;
    });
  }, [doctors, searchTerm, selectedDepartment]);

  const handleFilterChange = (key, value) => {
    if (key === 'role') {
      setSelectedRole(value);
      return;
    }

    if (key === 'department') {
      setSelectedDepartment(value);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedDepartment('all');
  };

  const handleEditUser = (doctor) => {
    setOpenMenuId(null);
    setEditingDoctor(doctor);
  };

  const handleSaveEdit = async (updatedDoctor) => {
    if (!updatedDoctor?.id) {
      return;
    }

    try {
      setIsSavingEdit(true);

      const originalName = String(editingDoctor?.full_name || editingDoctor?.name || '').trim();
      const originalEmail = String(editingDoctor?.email || '').trim();
      const originalPhone = String(editingDoctor?.phone || '').trim();
      const originalAddress = String(editingDoctor?.address || '').trim();
      const originalNationalId = String(editingDoctor?.national_id || '').trim();
      const originalRole = String(editingDoctor?.role || '').trim();
      const originalDepartmentId = String(editingDoctor?.student_profiles?.department_id || '');

      const nextName = String(updatedDoctor?.full_name || updatedDoctor?.name || '').trim();
      const nextEmail = String(updatedDoctor?.email || '').trim();
      const nextPhone = String(updatedDoctor?.phone || '').trim();
      const nextAddress = String(updatedDoctor?.address || '').trim();
      const nextNationalId = String(updatedDoctor?.national_id || '').trim();
      const nextRole = String(updatedDoctor?.role || '').trim();
      const nextDepartmentId = String(updatedDoctor?.department_id || '');
      const nextAvatar = updatedDoctor?.avatar;

      const formData = new FormData();
      if (nextName !== originalName) {
        formData.append('name', nextName);
      }
      if (nextEmail !== originalEmail) {
        formData.append('email', nextEmail);
      }
      if (nextPhone !== originalPhone) {
        formData.append('phone', nextPhone);
      }
      if (nextAddress !== originalAddress) {
        formData.append('address', nextAddress);
      }
      if (nextNationalId !== originalNationalId) {
        formData.append('national_id', nextNationalId);
      }
      if (nextRole && nextRole !== originalRole) {
        formData.append('role', nextRole);
      }

      if ((editingDoctor?.role === 'student' || editingDoctor?.role === 'leader') && nextDepartmentId !== originalDepartmentId) {
        formData.append('department_id', nextDepartmentId);
      }

      if (nextAvatar instanceof File) {
        formData.append('avatar', nextAvatar);
      }

      if (Array.from(formData.keys()).length === 0) {
        if (nextDepartmentId !== originalDepartmentId) {
          toast.info('Department update applies to student/leader accounts only.');
        } else {
          toast.info('No changes to save.');
        }
        return;
      }

      await updateManagedUser(updatedDoctor.id, formData);
      toast.success('Doctor/Faculty user updated successfully.');
      setEditingDoctor(null);
      await fetchDoctors(meta.page, meta.limit, activeSearchTerm, selectedRole);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update doctor/faculty user.';
      toast.error(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleResetPassword = (doctor) => {
    setOpenMenuId(null);
    setResettingDoctor(doctor);
  };

  const handleConfirmReset = async (newPassword) => {
    if (!resettingDoctor?.id) {
      return false;
    }

    try {
      setIsResettingPassword(true);
      const formData = new FormData();
      formData.append('password', newPassword);
      await updateManagedUser(resettingDoctor.id, formData);
      toast.success('Password updated successfully.');
      setResettingDoctor(null);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update password.';
      toast.error(message);
      return false;
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteUser = (doctorId) => {
    setOpenMenuId(null);
    const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
    if (selectedDoctor) {
      setDeletingDoctor(selectedDoctor);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDoctor?.id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteManagedUser(deletingDoctor.id);
      toast.success('Doctor/Faculty user deleted successfully.');
      setDeletingDoctor(null);
      await fetchDoctors(meta.page, meta.limit, activeSearchTerm, selectedRole);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete doctor/faculty user.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevPage = () => {
    if (meta.page <= 1 || isLoading) {
      return;
    }
    fetchDoctors(meta.page - 1, meta.limit, activeSearchTerm, selectedRole);
  };

  const handleNextPage = () => {
    if (meta.page >= meta.totalPages || isLoading) {
      return;
    }
    fetchDoctors(meta.page + 1, meta.limit, activeSearchTerm, selectedRole);
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-8xl ">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <UserTableSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, email, or role code"
            />
            <UserTableFilters
              filters={[
                { key: 'role', value: selectedRole, options: roleOptions },
                { key: 'department', value: selectedDepartment, options: departmentOptions },
              ]}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full h-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor/Faculty Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    National ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!isLoading && filteredDoctors.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={9}>
                      {doctors.length ? 'No doctors/faculty users match your search or filters.' : 'No doctors/faculty users found.'}
                    </td>
                  </tr>
                )}

                {isLoading && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={9}>
                      Loading doctors/faculty users...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredDoctors.map((doctor, index) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            doctor.id
                          )} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {doctor.avatar_url ? (
                            <img
                              src={doctor.avatar_url}
                              alt={doctor.full_name || doctor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            getNameInitials(doctor.full_name || doctor.name)
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.full_name || doctor.name}
                          </div>
                          <div className="text-xs text-gray-500">{getUserCode(doctor)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{normalizeCellValue(doctor.email)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{normalizeCellValue(doctor.phone)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{normalizeCellValue(doctor.national_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{normalizeCellValue(doctor.address)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getDepartment(doctor)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getCoursesCount(doctor)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatCreatedAt(doctor.created_at)}</td>
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
                            totalUsers={filteredDoctors.length}
                            onEdit={handleEditUser}
                            onResetPassword={handleResetPassword}
                            onDelete={handleDeleteUser}
                            profileLink={getStaffProfileLink(doctor)}
                            profileState={{
                              userRole: doctor?.role || '',
                              userName: doctor?.full_name || doctor?.name || '',
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Page {meta.page} of {meta.totalPages} | Total {meta.total} doctors/faculty
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={meta.page <= 1 || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={meta.page >= meta.totalPages || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingDoctor && (
        <EditModal
          user={editingDoctor}
          isSaving={isSavingEdit}
          onClose={() => setEditingDoctor(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resettingDoctor && (
        <ResetPasswordModal
          user={resettingDoctor}
          isSubmitting={isResettingPassword}
          onClose={() => setResettingDoctor(null)}
          onConfirm={handleConfirmReset}
        />
      )}

      <DeleteUserModal
        isOpen={Boolean(deletingDoctor)}
        user={deletingDoctor}
        isDeleting={isDeleting}
        onClose={() => setDeletingDoctor(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
