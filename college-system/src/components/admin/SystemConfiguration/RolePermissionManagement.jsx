import React, { useState } from 'react';
import AddRoleModal from './AddRoleModal';

const RolePermissionManagement = () => {
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Admin',
      permissions: {
        manageUsers: true,
        editGrades: true,
        viewFinancials: true
      }
    },
    {
      id: 2,
      name: 'Doctor',
      permissions: {
        manageUsers: false,
        editGrades: true,
        viewFinancials: false
      }
    },
    {
      id: 3,
      name: 'Student',
      permissions: {
        manageUsers: false,
        editGrades: false,
        viewFinancials: false
      }
    }
  ]);

  const handleTogglePermission = (roleId, permission) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permission]: !role.permissions[permission]
          }
        };
      }
      return role;
    }));
  };

  const handleSavePermissions = () => {
    console.log('Saving permissions:', roles);
    // Add API call here to save permissions
    alert('Permissions saved successfully!');
  };

  const handleAddRole = (newRole) => {
    const role = {
      id: Date.now(),
      name: newRole.name,
      permissions: {
        manageUsers: newRole.permissions.manageUsers || false,
        editGrades: newRole.permissions.editGrades || false,
        viewFinancials: newRole.permissions.viewFinancials || false
      }
    };
    setRoles(prev => [...prev, role]);
    setIsAddRoleModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Role & Permission Management</h2>
          <p className="text-sm text-gray-500 mt-1">Control what different user roles can see and do.</p>
        </div>
        <button
          onClick={() => setIsAddRoleModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Role</span>
        </button>
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Role</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Manage Users</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">Edit Grades</th>
              <th className="text-left py-4 px-4 text-gray-700 font-semibold">View Financials</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <span className="text-indigo-600 font-medium">{role.name}</span>
                </td>
                <td className="py-4 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.permissions.manageUsers}
                      onChange={() => handleTogglePermission(role.id, 'manageUsers')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
                <td className="py-4 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.permissions.editGrades}
                      onChange={() => handleTogglePermission(role.id, 'editGrades')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
                <td className="py-4 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.permissions.viewFinancials}
                      onChange={() => handleTogglePermission(role.id, 'viewFinancials')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSavePermissions}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          Save Permissions
        </button>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
};

export default RolePermissionManagement;
