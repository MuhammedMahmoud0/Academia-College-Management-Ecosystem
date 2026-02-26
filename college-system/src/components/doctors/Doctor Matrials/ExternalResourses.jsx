import { Link as LinkIcon, OpenInNew, Edit, Delete, Language } from '@mui/icons-material';
import { viewMaterial } from '../../../services/materialService';

export default function ExternalResourses({ resource, onEdit, onDelete }) {
  const handleOpenLink = async () => {
    try {
      await viewMaterial(resource.id, 'link', resource.url);
    } catch (error) {
      console.error('Error opening link:', error);
      // Fallback to direct window.open if API fails
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString || resource.uploadDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Extract domain from URL
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'External Link';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-indigo-100 group">
      {/* Header: Icon, Badge, and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
            <Language style={{ fontSize: '32px' }} className="text-white" />
          </div>
          <span className="px-2.5 py-1 bg-indigo-200 text-indigo-700 text-xs font-bold rounded-lg">
            LINK
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1">
          <button 
            onClick={onEdit}
            className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all hover:scale-110"
            title="Edit"
          >
            <Edit style={{ fontSize: '18px' }} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all hover:scale-110"
            title="Delete"
          >
            <Delete style={{ fontSize: '18px' }} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 break-words line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {resource.title}
      </h3>

      {/* Domain */}
      <div className="flex items-center gap-2 text-xs text-indigo-600 mb-3 bg-white/50 rounded-lg px-2 py-1 w-fit">
        <LinkIcon style={{ fontSize: '14px' }} />
        <span className="font-medium">{getDomain(resource.url)}</span>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{formatDate(resource.uploaded_at)}</span>
      </div>

      {/* Open Link Button */}
      <button
        onClick={handleOpenLink}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
      >
        <OpenInNew style={{ fontSize: '18px' }} />
        <span>Open Link</span>
      </button>
    </div>
  );
}
