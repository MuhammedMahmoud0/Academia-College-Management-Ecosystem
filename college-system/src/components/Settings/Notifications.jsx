import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Toast from '../Toast/Toast';

export default function NotificationsSetting() {
  const { preferences, updatePreferences } = useNotification();
  const [saving, setSaving] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [toast, setToast] = useState(null);

  // Sync with context preferences
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (key) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setToast(null);
    try {
      await updatePreferences(localPreferences);
      setToast({ message: 'Preferences saved successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save preferences', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: 'new_grade',
      title: 'New Grades Posted',
      description: 'Get notified when a professor posts a new grade.',
      enabled: localPreferences.new_grade
    },
    {
      key: 'exam_deadline',
      title: 'Assignment & Exam Deadlines',
      description: 'Receive reminders for upcoming deadlines.',
      enabled: localPreferences.exam_deadline
    },
    {
      key: 'community_activity',
      title: 'Community Hub Activity',
      description: 'Get notified for replies and mentions.',
      enabled: localPreferences.community_activity
    },
    {
      key: 'campus_announcement',
      title: 'Campus Events & Announcements',
      description: 'Stay up to date with campus news.',
      enabled: localPreferences.campus_announcement
    }
  ];

  return (
    <div className="w-full p-4 md:p-6 relative">
      {toast && (
        <div className="fixed top-24 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Notification Preferences</h1>
          <p className="text-sm md:text-base text-gray-500">Manage how you receive notifications.</p>
        </div>

        {/* Notification Options */}
        <div className="space-y-4 md:space-y-6">
          {notificationOptions.map((option, index) => (
            <div
              key={option.key}
              className={`flex items-center justify-between gap-4 py-4 ${
                index !== notificationOptions.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  {option.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {option.description}
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(option.key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  option.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={option.enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    option.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6 md:mt-8">
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}