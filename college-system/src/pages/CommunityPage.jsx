import ProfileCard from '../components/student/Community Page/ProfileCard';
import Navigation from '../components/student/Community Page/Navigation';
import PostCard from '../components/student/Community Page/PostCard';
import UpcomingEvents from '../components/student/Community Page/UpcomingEvents';
import Suggested from '../components/student/Community Page/Suggested';
import { useState, useEffect, useRef, useCallback } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { createCommunityPost, getCommunityFeed, getMyGroups } from '../services/communityService';
import { getStudentProfile } from '../services/infoService';
import { useAuth } from '../hooks/useAuth';

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth();
  console.log('Authenticated:', isAuthenticated, 'User:', user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'doctor' || user?.role === 'teaching_assistant';
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [createPostError, setCreatePostError] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const imageFileInputRef = useRef(null);
  const sentinelRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
      fetchStudentProfile();
      fetchMyGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchMyGroups = async () => {
    try {
      const data = await getMyGroups();
      const groups = data?.groups || [];
      setMyGroups(groups);

      if (groups.length > 0) {
        setSelectedGroupId(String(groups[0].id));
      }
    } catch (err) {
      console.error('Error fetching my groups:', err);
      setMyGroups([]);
      setSelectedGroupId('');
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const data = await getStudentProfile();
      setStudentProfile(data.studentProfile);
    } catch (error) {
      if (error?.response?.status !== 403) {
        console.error('Error fetching student profile:', error);
      }
    }
  };

  const fetchPosts = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const data = await getCommunityFeed(pageNum, 10);

      // Transform API data to match component structure
      const transformedPosts = (data.posts || []).map(transformPost);

      if (pageNum === 1) {
        setPosts(transformedPosts);
      } else {
        setPosts(prev => [...prev, ...transformedPosts]);
      }

      setHasMore(transformedPosts.length === 10);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);

      // Provide specific error messages
      if (err.response?.status === 403) {
        setError('You do not have permission to view posts.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please refresh the page.');
      } else {
        setError('Unable to connect to server. Showing sample posts.');
      }

      // Fallback to mock data on first load
      if (pageNum === 1) {
        const mockPosts = getMockPosts();
        setPosts(mockPosts);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const transformPost = (post) => {
    const authorName = post?.users?.full_name ?? post?.author_name ?? user?.name ?? 'Unknown';
    const authorAvatar = post?.users?.avatar_url ?? post?.author_avatar ?? null;
    const isValidAvatarUrl = authorAvatar && (authorAvatar.startsWith('http://') || authorAvatar.startsWith('https://'));

    return {
      id: post?.id ?? `tmp-${Date.now()}`,
      author: authorName,
      author_id: post?.author_id ?? post?.users?.id ?? null,
      author_avatar: isValidAvatarUrl ? authorAvatar : null,
      avatar: getInitials(authorName),
      time: formatTime(post?.created_at ?? new Date().toISOString()),
      content: post?.content ?? '',
      likes: post?._count?.post_likes ?? post?.likes_count ?? 0,
      comments: post?._count?.post_comments ?? post?.comments_count ?? 0,
      isPinned: Boolean(post?.is_pinned),
      image: post?.image_url ?? null,
      imageUrl: post?.image_url ?? null,
      bgColor: getRandomColor(),
      groupName: post?.community_groups?.name ?? post?.group_name ?? null,
      groupId: post?.group_id ?? post?.community_groups?.id ?? null,
      isLikedByMe: post?.is_liked_by_me ?? false,
      recentComments: (post?.recent_comments ?? []).map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        author_name: c.author_name ?? 'Unknown',
        author_avatar: c.author_avatar ?? null,
      }))
    };
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

  const handleSelectImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      setCreatePostError('Please choose an image file.');
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    if (createPostError) setCreatePostError('');
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async () => {
    const content = newPostContent.trim();
    if (!content || isPosting) return;

    if (!selectedGroupId) {
      setCreatePostError('Please select a group before posting.');
      return;
    }

    try {
      setIsPosting(true);
      setCreatePostError('');

      let encodedImage = null;
      if (selectedImageFile) {
        encodedImage = await compressImage(selectedImageFile);
      }

      const response = await createCommunityPost({
        content,
        group_id: Number(selectedGroupId),
        ...(encodedImage ? { image_url: encodedImage } : {}),
      });
      const createdPost = response?.post ?? response?.data?.post ?? response;

      if (createdPost?.id) {
        setPosts((prev) => [transformPost(createdPost), ...prev]);
      } else {
        await fetchPosts(1);
      }

      setNewPostContent('');
      handleRemoveSelectedImage();
    } catch (err) {
      console.error('Error creating post:', err);
      const apiMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.details;
      setCreatePostError(apiMessage || 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getMockPosts = () => {
    return [
      {
        id: 1,
        author: 'Admin Office',
        avatar: 'AO',
        time: 'Pinned',
        content: 'Mid-term exam schedules have been posted. Please check the "Exams" page for your detailed timetable.',
        likes: 152,
        comments: 12,
        isPinned: true,
        bgColor: '#a78bfa'
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        avatar: 'SJ',
        time: '2h ago',
        content: 'Just finished the final project for CS350! It was tough but learned so much about operating systems. Huge thanks to everyone in our study group!',
        likes: 45,
        comments: 8,
        imageUrl: 'https://via.placeholder.com/600x400',
        bgColor: '#8b5cf6'
      }
    ];
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRandomColor = () => {
    const colors = ['#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  }, [loading, loadingMore, hasMore, page]);

  // Infinite scroll: observe sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Community Hub
        </h1>

        {/* Mobile Menu Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="xl:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Toggle events and groups"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Left Sidebar Overlay - Mobile/Tablet */}
      {leftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setLeftSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <ProfileCard />
              <Navigation />
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar Overlay - Mobile/Tablet */}
      {rightSidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setRightSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Events & Groups</h2>
              <button
                onClick={() => setRightSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <UpcomingEvents />
              <Suggested />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px] gap-4 lg:gap-5">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col gap-4 lg:gap-5">
          <ProfileCard />
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Create Post - Admin/Super Admin only */}
          {isAdmin && (
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
                  {(studentProfile?.avatar_url || user?.avatar_url || user?.avatar) ? (
                    <img
                      src={studentProfile?.avatar_url || user?.avatar_url || user?.avatar}
                      alt={studentProfile?.full_name || user?.full_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(studentProfile?.full_name || user?.full_name || 'User')
                  )}
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${studentProfile?.full_name?.split(' ')[0] || user?.full_name || ''}?`}
                  className="flex-1 border-none outline-none text-sm sm:text-base bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg resize-none min-h-[44px] max-h-[200px]"
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
              </div>

              <div className="mt-3 flex flex-col gap-1 sm:max-w-xs">
                <label htmlFor="post-group" className="text-xs font-medium text-gray-600">Post to group</label>
                <select
                  id="post-group"
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value);
                    if (createPostError) setCreatePostError('');
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {myGroups.length === 0 ? (
                    <option value="">No groups available</option>
                  ) : (
                    myGroups.map((group) => (
                      <option key={group.id} value={String(group.id)}>{group.name}</option>
                    ))
                  )}
                </select>
              </div>

              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImageFile}
              />

              {imagePreviewUrl ? (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-gray-600">{selectedImageFile?.name || 'Selected image'}</span>
                    <button
                      onClick={handleRemoveSelectedImage}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <img src={imagePreviewUrl} alt="Selected preview" className="max-h-48 rounded-md object-contain" />
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 pt-4 border-t border-gray-200 sm:justify-between sm:items-center">
                <div className="flex gap-4 sm:gap-5 justify-center sm:justify-start">
                  <button
                    onClick={() => imageFileInputRef.current?.click()}
                    className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors"
                  >
                    <span><ImageIcon /></span>
                  </button>
                  <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors">
                    <span><AttachFileIcon /></span>
                  </button>
                  <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors">
                    <span><SignalCellularAltIcon /></span>
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting || !selectedGroupId}
                  className="bg-indigo-600 text-white border-none rounded-lg px-6 py-2.5 cursor-pointer font-medium text-sm hover:bg-indigo-700 transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
              {createPostError ? (
                <p className="mt-3 text-sm text-red-600">{createPostError}</p>
              ) : null}
            </div>
          )}

          {/* Posts */}
          {loading && posts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-6 shadow-sm text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchPosts(1)}
                className="mt-4 bg-indigo-600 text-white border-none rounded-lg px-6 py-2.5 cursor-pointer font-medium text-sm hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <p className="text-gray-600">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            <>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-6">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <span className="text-sm">Loading more posts...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-400 text-sm py-4">You've reached the end</p>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Desktop */}
        <div className="hidden xl:flex flex-col gap-4 lg:gap-5">
          <UpcomingEvents />
          <Suggested />
        </div>
      </div>
    </div>
  );
}