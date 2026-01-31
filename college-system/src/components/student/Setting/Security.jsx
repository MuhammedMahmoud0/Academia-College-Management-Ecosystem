import { useState } from 'react';

export default function SecuritySetting() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loginHistory] = useState([
    {
      device: 'Chrome on Windows',
      status: 'Active',
      location: 'Alexandria, EG',
      time: '10 minutes ago'
    },
    {
      device: 'Safari on iPhone',
      status: null,
      location: 'Alexandria, EG',
      time: '2 hours ago'
    }
  ]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }
    console.log('Updating password:', passwordData);
    // Add your password update logic here
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Change Password Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
          <p className="text-gray-500">Update your password for enhanced security.</p>
        </div>

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Login History Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login History</h2>
          <p className="text-gray-500">Recent login activity on your account.</p>
        </div>

        <div className="space-y-4">
          {loginHistory.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">{session.device}</span>
                  {session.status && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      {session.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{session.location} - {session.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}