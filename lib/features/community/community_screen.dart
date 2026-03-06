import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/cubit/community_cubit.dart';
import 'package:college_project/features/community/cubit/community_states.dart';
import 'package:college_project/features/community/widgets/comments_bottom_sheet.dart';
import 'package:college_project/features/community/widgets/post_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CommunityCubit()..getFeed(),
      child: const _CommunityScreenView(),
    );
  }
}

class _CommunityScreenView extends StatefulWidget {
  const _CommunityScreenView();

  @override
  State<_CommunityScreenView> createState() => _CommunityScreenViewState();
}

class _CommunityScreenViewState extends State<_CommunityScreenView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isBottom) {
      context.read<CommunityCubit>().loadMore();
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    return currentScroll >= (maxScroll * 0.9);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      backgroundColor: AppColors.getBackground(isDark),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(isDark),
        centerTitle: false,
        title: Text(
          'Community',
          style: TextStyle(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () => context.push(AppRoutes.groupsScreen),
            icon: Icon(
              Icons.group_add_rounded,
              color: AppColors.getTextColor(isDark),
            ),
          ),
          /*
          IconButton(
            onPressed: () {},
            icon: Icon(
              Icons.notifications_outlined,
              color: AppColors.getTextColor(isDark),
            ),
          ),
       */
        ],
      ),
      /*
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.primaryColor,
        child: const Icon(Icons.add_rounded, color: Colors.white),
      ),
     */
      body: BlocBuilder<CommunityCubit, CommunityStates>(
        builder: (context, state) {
          if (state is CommunityLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is CommunityErrorState) {
            return _buildErrorState(state.error, isDark, context);
          }

          if (state is CommunityLoadedState ||
              state is CommunityLoadingMoreState ||
              state is CommunityRefreshingState) {
            return _buildFeedContent(context, isDark, state);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildErrorState(String error, bool isDark, BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.read<CommunityCubit>().getFeed(),
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedContent(
    BuildContext context,
    bool isDark,
    CommunityStates state,
  ) {
    final cubit = context.read<CommunityCubit>();
    final posts = cubit.posts;
    final isLoadingMore = state is CommunityLoadingMoreState;

    if (posts.isEmpty) {
      return _buildEmptyState(isDark);
    }

    return RefreshIndicator(
      onRefresh: () => cubit.refreshFeed(),
      color: AppColors.primaryColor,
      child: ListView.builder(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        itemCount: posts.length + (isLoadingMore || cubit.hasMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index >= posts.length) {
            return _buildLoadingIndicator(isDark);
          }

          final post = posts[index];
          return PostCard(
            post: post,
            isDark: isDark,
            onLike: () => cubit.toggleLike(post.id),
            onComment: () =>
                CommentsBottomSheet.show(context, post, cubit, isDark),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.forum_outlined,
            size: 64,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Text(
            'No posts yet',
            style: TextStyle(
              color: AppColors.getTextColor(isDark),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Be the first to share something!',
            style: TextStyle(
              color: AppColors.getSubtitleColor(isDark),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingIndicator(bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Center(
        child: SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            color: AppColors.primaryColor,
          ),
        ),
      ),
    );
  }
}
