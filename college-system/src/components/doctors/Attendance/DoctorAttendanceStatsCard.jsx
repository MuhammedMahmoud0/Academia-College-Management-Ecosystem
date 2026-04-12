import React from 'react';
import { ArrowRight } from 'lucide-react';

const DoctorAttendanceStatsCard = ({ title, value, subtitle, valueColor = 'text-emerald-600', students = [], onArrowClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-600">{title}</div>
        {onArrowClick && (
          <button 
            onClick={onArrowClick}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            title="View Details"
          >
            <ArrowRight size={18} />
          </button>
        )}
      </div>
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
