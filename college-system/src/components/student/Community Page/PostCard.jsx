import { useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import PushPinIcon from '@mui/icons-material/PushPin';
import SendIcon from '@mui/icons-material/Send';
import { likePost, addComment } from '../../../services/communityService';

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatCommentTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function PostCard({ post }) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.recentComments || []);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(post.recentComments || []);
    setCommentCount(post.comments);
  }, [post.id]);

  const avatarDisplay = typeof post.avatar === 'string' && post.avatar.length <= 2
    ? post.avatar
    : post.avatar;

  const isValidImageUrl = post.imageUrl && !post.imageUrl.startsWith('blob:');
  const hasValidImage = isValidImageUrl && !imageError;

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const response = await likePost(post.id);
      setIsLiked(response.liked);
      setLikeCount(prev => response.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const response = await addComment(post.id, content);
      const created = response.comment ?? response;
      setComments(prev => [...prev, {
        id: created.id ?? Date.now(),
        content: created.content ?? content,
        created_at: created.created_at ?? new Date().toISOString(),
        author_name: created.users?.full_name ?? created.user?.author_name ?? created.author_name ?? 'You',
        author_avatar: created.users?.avatar_url ?? created.user?.avatar_url ?? created.author_avatar ?? null,
      }]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="text-sm sm:text-base font-semibold text-gray-900">{post.author}</div>
            <div className="text-xs sm:text-sm text-gray-600">{post.time}</div>
          </div>
        </div>
        {post.isPinned && (
          <div className="bg-amber-50 text-amber-900 px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap self-start">
            <PushPinIcon fontSize="small" /> Pinned
          </div>
        )}
        {!post.isPinned && (
          <button className="border-none bg-transparent cursor-pointer text-gray-600 text-xl px-2 py-1 hover:text-gray-800">⋯</button>
        )}
      </div>

      {/* Content */}
      <p className={`text-sm sm:text-base text-gray-700 leading-relaxed ${hasValidImage ? 'mb-4' : 'mb-5'}`}>
        {post.content}
      </p>

      {/* Image */}
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
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`border-none bg-transparent cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 transition-colors ${
            isLiked ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-800'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span><ThumbUpIcon fontSize="small" /></span> {likeCount}
        </button>
        <button
          onClick={() => setShowComments(prev => !prev)}
          className={`border-none bg-transparent cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 transition-colors ${
            showComments ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span><InsertCommentIcon fontSize="small" /></span> {commentCount}
        </button>
        <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 hover:text-gray-800 transition-colors">
          <span><ShareIcon fontSize="small" /></span> Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Existing Comments */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 items-start">
                  {comment.author_avatar ? (
                    <img
                      src={comment.author_avatar}
                      alt={comment.author_name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                      {getInitials(comment.author_name)}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-gray-900">{comment.author_name}</span>
                      <span className="text-xs text-gray-400">{formatCommentTime(comment.created_at)}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-3">No comments yet. Be the first!</p>
          )}

          {/* New Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-colors"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
            >
              <SendIcon style={{ fontSize: 16 }} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}