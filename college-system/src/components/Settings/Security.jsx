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
    <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8">
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
              className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Login History Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Login History</h2>
          <p className="text-sm md:text-base text-gray-500">Recent login activity on your account.</p>
        </div>

        <div className="space-y-4">
          {loginHistory.map((session, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm md:text-base text-gray-900 font-medium">{session.device}</span>
                  {session.status && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      {session.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right text-xs md:text-sm text-gray-500">
                <div>{session.location} - {session.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}