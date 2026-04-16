import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import AcademicCalendar from '../components/admin/SystemConfiguration/AcademicCalendar';

const SystemConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: Calendar,
      component: AcademicCalendar
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
       <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
     
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 mb-6">System Configuration</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8 px-3 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium text-xs sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    
  );
};

export default SystemConfigurationPage;
