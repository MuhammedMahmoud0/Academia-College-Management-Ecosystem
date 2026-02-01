import React from 'react';

const AttendanceStatsCard = ({ title, value, valueColor = 'text-emerald-600' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-gray-600 text-sm mb-2">{title}</div>
      <div className={`text-4xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
};

export default AttendanceStatsCard;
