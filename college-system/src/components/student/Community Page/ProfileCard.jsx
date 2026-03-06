import { useState, useEffect } from 'react';
import { getStudentProfile } from '../../../services/infoService';

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        console.log('Fetched student profile:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm flex flex-col items-center gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-400 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold overflow-hidden">
        {user?.studentProfile?.avatar_url ? (
          <img src={user.studentProfile.avatar_url} alt={user.studentProfile.full_name} className="w-full h-full object-cover" />
        ) : (
          getInitials(user?.studentProfile?.full_name || 'User')
        )}
      </div>
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {loading ? 'Loading...' : user?.studentProfile?.full_name || 'N/A'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {user?.studentProfile?.student_profiles?.departments?.name || 'N/A'}
        </p>
      </div>
    </div>
  );
}