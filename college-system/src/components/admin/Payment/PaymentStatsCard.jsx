import React from 'react';

const PaymentStatsCard = ({ icon, label, value, type }) => {
  const bgColors = {
    outstanding: 'bg-red-50',
    collected: 'bg-green-50',
    overdue: 'bg-yellow-50'
  };

  const iconBgColors = {
    outstanding: 'bg-red-100 text-red-500',
    collected: 'bg-green-100 text-green-500',
    overdue: 'bg-yellow-100 text-yellow-500'
  };

  const valueColors = {
    outstanding: 'text-red-500',
    collected: 'text-green-500',
    overdue: 'text-yellow-500'
  };

  return (
    <div className={`${bgColors[type]} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-4">
        <div className={`${iconBgColors[type]} w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className={`text-3xl font-bold ${valueColors[type]}`}>{value}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatsCard;
