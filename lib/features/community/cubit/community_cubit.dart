import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/community/cubit/community_states.dart';
import 'package:college_project/features/community/models/community_response_model.dart';
import 'package:college_project/features/community/repo/community_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CommunityCubit extends Cubit<CommunityStates> {
  CommunityCubit() : super(CommunityInitialState());

  static CommunityCubit get(BuildContext context) => BlocProvider.of(context);

  final CommunityRepo _communityRepo = CommunityRepo();

  List<PostModel> _posts = [];
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMore = true;

  List<PostModel> get posts => _posts;
  bool get hasMore => _hasMore;

  Future<void> getFeed() async {
    emit(CommunityLoadingState());
    _currentPage = 1;
    _hasMore = true;

    try {
      final response = await _communityRepo.getFeed(
        page: _currentPage,
        limit: _limit,
      );
      _posts = response.sortedPosts;
      _hasMore = response.posts.length >= _limit;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    } on ApiException catch (e) {
      debugPrint('Get feed failed: $e');
      emit(CommunityErrorState(e.message));
    } catch (e) {
      debugPrint('Get feed failed: $e');
      emit(CommunityErrorState('Failed to load feed'));
    }
  }

  Future<void> loadMore() async {
    if (!_hasMore || state is CommunityLoadingMoreState) return;

    emit(CommunityLoadingMoreState(posts: _posts));
    _currentPage++;

    try {
      final response = await _communityRepo.getFeed(
        page: _currentPage,
        limit: _limit,
      );
      final newPosts = response.sortedPosts;
      _posts = [..._posts, ...newPosts];
      _hasMore = newPosts.length >= _limit;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    } on ApiException catch (e) {
      debugPrint('Load more failed: $e');
      _currentPage--;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    } catch (e) {
      debugPrint('Load more failed: $e');
      _currentPage--;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    }
  }

  Future<void> refreshFeed() async {
    if (_posts.isEmpty) {
      return getFeed();
    }

    emit(CommunityRefreshingState(posts: _posts));
    _currentPage = 1;

    try {
      final response = await _communityRepo.getFeed(
        page: _currentPage,
        limit: _limit,
      );
      _posts = response.sortedPosts;
      _hasMore = response.posts.length >= _limit;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    } on ApiException catch (e) {
      debugPrint('Refresh feed failed: $e');
      emit(CommunityErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh feed failed: $e');
      emit(CommunityErrorState('Failed to refresh feed'));
    }
  }

  /// Toggle like on a post - optimistic update
  Future<void> toggleLike(int postId) async {
    final postIndex = _posts.indexWhere((p) => p.id == postId);
    if (postIndex == -1) return;

    final post = _posts[postIndex];
    final wasLiked = post.isLiked;

    // Optimistic update
    _posts[postIndex] = post.copyWith(
      isLiked: !wasLiked,
      likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
    );
    emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));

    try {
      await _communityRepo.likePost(postId);
    } catch (e) {
      // Revert on failure
      debugPrint('Like failed: $e');
      _posts[postIndex] = post;
      emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
    }
  }

  /// Get comments for a post sorted by date descending
  List<CommentModel> getComments(int postId) {
    final postIndex = _posts.indexWhere((p) => p.id == postId);
    if (postIndex == -1) return [];

    final comments = List<CommentModel>.from(_posts[postIndex].postComments);
    comments.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return comments;
  }

  /// Add a comment to a post
  Future<CommentModel?> addComment(int postId, String content) async {
    try {
      final newComment = await _communityRepo.addComment(postId, content);

      // Update the post's comment count and recent comments
      final postIndex = _posts.indexWhere((p) => p.id == postId);
      if (postIndex != -1) {
        final post = _posts[postIndex];
        final updatedComments = [newComment, ...post.recentComments];
        _posts[postIndex] = post.copyWith(
          commentsCount: post.commentsCount + 1,
          recentComments: updatedComments,
        );
        emit(CommunityLoadedState(posts: _posts, hasMore: _hasMore));
      }

      return newComment;
    } on ApiException catch (e) {
      debugPrint('Add comment failed: $e');
      return null;
    } catch (e) {
      debugPrint('Add comment failed: $e');
      return null;
    }
  }
}
