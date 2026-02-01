import React from 'react';

const DoctorAttendanceStatsCard = ({ title, value, subtitle, valueColor = 'text-emerald-600', students = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      {students.length > 0 ? (
        <div className="space-y-2">
          {students.map((student, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{student.name}</span>
              <span className={`text-lg font-bold ${student.rate < 75 ? 'text-red-600' : 'text-yellow-600'}`}>
                {student.rate}%
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

export default DoctorAttendanceStatsCard;
