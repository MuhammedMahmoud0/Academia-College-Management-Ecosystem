import { useState } from 'react';
import { updatePassword } from '../../services/settings';
import Toast from '../Toast/Toast';

export default function SecuritySetting() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = async () => {
    setToast(null);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setToast({ message: 'All fields are required.', type: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword
      });
      setToast({ message: 'Password updated successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Updating password failed:', err);
      setToast({ 
        message: err.response?.data?.error || err.response?.data?.message || 'Failed to update password.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Change Password Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="mb-6">
       <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Change Password</h1>
          <p className="text-sm md:text-base text-gray-500">Update your password for enhanced security.</p>
        </div>

        <div className="space-y-4 md:space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Update Password Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className={`text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg transition-colors font-medium w-full sm:w-auto ${
                 loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}