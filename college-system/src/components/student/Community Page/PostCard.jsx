import { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import PushPinIcon from '@mui/icons-material/PushPin';
export default function PostCard({ post }) {
  const [imageError, setImageError] = useState(false);
  
  // Generate avatar from name if it's a string, otherwise use the avatar value
  const avatarDisplay = typeof post.avatar === 'string' && post.avatar.length <= 2 
    ? post.avatar 
    : post.avatar;
  
  // Ignore blob URLs as they're temporary and will fail on reload
  const isValidImageUrl = post.imageUrl && !post.imageUrl.startsWith('blob:');
  const hasValidImage = isValidImageUrl && !imageError;

  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm ${post.isPinned ? 'border-2 border-amber-400' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
        <div className="flex gap-3 items-center flex-1">
          {post.author_avatar ? (
            <img 
              src={post.author_avatar}
              alt={post.author}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
              style={{ backgroundColor: post.bgColor }}
            >
              {avatarDisplay}
            </div>
          )}
          <div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {post.author}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {post.time}
            </div>
          </div>
        </div>
        {post.isPinned && (
          <div className="bg-amber-50 text-amber-900 px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap self-start">
            <PushPinIcon fontSize="small" /> Pinned
          </div>
        )}
        {!post.isPinned && (
          <button className="border-none bg-transparent cursor-pointer text-gray-600 text-xl px-2 py-1 hover:text-gray-800">
            ⋯
          </button>
        )}
      </div>

      {/* Content */}
      <p className={`text-sm sm:text-base text-gray-700 leading-relaxed ${hasValidImage ? 'mb-4' : 'mb-5'}`}>
        {post.content}
      </p>

      {/* Image if exists */}
      {hasValidImage && (
        <div className="rounded-lg overflow-hidden mb-5 bg-gray-50 flex items-center justify-center">
          <img 
            src={post.imageUrl}
            alt="post image" 
            className="w-full h-auto max-h-[600px] object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 sm:gap-5 pt-4 border-t border-gray-200 flex-wrap">
        <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 hover:text-gray-800 transition-colors">
          <span><ThumbUpIcon fontSize="small" /></span> {post.likes}
        </button>
        <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 hover:text-gray-800 transition-colors">
          <span><InsertCommentIcon fontSize="small" /></span> {post.comments}
        </button>
        <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 hover:text-gray-800 transition-colors">
          <span><ShareIcon fontSize="small" /></span> Share
        </button>
      </div>
    </div>
  );
}