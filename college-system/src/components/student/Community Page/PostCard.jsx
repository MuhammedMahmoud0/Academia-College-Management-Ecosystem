import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import PushPinIcon from '@mui/icons-material/PushPin';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { likePost, addComment, getPostComments, updatePost, deletePost } from '../../../services/communityService';
import { useAuth } from '../../../hooks/useAuth';

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

export default function PostCard({ post, onPostDeleted, onPostUpdated }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.recentComments || []);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsFetched, setCommentsFetched] = useState(false);

  // Admin menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Post content state (for live updates after edit)
  const [currentContent, setCurrentContent] = useState(post.content);
  const [currentImageUrl, setCurrentImageUrl] = useState(post.imageUrl);
  const [isPostDeleted, setIsPostDeleted] = useState(false);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDeletePost = async () => {
    const confirmed = window.confirm('Delete this post? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      setIsPostDeleted(true);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
      if (err?.response?.status === 401) {
        window.alert('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        window.alert('You do not have permission to delete this post.');
      } else {
        const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to delete post.';
        window.alert(msg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditContent(currentContent || '');
    setEditImageFile(null);
    setEditImagePreview(currentImageUrl || '');
    setShowEditModal(true);
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image for compression.'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      setIsUpdating(true);
      const payload = { content: editContent.trim() };

      if (editImageFile) {
        const encodedImage = await compressImage(editImageFile);
        payload.image_url = encodedImage;
      }

      await updatePost(post.id, payload);
      setCurrentContent(editContent.trim());
      if (editImageFile) {
        setCurrentImageUrl(editImagePreview);
      }
      setShowEditModal(false);
      if (onPostUpdated) onPostUpdated(post.id, payload);
    } catch (err) {
      console.error('Error updating post:', err?.response?.data || err);
      if (err?.response?.status === 401) {
        window.alert('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        window.alert('You do not have permission to update this post.');
      } else {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err?.response?.data?.details || 'Failed to update post.';
        window.alert(msg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    setComments(post.recentComments || []);
    setCommentCount(post.comments);
    setCommentsFetched(false);
  }, [post.id]);

  const handleToggleComments = async () => {
    const willShow = !showComments;
    setShowComments(willShow);

    if (willShow && !commentsFetched) {
      try {
        setIsLoadingComments(true);
        const data = await getPostComments(post.id);
        const allComments = (data?.comments ?? []).map((c) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          author_name: c.author_name ?? c.users?.full_name ?? 'Unknown',
          author_avatar: c.author_avatar ?? c.users?.avatar_url ?? null,
        }));
        setComments(allComments);
        setCommentCount(data?.total ?? allComments.length);
        setCommentsFetched(true);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const avatarDisplay = typeof post.avatar === 'string' && post.avatar.length <= 2
    ? post.avatar
    : post.avatar;

  const isValidImageUrl = currentImageUrl && !currentImageUrl.startsWith('blob:');
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

  // Don't render if post was deleted
  if (isPostDeleted) return null;

  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm ${post.isPinned ? 'border-2 border-amber-400' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
        <div className="flex gap-3 items-center flex-1">
          {post.author_avatar ? (
            <img
              src={post.author_avatar}
              alt={post.author}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
              onClick={() => post.author_id && navigate(`/dashboard/community/user/${post.author_id}/posts`)}
            />
          ) : (
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
              style={{ backgroundColor: post.bgColor }}
              onClick={() => post.author_id && navigate(`/dashboard/community/user/${post.author_id}/posts`)}
            >
              {avatarDisplay}
            </div>
          )}
          <div>
            <div className="text-sm sm:text-base font-semibold text-gray-900 flex items-center flex-wrap gap-x-1">
              <span
                className="cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => post.author_id && navigate(`/dashboard/community/user/${post.author_id}/posts`)}
              >
                {post.author}
              </span>
              {post.groupName && (
                <>
                  <span className="text-gray-500 font-normal">in</span>
                  <span
                    className="text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => post.groupId && navigate(`/dashboard/my-groups/${post.groupId}/posts`)}
                  >
                    {post.groupName}
                  </span>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{post.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          {post.isPinned && (
            <div className="bg-amber-50 text-amber-900 px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap">
              <PushPinIcon fontSize="small" /> Pinned
            </div>
          )}
          {isAdmin && (
            <>
              <IconButton
                onClick={handleMenuClick}
                size="small"
                className="text-gray-500 hover:text-gray-700"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 2,
                  sx: { mt: 1, minWidth: 140, borderRadius: 2 }
                }}
              >
                <MenuItem onClick={(e) => {
                  handleMenuClose(e);
                  handleOpenEditModal();
                }} sx={{ fontSize: '14px', py: 1.5 }}>
                  <EditIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={(e) => {
                  handleMenuClose(e);
                  handleDeletePost();
                }} sx={{ color: 'error.main', fontSize: '14px', py: 1.5 }}>
                  <DeleteOutlineIcon sx={{ mr: 1.5, fontSize: 18 }} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <p className={`text-sm sm:text-base text-gray-700 leading-relaxed ${hasValidImage ? 'mb-4' : 'mb-5'}`}>
        {currentContent}
      </p>

      {/* Image */}
      {hasValidImage && (
        <div className="rounded-lg overflow-hidden mb-5 bg-gray-50 flex items-center justify-center">
          <img
            src={currentImageUrl}
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
          className={`border-none bg-transparent cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 transition-colors ${isLiked ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-600 hover:text-gray-800'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span><ThumbUpIcon fontSize="small" /></span> {likeCount}
        </button>
        <button
          onClick={handleToggleComments}
          disabled={isLoadingComments}
          className={`border-none bg-transparent cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm px-2 py-1 transition-colors ${showComments ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800'
            } ${isLoadingComments ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span><InsertCommentIcon fontSize="small" /></span> {commentCount}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Loading Comments */}
          {isLoadingComments ? (
            <div className="flex justify-center items-center py-4 mb-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-xs text-gray-500">Loading comments...</span>
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col gap-3 mb-4 max-h-[400px] overflow-y-auto pr-1">
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

      {/* Edit Post Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !isUpdating && setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Post</h3>
            <form onSubmit={handleUpdatePost}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-colors resize-none mb-3"
                placeholder="Post content..."
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
                />
                {editImagePreview && (
                  <div className="mt-2 relative rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full h-auto max-h-[200px] object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveEditImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editContent.trim() || isUpdating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}