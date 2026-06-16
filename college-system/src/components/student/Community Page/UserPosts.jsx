import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProfileCard from './ProfileCard';
import Navigation from './Navigation';
import PostCard from './PostCard';
import { getUserPosts } from '../../../services/communityService';

function getInitials(name) {
	if (!name) return 'U';
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

function formatTime(dateString) {
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
}

function getRandomColor(index) {
	const colors = ['#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];
	return colors[index % colors.length];
}

function mapUserPost(post, index) {
	const authorName = post?.users?.full_name ?? post?.author_name ?? 'Unknown';
	const authorAvatar = post?.users?.avatar_url ?? post?.author_avatar ?? null;
	const isValidAvatarUrl =
		authorAvatar && (authorAvatar.startsWith('http://') || authorAvatar.startsWith('https://'));

	return {
		id: post?.id ?? `user-post-${index}-${Date.now()}`,
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
		bgColor: getRandomColor(index),
		groupName: post?.community_groups?.name ?? post?.group_name ?? null,
		groupId: post?.group_id ?? post?.community_groups?.id ?? null,
		isLikedByMe: post?.is_liked_by_me ?? false,
		recentComments: (post?.recent_comments ?? post?.post_comments ?? []).map((comment) => ({
			id: comment.id,
			content: comment.content,
			created_at: comment.created_at,
			author_name: comment.author_name ?? comment?.users?.full_name ?? 'Unknown',
			author_avatar: comment.author_avatar ?? comment?.users?.avatar_url ?? null,
		})),
	};
}

export default function UserPosts() {
	const navigate = useNavigate();
	const { userId } = useParams();
	const [posts, setPosts] = useState([]);
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);

	const resolvedUserName = useMemo(() => {
		return userInfo?.full_name || posts?.[0]?.author || 'User';
	}, [userInfo?.full_name, posts]);

	const resolvedUserAvatar = useMemo(() => {
		const url = userInfo?.avatar_url || posts?.[0]?.author_avatar || null;
		if (url && (url.startsWith('http://') || url.startsWith('https://'))) return url;
		return null;
	}, [userInfo?.avatar_url, posts]);

	const fetchPosts = async (requestedPage = 1) => {
		if (!userId) return;

		try {
			if (requestedPage === 1) {
				setLoading(true);
			} else {
				setLoadingMore(true);
			}

			const data = await getUserPosts(userId, requestedPage, 10);
			const mappedPosts = (data?.posts ?? []).map((post, index) => mapUserPost(post, index));

			if (data?.user) {
				setUserInfo(data.user);
			}

			setPosts((prev) => (requestedPage === 1 ? mappedPosts : [...prev, ...mappedPosts]));
			setPage(requestedPage);
			setHasMore(mappedPosts.length === 10);
			setError('');
		} catch (err) {
			console.error('Error fetching user posts:', err);
			if (err?.response?.status === 404) {
				setError('User not found.');
			} else if (err?.response?.status === 403) {
				setError('You are not allowed to view this user\'s posts.');
			} else if (err?.response?.status === 401) {
				setError('Your session expired. Please login again.');
			} else {
				setError('Failed to load user posts. Please try again.');
			}
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchPosts(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	return (
		<div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
			<div className="flex items-center justify-between gap-3 mb-5">
				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate('/dashboard/community')}
						className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
						aria-label="Back to community"
					>
						<ArrowBackIcon className="text-gray-700" />
					</button>
					<div className="flex items-center gap-3">
						{/* User Avatar */}
						{resolvedUserAvatar ? (
							<img
								src={resolvedUserAvatar}
								alt={resolvedUserName}
								className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
							/>
						) : (
							<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
								{getInitials(resolvedUserName)}
							</div>
						)}
						<div>
							<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
								{resolvedUserName}'s Posts
							</h1>
							<p className="text-xs sm:text-sm text-gray-500">
								{!loading && !error && (
									<>
										{posts.length} {posts.length === 1 ? 'post' : 'posts'} found
									</>
								)}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-5">
				<div className="hidden lg:flex flex-col gap-4 lg:gap-5">
					<ProfileCard />
					<Navigation />
				</div>

				<div className="flex flex-col gap-4 lg:gap-5">
					{loading ? (
						<div className="bg-white rounded-xl p-8 shadow-sm">
							<div className="flex justify-center items-center py-8">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
							</div>
							<p className="text-center text-gray-500 text-sm mt-2">Loading posts...</p>
						</div>
					) : error ? (
						<div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
							<div className="text-center">
								<div className="text-4xl mb-3">😕</div>
								<p className="text-sm text-red-600 mb-4">{error}</p>
								<button
									onClick={() => fetchPosts(1)}
									className="bg-indigo-600 text-white border-none rounded-lg px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
								>
									Try Again
								</button>
							</div>
						</div>
					) : posts.length === 0 ? (
						<div className="bg-white rounded-xl p-8 shadow-sm">
							<div className="text-center">
								<div className="text-4xl mb-3">📝</div>
								<p className="text-sm text-gray-500">This user hasn't posted anything yet.</p>
							</div>
						</div>
					) : (
						<>
							{posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}

							{hasMore ? (
								<div className="flex justify-center py-2">
									<button
										onClick={() => fetchPosts(page + 1)}
										disabled={loadingMore}
										className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed cursor-pointer"
									>
										{loadingMore ? 'Loading...' : 'Load More'}
									</button>
								</div>
							) : posts.length > 0 ? (
								<p className="text-center text-xs text-gray-400 py-2">No more posts to show</p>
							) : null}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
