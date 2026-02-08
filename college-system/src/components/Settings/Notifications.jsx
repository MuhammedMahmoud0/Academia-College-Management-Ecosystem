import { useState } from 'react';

export default function NotificationsSetting() {
  const [preferences, setPreferences] = useState({
    newGrades: true,
    deadlines: true,
    communityHub: false,
    campusEvents: true
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    console.log('Saving preferences:', preferences);
    // Add your save logic here
  };

  const notificationOptions = [
    {
      key: 'newGrades',
      title: 'New Grades Posted',
      description: 'Get notified when a professor posts a new grade.',
      enabled: preferences.newGrades
    },
    {
      key: 'deadlines',
      title: 'Assignment & Exam Deadlines',
      description: 'Receive reminders for upcoming deadlines.',
      enabled: preferences.deadlines
    },
    {
      key: 'communityHub',
      title: 'Community Hub Activity',
      description: 'Get notified for replies and mentions.',
      enabled: preferences.communityHub
    },
    {
      key: 'campusEvents',
      title: 'Campus Events & Announcements',
      description: 'Stay up to date with campus news.',
      enabled: preferences.campusEvents
    }
  ];

  return (
    <div className="w-full p-4 md:p-6">
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
            className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}