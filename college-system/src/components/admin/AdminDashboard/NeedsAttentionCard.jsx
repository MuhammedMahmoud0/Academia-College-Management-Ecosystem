import React from 'react';
import { ChevronRight } from 'lucide-react';

const NeedsAttentionCard = ({ items }) => {

  const getDotColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Needs Attention</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getDotColor(item.type)}`}></div>
              <span className="text-sm text-gray-700">{item.message}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedsAttentionCard;
