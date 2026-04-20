import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileCard from './ProfileCard';
import Navigation from './Navigation';
import PostCard from './PostCard';
import { getGroupPosts } from '../../../services/communityService';

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

function mapGroupPost(post, index) {
	const authorName = post?.users?.full_name ?? post?.author_name ?? 'Unknown';
	const authorAvatar = post?.users?.avatar_url ?? post?.author_avatar ?? null;
	const isValidAvatarUrl =
		authorAvatar && (authorAvatar.startsWith('http://') || authorAvatar.startsWith('https://'));

	return {
		id: post?.id ?? `group-post-${index}-${Date.now()}`,
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

export default function GroupPosts() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [posts, setPosts] = useState([]);
	const [group, setGroup] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const sentinelRef = useRef(null);
	const pageRef = useRef(1);
	const hasMoreRef = useRef(false);
	const loadingMoreRef = useRef(false);

	const PAGE_SIZE = 10;

	const resolvedGroupName = useMemo(() => {
		return group?.name || posts?.[0]?.groupName || 'Group';
	}, [group?.name, posts]);

	const fetchPosts = async (requestedPage = 1) => {
		if (!groupId) return;

		try {
			if (requestedPage === 1) {
				setLoading(true);
			} else {
				setLoadingMore(true);
				loadingMoreRef.current = true;
			}

			const data = await getGroupPosts(groupId, requestedPage, PAGE_SIZE);
			const mappedPosts = (data?.posts ?? []).map((post, index) => mapGroupPost(post, index));

			setGroup(data?.group ?? data?.community_groups ?? null);
			setPosts((prev) => (requestedPage === 1 ? mappedPosts : [...prev, ...mappedPosts]));
			setPage(requestedPage);
			pageRef.current = requestedPage;
			const more = mappedPosts.length === PAGE_SIZE;
			setHasMore(more);
			hasMoreRef.current = more;
			setError('');
		} catch (err) {
			console.error('Error fetching group posts:', err);
			if (err?.response?.status === 404) {
				setError('Group not found.');
			} else if (err?.response?.status === 403) {
				setError('You are not allowed to view this group posts feed.');
			} else if (err?.response?.status === 401) {
				setError('Your session expired. Please login again.');
			} else {
				setError('Failed to load group posts. Please try again.');
			}
		} finally {
			setLoading(false);
			setLoadingMore(false);
			loadingMoreRef.current = false;
		}
	};

	const loadMore = useCallback(() => {
		if (!loadingMoreRef.current && hasMoreRef.current) {
			fetchPosts(pageRef.current + 1);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Infinite scroll via IntersectionObserver
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

	useEffect(() => {
		fetchPosts(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	return (
		<div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
			<div className="flex items-center justify-between gap-3 mb-5">
				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate('/dashboard/my-groups')}
						className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
						aria-label="Back to my groups"
					>
						<ArrowBackIcon className="text-gray-700" />
					</button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{resolvedGroupName} Posts</h1>
						<p className="text-sm text-gray-600">Latest posts from this group community.</p>
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
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
						</div>
					) : error ? (
						<div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					) : posts.length === 0 ? (
						<div className="bg-white rounded-xl p-6 shadow-sm">
							<p className="text-sm text-gray-500">No posts in this group yet.</p>
						</div>
					) : (
						<>
							{posts.map((post) => (
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
			</div>
		</div>
	);
}
