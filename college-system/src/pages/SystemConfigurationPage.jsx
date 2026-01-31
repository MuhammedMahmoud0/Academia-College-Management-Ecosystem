import React, { useState } from 'react';
import { Calendar, Megaphone, Shield } from 'lucide-react';
import AcademicCalendar from '../components/admin/SystemConfiguration/AcademicCalendar';
import SiteWideAnnouncements from '../components/admin/SystemConfiguration/SiteWideAnnouncements';
import RolePermissionManagement from '../components/admin/SystemConfiguration/RolePermissionManagement';

const SystemConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: Calendar,
      component: AcademicCalendar
    },
    {
      id: 'announcements',
      label: 'Site-wide Announcements',
      icon: Megaphone,
      component: SiteWideAnnouncements
    },
    {
      id: 'permissions',
      label: 'Role & Permission Management',
      icon: Shield,
      component: RolePermissionManagement
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">System Configuration</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPage;
