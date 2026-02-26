import { 
  Description, Download, Visibility, 
  PictureAsPdf, Image, VideoLibrary, AudioFile, Article 
} from '@mui/icons-material';
import { useState } from 'react';
import { viewMaterial, downloadMaterial } from '../../../services/materialService';
import { useToast } from '../../../hooks/useToast';

export default function LecturesMatrial({ lecture }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async () => {
    try {
      setIsLoading(true);
      // Determine type based on url field
      const materialType = lecture.url ? 'link' : 'file';
      await viewMaterial(lecture.id, materialType, lecture.url);
    } catch (error) {
      console.error('Error viewing material:', error);
      toast.error('Failed to view material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await downloadMaterial(lecture.id, lecture.file_name || lecture.title);
    } catch (error) {
      console.error('Error downloading material:', error);
      toast.error('Failed to download material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get file extension from title or file_name
  const getFileExtension = () => {
    const fileName = lecture.file_name || lecture.title || '';
    const ext = fileName.split('.').pop().toLowerCase();
    return ext || 'file';
  };

  // Get appropriate icon and styling based on file type
  const getFileTypeInfo = () => {
    const ext = getFileExtension();
    
    if (ext === 'pdf') {
      return { 
        icon: <PictureAsPdf style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-red-100', 
        textColor: 'text-red-600',
        badge: 'PDF' 
      };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return { 
        icon: <Image style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-600',
        badge: 'IMAGE' 
      };
    } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
      return { 
        icon: <VideoLibrary style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-purple-100', 
        textColor: 'text-purple-600',
        badge: 'VIDEO' 
      };
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      return { 
        icon: <AudioFile style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-600',
        badge: 'AUDIO' 
      };
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return { 
        icon: <Article style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-indigo-100', 
        textColor: 'text-indigo-600',
        badge: 'DOC' 
      };
    } else {
      return { 
        icon: <Description style={{ fontSize: '32px' }} />, 
        bgColor: 'bg-gray-100', 
        textColor: 'text-gray-600',
        badge: ext.toUpperCase() 
      };
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString || lecture.uploadDate);
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

  const fileInfo = getFileTypeInfo();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100 group">
      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${fileInfo.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <div className={fileInfo.textColor}>
            {fileInfo.icon}
          </div>
        </div>
        <span className={`px-2.5 py-1 ${fileInfo.bgColor} ${fileInfo.textColor} text-xs font-bold rounded-lg`}>
          {fileInfo.badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 break-words line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {lecture.title}
      </h3>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{formatDate(lecture.uploaded_at)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* View Button */}
        <button 
          onClick={handleView}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
        >
          <Visibility style={{ fontSize: '18px' }} />
          <span>View</span>
        </button>
        
        {/* Download Button */}
        <button 
          onClick={handleDownload}
          disabled={isLoading}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-400 text-gray-700 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <Download style={{ fontSize: '18px' }} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
