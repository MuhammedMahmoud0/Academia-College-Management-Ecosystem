import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, Loader, AlertCircle } from 'lucide-react';

const PREVIEW_COUNT = 5;

const NeedsAttentionCard = ({ items, loading }) => {
  const navigate = useNavigate();

  const getDotColor = (priority) => {
    switch (priority) {
      case 'high':
      case 'error':
        return 'bg-red-500';
      case 'medium':
      case 'warning':
        return 'bg-orange-500';
      case 'low':
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const visibleItems = items ? items.slice(0, PREVIEW_COUNT) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Needs Attention</h2>
        {!loading && (
          <button
            onClick={() => navigate('/dashboard/admin/alerts')}
            title="View all alerts"
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm">No alerts at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getDotColor(item.priority || item.type)}`} />
                <span className="text-sm text-gray-700">{item.message}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeedsAttentionCard;
