import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Error, Warning, Info, Close } from '@mui/icons-material';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: <CheckCircle className="text-white" style={{ fontSize: '24px' }} />,
          progressBg: 'bg-green-300'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-600',
          icon: <Error className="text-white" style={{ fontSize: '24px' }} />,
          progressBg: 'bg-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: <Warning className="text-white" style={{ fontSize: '24px' }} />,
          progressBg: 'bg-yellow-300'
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          icon: <Info className="text-white" style={{ fontSize: '24px' }} />,
          progressBg: 'bg-blue-300'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`${styles.bg} text-white rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-md pointer-events-auto transform transition-all duration-300 ${
        isExiting ? 'translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'
      } animate-slideInRight`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          {styles.icon}
        </div>

        {/* Message */}
        <div className="flex-1 text-sm font-semibold">
          {message}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <Close style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/20">
        <div
          className={`h-full ${styles.progressBg} animate-shrink`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
