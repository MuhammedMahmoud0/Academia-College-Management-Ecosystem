import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DropDownMenu from './DropDownMenu';
import EditModal from './EditModal';
import ResetPasswordModal from './ResetPasswordModa';
import DeleteUserModal from './DeleteUserModal';
import ChangeStudentRoleModal from './ChangeStudentRoleModal';
import UserTableSearchBar from './UserTableSearchBar';
import UserTableFilters from './UserTableFilters';
import {
  deleteManagedUser,
  getDepartments,
  getManagedStudents,
  updateStudentLeaderRole,
  updateManagedUser,
} from '../../../services/userManagement';
import { useToast } from '../../../hooks/useToast';

export default function StudentManagement({ refreshToken = 0 }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [resettingStudent, setResettingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [isGlobalSearchMode, setIsGlobalSearchMode] = useState(false);
  const [roleChangingStudent, setRoleChangingStudent] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState('student');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const toast = useToast();

  const departmentOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Majors' },
      ...departments.map((department) => ({
        value: department,
        label: department,
      })),
    ];
  }, [departments]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const name = String(student?.full_name || student?.name || '').toLowerCase();
      const email = String(student?.email || '').toLowerCase();
      const studentId = String(student?.student_profiles?.student_id || '').toLowerCase();
      const department = String(student?.student_profiles?.departments?.name || '').toLowerCase();

      const searchMatch = !query
        || name.includes(query)
        || email.includes(query)
        || studentId.includes(query);

      const departmentMatch = selectedDepartment === 'all' || department === selectedDepartment.toLowerCase();

      return searchMatch && departmentMatch;
    });
  }, [students, searchTerm, selectedDepartment]);

  const handleFilterChange = (key, value) => {
    if (key === 'department') {
      setSelectedDepartment(value);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
  };

  const fetchStudents = useCallback(async (page = 1, limit = 10, search = '') => {
    try {
      setIsLoading(true);
      const response = await getManagedStudents({ page, limit, search });
      setStudents(response?.data || []);
      setMeta(response?.meta || { total: 0, page, limit, totalPages: 1 });
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load students. Please try again.';
      toast.error(message);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchAllStudentsForGlobalFilters = useCallback(async () => {
    try {
      setIsLoading(true);

      const firstPageResponse = await getManagedStudents({ page: 1, limit: 100 });
      const firstPageData = firstPageResponse?.data || [];
      const firstPageMeta = firstPageResponse?.meta || { totalPages: 1 };

      let allStudents = [...firstPageData];

      for (let page = 2; page <= (firstPageMeta.totalPages || 1); page += 1) {
        const response = await getManagedStudents({ page, limit: 100 });
        allStudents = allStudents.concat(response?.data || []);
      }

      setStudents(allStudents);
      setMeta({
        total: allStudents.length,
        page: 1,
        limit: allStudents.length || 1,
        totalPages: 1,
      });
      setIsGlobalSearchMode(true);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load students for global filtering.';
      toast.error(message);
      setStudents([]);
      setIsGlobalSearchMode(false);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeSearchTerm || selectedDepartment !== 'all') {
      fetchAllStudentsForGlobalFilters();
      return;
    }

    fetchStudents(1, 10, '');
    setIsGlobalSearchMode(false);
  }, [fetchStudents, fetchAllStudentsForGlobalFilters, refreshToken, activeSearchTerm, selectedDepartment]);

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
    const loadDepartments = async () => {
      try {
        const response = await getDepartments();
        const departmentsList = response?.departments || response?.data || [];
        const departmentNames = departmentsList
          .map((department) => department?.name || department?.department_name || '')
          .filter(Boolean);
        setDepartments(departmentNames);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load majors list.';
        toast.error(message);
      }
    };

    loadDepartments();
  }, [toast]);

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
    const charCode = String(id || '').charCodeAt(0) || 0;
    return colors[charCode % colors.length] || 'bg-purple-400';
  };

  const getNameInitials = (name) => {
    const parts = String(name || '').trim().split(' ').filter(Boolean);
    if (!parts.length) {
      return 'ST';
    }

    return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
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

  const getStudentProfileLink = (student) => {
    const studentId = student?.student_profiles?.student_id;
    return studentId ? `/dashboard/user-management/students/${studentId}/profile` : '/dashboard/user-management';
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditUser = (student) => {
    setOpenMenuId(null);
    setEditingStudent(student);
  };

  const handleSaveEdit = async (updatedStudent) => {
    if (!updatedStudent?.id) {
      return;
    }

    try {
      setIsSavingEdit(true);

      const originalName = String(editingStudent?.full_name || editingStudent?.name || '').trim();
      const originalEmail = String(editingStudent?.email || '').trim();
      const originalPhone = String(editingStudent?.phone || '').trim();
      const originalAddress = String(editingStudent?.address || '').trim();
      const originalNationalId = String(editingStudent?.national_id || '').trim();
      const originalDepartmentId = String(editingStudent?.student_profiles?.department_id || '');

      const nextName = String(updatedStudent?.full_name || updatedStudent?.name || '').trim();
      const nextEmail = String(updatedStudent?.email || '').trim();
      const nextPhone = String(updatedStudent?.phone || '').trim();
      const nextAddress = String(updatedStudent?.address || '').trim();
      const nextNationalId = String(updatedStudent?.national_id || '').trim();
      const nextDepartmentId = String(updatedStudent?.department_id || '');
      const nextAvatar = updatedStudent?.avatar;

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
      if (nextDepartmentId !== originalDepartmentId) {
        formData.append('department_id', nextDepartmentId);
      }
      if (nextAvatar instanceof File) {
        formData.append('avatar', nextAvatar);
      }

      if (Array.from(formData.keys()).length === 0) {
        toast.info('No changes to save.');
        return;
      }

      await updateManagedUser(updatedStudent.id, formData);
      toast.success('Student updated successfully.');
      setEditingStudent(null);
      if (isGlobalSearchMode) {
        await fetchAllStudentsForGlobalFilters();
      } else {
        await fetchStudents(meta.page, meta.limit, activeSearchTerm);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update student.';
      toast.error(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleResetPassword = (student) => {
    setOpenMenuId(null);
    setResettingStudent(student);
  };

  const handleOpenChangeRole = (student) => {
    setOpenMenuId(null);
    setRoleChangingStudent(student);
    setSelectedNewRole(student?.role === 'leader' ? 'leader' : 'student');
  };

  const handleSubmitChangeRole = async () => {
    if (!roleChangingStudent?.id) {
      return;
    }

    try {
      setIsChangingRole(true);
      await updateStudentLeaderRole(roleChangingStudent.id, selectedNewRole);
      toast.success('Student role updated successfully.');
      setRoleChangingStudent(null);
      if (isGlobalSearchMode) {
        await fetchAllStudentsForGlobalFilters();
      } else {
        await fetchStudents(meta.page, meta.limit, activeSearchTerm);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update student role.';
      toast.error(message);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleConfirmReset = async (newPassword) => {
    if (!resettingStudent?.id) {
      return false;
    }

    try {
      setIsResettingPassword(true);
      const formData = new FormData();
      formData.append('password', newPassword);
      await updateManagedUser(resettingStudent.id, formData);
      toast.success('Password updated successfully.');
      setResettingStudent(null);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update password.';
      toast.error(message);
      return false;
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteUser = (studentId) => {
    setOpenMenuId(null);
    const selectedStudent = students.find((student) => student.id === studentId);
    if (selectedStudent) {
      setDeletingStudent(selectedStudent);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent?.id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteManagedUser(deletingStudent.id);
      toast.success('Student deleted successfully.');
      setDeletingStudent(null);
      if (isGlobalSearchMode) {
        await fetchAllStudentsForGlobalFilters();
      } else {
        await fetchStudents(meta.page, meta.limit, activeSearchTerm);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete student.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevPage = () => {
    if (isGlobalSearchMode || meta.page <= 1 || isLoading) {
      return;
    }
    fetchStudents(meta.page - 1, meta.limit, activeSearchTerm);
  };

  const handleNextPage = () => {
    if (isGlobalSearchMode || meta.page >= meta.totalPages || isLoading) {
      return;
    }
    fetchStudents(meta.page + 1, meta.limit, activeSearchTerm);
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-8xl ">

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <UserTableSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, email, or student ID"
            />
            <UserTableFilters
              filters={[
                { key: 'department', value: selectedDepartment, options: departmentOptions },
              ]}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
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
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
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
              {!isLoading && filteredStudents.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={10}>
                    {students.length ? 'No students match your search or filters.' : 'No students found.'}
                  </td>
                </tr>
              )}

              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={10}>
                    Loading students...
                  </td>
                </tr>
              )}

              {!isLoading && filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                          student.id
                        )} flex items-center justify-center text-white font-semibold`}
                      >
                        {student.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={student.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          getNameInitials(student.full_name)
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                        <div className="text-xs text-gray-500">{student.student_profiles?.student_id || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.national_id || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.address || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                      {student.role || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.student_profiles?.departments?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.student_profiles?.year_level || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatCreatedAt(student.created_at)}</td>
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
                          totalUsers={filteredStudents.length}
                          onEdit={handleEditUser}
                          onResetPassword={handleResetPassword}
                          onChangeRole={handleOpenChangeRole}
                          onDelete={handleDeleteUser}
                          profileLink={getStudentProfileLink(student)}
                          profileState={{
                            userRole: student?.role || 'student',
                            userName: student?.full_name || student?.name || '',
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
              {isGlobalSearchMode
                ? `Global filtered results: ${filteredStudents.length} students`
                : `Page ${meta.page} of ${meta.totalPages} | Total ${meta.total} students`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={isGlobalSearchMode || meta.page <= 1 || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={isGlobalSearchMode || meta.page >= meta.totalPages || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingStudent && (
        <EditModal
          user={editingStudent}
          isSaving={isSavingEdit}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resettingStudent && (
        <ResetPasswordModal
          user={resettingStudent}
          isSubmitting={isResettingPassword}
          onClose={() => setResettingStudent(null)}
          onConfirm={handleConfirmReset}
        />
      )}

      <DeleteUserModal
        isOpen={Boolean(deletingStudent)}
        user={deletingStudent}
        isDeleting={isDeleting}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
      />

      <ChangeStudentRoleModal
        user={roleChangingStudent}
        role={selectedNewRole}
        onRoleChange={setSelectedNewRole}
        onClose={() => setRoleChangingStudent(null)}
        onSubmit={handleSubmitChangeRole}
        loading={isChangingRole}
      />
    </div>
  );
}
