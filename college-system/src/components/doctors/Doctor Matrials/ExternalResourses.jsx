import { Link, OpenInNew, Edit, Delete } from '@mui/icons-material';

export default function ExternalResourses({ resource, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Action Buttons */}
      <div className="flex justify-end gap-1 sm:gap-2 mb-2 sm:mb-3">
        <button 
          onClick={onEdit}
          className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
        >
          <Edit className="text-gray-600 text-base sm:text-lg" />
        </button>
        <button 
          onClick={onDelete}
          className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
        >
          <Delete className="text-gray-600 text-base sm:text-lg" />
        </button>
      </div>

      {/* Icon */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
        <Link className="text-indigo-600" style={{ fontSize: '28px' }} />
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 break-words">
        {resource.title}
      </h3>

      {/* Upload Date */}
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
        Uploaded: {resource.uploadDate}
      </p>

      {/* Open Link Button */}
      <button
        onClick={() => window.open(resource.url, '_blank')}
        className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium py-2 sm:py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
      >
        <OpenInNew style={{ fontSize: '18px' }} />
        <span>Open Link</span>
      </button>
    </div>
  );
}
