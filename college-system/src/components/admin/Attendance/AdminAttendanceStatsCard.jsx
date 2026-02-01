import React from 'react';

const AdminAttendanceStatsCard = ({ title, value, subtitle, valueColor = 'text-emerald-600', items = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-sm text-gray-600 mb-3">{title}</div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className={`text-sm font-bold ${item.rate < 80 ? 'text-red-600' : 'text-yellow-600'}`}>
                {item.rate}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={`text-4xl font-bold ${valueColor}`}>{value}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </>
      )}
    </div>
  );
};

export default AdminAttendanceStatsCard;
