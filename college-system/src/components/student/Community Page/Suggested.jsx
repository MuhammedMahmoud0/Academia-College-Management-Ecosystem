import { useState, useEffect } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { getSuggestedGroups } from '../../../services/communityService';

export default function Suggested() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedGroups();
  }, []);

  const fetchSuggestedGroups = async () => {
    try {
      setLoading(true);
      const data = await getSuggestedGroups();
      setGroups(data.groups || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching suggested groups:', err);
      setError('Failed to load groups');
     
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <h4 className="text-base font-semibold mb-4 text-gray-900">
        Suggested Groups
      </h4>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-2">{error}</p>
          <button
            onClick={fetchSuggestedGroups}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Retry
          </button>
        </div>
      ) : groups.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-4">No suggested groups available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.id} className="flex justify-between items-center">
              <div className="flex gap-3 items-center flex-1">
                {group.avatar_url ? (
                  <img
                    src={group.avatar_url}
                    alt={group.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg sm:text-xl shrink-0"
                  style={{ display: group.avatar_url ? 'none' : 'flex' }}
                >
                  {group.avatar_url ? null : <GroupIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                    {group.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {group.members_count} member{group.members_count !== 1 ? 's' : ''}
                  </div>
                  {group.description && (
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {group.description}
                    </div>
                  )}
                </div>
              </div>
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 cursor-pointer flex items-center justify-center text-base sm:text-lg font-semibold shrink-0 hover:bg-indigo-600 hover:text-white transition-colors">
                +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}