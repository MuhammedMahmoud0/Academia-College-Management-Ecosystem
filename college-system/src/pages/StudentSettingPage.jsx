import { useState } from 'react';
import ProfileSetting from '../components/student/Setting/ProfileSetting';
import SecuritySetting from '../components/student/Setting/Security';
import NotificationsSetting from '../components/student/Setting/Notifications';
export default function StudentSettingPage() {
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
        </div>
        <hr  className='text-gray-300 mb-4'/>
          {/* Content */}
          {activeTab === 'profile' && <ProfileSetting />}
          {activeTab === 'security' && <SecuritySetting />}
          {activeTab === 'notifications' && <NotificationsSetting />}
  </div>
      );
}