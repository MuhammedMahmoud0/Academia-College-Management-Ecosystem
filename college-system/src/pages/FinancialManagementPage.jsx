 

 import React, { useState } from 'react';
 import FeesManagement from '../components/admin/FinancialManagement/FeesManagement';
 import PaymentTracking from '../components/admin/FinancialManagement/PaymentTracking';
 export default function FinancialManagementPage() { 
     const [activeTab, setActiveTab] = useState('fees-management');
     return (
          <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
  <h1 className="text-3xl font-bold text-slate-900 mb-6">Financial Management</h1>
         {/* tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6 overflow-x-auto">
         <button
           onClick={() => setActiveTab('fees-management')}
           className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
             activeTab === 'fees-management'
               ? 'bg-indigo-100 text-indigo-700'
               : 'bg-white text-gray-600 hover:bg-gray-100'
           }`}
         >
          
         Tuition & Fees Management
         </button>
         <button
           onClick={() => setActiveTab('payment-tracking')}
           className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
             activeTab === 'payment-tracking'
               ? 'bg-indigo-100 text-indigo-700'
               : 'bg-white text-gray-600 hover:bg-gray-100'
           }`}
         >
           
          Payment Tracking
         </button>
         
       </div>
       <hr  className='text-gray-300 mb-4'/>
         {/* Content */}
         {activeTab === 'fees-management' && <FeesManagement />}
         {activeTab === 'payment-tracking' && <PaymentTracking />}
 </div>
     );
 }
