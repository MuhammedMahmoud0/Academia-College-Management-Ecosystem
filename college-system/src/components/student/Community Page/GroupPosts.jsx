import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
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
			}

			const data = await getGroupPosts(groupId, requestedPage, 10);
			const mappedPosts = (data?.posts ?? []).map((post, index) => mapGroupPost(post, index));

			setGroup(data?.group ?? data?.community_groups ?? null);
			setPosts((prev) => (requestedPage === 1 ? mappedPosts : [...prev, ...mappedPosts]));
			setPage(requestedPage);
			setHasMore(mappedPosts.length === 10);
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
		}
	};

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
				<button
					onClick={() => fetchPosts(1)}
					className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
				>
					<RefreshIcon fontSize="small" />
					Refresh
				</button>
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

							{hasMore ? (
								<div className="flex justify-center">
									<button
										onClick={() => fetchPosts(page + 1)}
										disabled={loadingMore}
										className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
									>
										{loadingMore ? 'Loading...' : 'Load more'}
									</button>
								</div>
							) : null}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
