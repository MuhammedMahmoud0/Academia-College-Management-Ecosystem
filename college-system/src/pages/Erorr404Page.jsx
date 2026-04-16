import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Error404Page() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'student') {
      navigate('/dashboard/info');
    } else if (user?.role === 'doctor' || user?.role === 'teaching_assistant') {
      navigate('/dashboard/doctor');
    } else if (user?.role === 'admin' || user?.role === 'super_admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Animated number */}
        <div className="relative mb-8 select-none">
          <div className="text-[10rem] font-black leading-none tracking-tighter bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-90 drop-shadow-sm">
            404
          </div>
          {/* Floating orbs */}
          <div className="absolute top-4 left-8 w-6 h-6 rounded-full bg-indigo-300 opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2.5s' }} />
          <div className="absolute bottom-4 right-8 w-4 h-4 rounded-full bg-purple-400 opacity-50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-indigo-400 opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }} />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Access Denied or Page Not Found
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          The page you're looking for doesn't exist or you don't have permission to view it.
          Please check the URL or return to your dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Subtle footer */}
        <p className="mt-10 text-xs text-gray-400">
          Academia College System &mdash; Error 404
        </p>
      </div>
    </div>
  );
}
