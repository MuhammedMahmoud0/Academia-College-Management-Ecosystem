import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DropDownMenu from './DropDownMenu';
import EditModal from './EditModal';
import ResetPasswordModal from './ResetPasswordModa';
import DeleteUserModal from './DeleteUserModal';
import UserTableSearchBar from './UserTableSearchBar';
import { deleteManagedUser, updateManagedUser } from '../../../services/userManagement';
import { getManagedAdmins } from '../../../services/userManagementProfiles';
import { useToast } from '../../../hooks/useToast';

export default function AdminManagement({ refreshToken = 0 }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [resettingAdmin, setResettingAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getManagedAdmins();
      setAdmins(Array.isArray(response?.admins) ? response.admins : []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load admins.';
      toast.error(message);
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins, refreshToken]);

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

  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return admins.filter((admin) => {
      const name = String(admin?.full_name || admin?.name || '').toLowerCase();
      const email = String(admin?.email || '').toLowerCase();

      return !query || name.includes(query) || email.includes(query);
    });
  }, [admins, searchTerm]);

  const getAvatarColor = (id) => {
    const colors = [
      'bg-amber-500',
      'bg-orange-500',
      'bg-rose-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-emerald-500',
    ];

    const charCode = String(id || '').charCodeAt(0) || 0;
    return colors[charCode % colors.length] || 'bg-amber-500';
  };

  const getNameInitials = (name) => {
    const parts = String(name || '').trim().split(' ').filter(Boolean);
    if (!parts.length) {
      return 'AD';
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

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditUser = (admin) => {
    setOpenMenuId(null);
    setEditingAdmin({ ...admin, role: 'admin' });
  };

  const handleSaveEdit = async (updatedAdmin) => {
    if (!updatedAdmin?.id) {
      return;
    }

    try {
      setIsSavingEdit(true);

      const originalName = String(editingAdmin?.full_name || editingAdmin?.name || '').trim();
      const originalEmail = String(editingAdmin?.email || '').trim();
      const originalPhone = String(editingAdmin?.phone || '').trim();
      const originalAddress = String(editingAdmin?.address || '').trim();
      const originalNationalId = String(editingAdmin?.national_id || '').trim();
      const nextName = String(updatedAdmin?.full_name || updatedAdmin?.name || '').trim();
      const nextEmail = String(updatedAdmin?.email || '').trim();
      const nextPhone = String(updatedAdmin?.phone || '').trim();
      const nextAddress = String(updatedAdmin?.address || '').trim();
      const nextNationalId = String(updatedAdmin?.national_id || '').trim();
      const nextAvatar = updatedAdmin?.avatar;

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
      if (nextAvatar instanceof File) {
        formData.append('avatar', nextAvatar);
      }

      if (Array.from(formData.keys()).length === 0) {
        toast.info('No changes to save.');
        return;
      }

      await updateManagedUser(updatedAdmin.id, formData);
      toast.success('Admin updated successfully.');
      setEditingAdmin(null);
      await fetchAdmins();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update admin.';
      toast.error(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleResetPassword = (admin) => {
    setOpenMenuId(null);
    setResettingAdmin(admin);
  };

  const handleConfirmReset = async (newPassword) => {
    if (!resettingAdmin?.id) {
      return false;
    }

    try {
      setIsResettingPassword(true);
      const formData = new FormData();
      formData.append('password', newPassword);
      await updateManagedUser(resettingAdmin.id, formData);
      toast.success('Password updated successfully.');
      setResettingAdmin(null);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update password.';
      toast.error(message);
      return false;
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteUser = (adminId) => {
    setOpenMenuId(null);
    const selectedAdmin = admins.find((admin) => admin.id === adminId);
    if (selectedAdmin) {
      setDeletingAdmin(selectedAdmin);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAdmin?.id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteManagedUser(deletingAdmin.id);
      toast.success('Admin deleted successfully.');
      setDeletingAdmin(null);
      await fetchAdmins();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete admin.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-8xl">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <UserTableSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by admin name or email"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {!isLoading && filteredAdmins.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={5}>
                      {admins.length ? 'No admins match your search.' : 'No admins found.'}
                    </td>
                  </tr>
                )}

                {isLoading && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={5}>
                      Loading admins...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredAdmins.map((admin, index) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(admin.id)} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {admin.avatar_url ? (
                            <img
                              src={admin.avatar_url}
                              alt={admin.full_name || admin.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            getNameInitials(admin.full_name || admin.name)
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{admin.full_name || admin.name}</div>
                          <div className="text-xs text-gray-500">{admin.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{admin.email || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 capitalize">
                        admin
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatCreatedAt(admin.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="relative" ref={openMenuId === admin.id ? menuRef : null}>
                        <button
                          onClick={() => toggleMenu(admin.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openMenuId === admin.id && (
                          <DropDownMenu
                            user={admin}
                            index={index}
                            totalUsers={filteredAdmins.length}
                            onEdit={handleEditUser}
                            onResetPassword={handleResetPassword}
                            onDelete={handleDeleteUser}
                            showProfileLink={false}
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
              Total {filteredAdmins.length} admins
            </p>
          </div>
        </div>
      </div>

      {editingAdmin && (
        <EditModal
          user={editingAdmin}
          isSaving={isSavingEdit}
          mode="admin"
          onClose={() => setEditingAdmin(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resettingAdmin && (
        <ResetPasswordModal
          user={resettingAdmin}
          isSubmitting={isResettingPassword}
          onClose={() => setResettingAdmin(null)}
          onConfirm={handleConfirmReset}
        />
      )}

      <DeleteUserModal
        isOpen={Boolean(deletingAdmin)}
        user={deletingAdmin}
        isDeleting={isDeleting}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
