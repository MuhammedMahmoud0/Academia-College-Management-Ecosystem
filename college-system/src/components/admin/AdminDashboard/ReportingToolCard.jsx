import React from 'react';

const ReportingToolCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <button className="w-full bg-indigo-600 text-white text-sm py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
        Generate
      </button>
    </div>
  );
};

export default ReportingToolCard;
