import React, { useState } from 'react';
import StudentManagement from '../components/admin/User Managment/StudentManagement';
import DoctorsManagement from '../components/admin/User Managment/DoctorsManagement';
export default function UserManagementPage() { 
    const [activeTab, setActiveTab] = useState('students');
    return (

       <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900 mb-6">User Management</h1>
        {/* tabs */}
         <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'students'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
         
          Students
        </button>
        <button
          onClick={() => setActiveTab('doctors-faculty')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'doctors-faculty'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          
          Doctors & Faculty
        </button>
        
      </div>
      <hr  className='text-gray-300 mb-4'/>
        {/* Content */}
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'doctors-faculty' && <DoctorsManagement />}
</div>
    );
}