import { useState } from 'react';
import ProfileSetting from '../components/Settings/ProfileSetting';
import SecuritySetting from '../components/Settings/Security';
import NotificationsSetting from '../components/Settings/Notifications';
import CourseManagementSetting from '../components/Settings/CourseManagement';
import SystemSettings from '../components/Settings/SystemSettings';
export default function SettingPage() {
   const [activeTab, setActiveTab] = useState('profile');
      return (
           <div className=" p-2 bg-gray-50 min-h-screen rounded-lg" >
        
          {/* tabs */}
           <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'profile'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
           
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'security'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'notifications'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            
            Notifications
          </button>
             <button
            onClick={() => setActiveTab('course-management')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'course-management'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            
            Course Management
          </button>
             <button
            onClick={() => setActiveTab('system-settings')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'system-settings'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            
            System Settings
          </button>
        </div>
        <hr  className='text-gray-300 mb-4'/>
          {/* Content */}
          {activeTab === 'profile' && <ProfileSetting />}
          {activeTab === 'security' && <SecuritySetting />}
          {activeTab === 'notifications' && <NotificationsSetting />}
          {activeTab === 'course-management' && <CourseManagementSetting />}
          {activeTab === 'system-settings' && <SystemSettings />}
  </div>
      );
}