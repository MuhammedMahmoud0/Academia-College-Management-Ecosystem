import React from 'react';

const PaymentFilters = ({ filters, setFilters, searchTerm, setSearchTerm, onExport }) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0 min-w-[200px]">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            placeholder="Search name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="relative flex-1 min-w-0 max-w-[200px]">
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            value={filters.date || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Payment Method Filter */}
        <select 
          className="px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-full sm:w-auto sm:min-w-[150px] text-gray-700"
          value={filters.payMethod || 'all'}
          onChange={(e) => setFilters(prev => ({ ...prev, payMethod: e.target.value }))}
        >
          <option value="all">All Methods</option>
          <option value="paypal">PayPal</option>
          <option value="paymob">Paymob</option>
          <option value="manual">Manual</option>
        </select>

        {/* Status Filter */}
        <select 
          className="px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-full sm:w-auto sm:min-w-[150px] text-gray-700"
          value={filters.status || 'all'}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <button 
        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium w-full lg:w-auto"
        onClick={onExport}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 10L10 14L14 10M10 3V13.5M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Export Excel
      </button>
    </div>
  );
};

export default PaymentFilters;
