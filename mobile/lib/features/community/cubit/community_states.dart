import 'package:college_project/features/community/models/community_response_model.dart';

abstract class CommunityStates {}

class CommunityInitialState extends CommunityStates {}

class CommunityLoadingState extends CommunityStates {}

class CommunityLoadedState extends CommunityStates {
  final List<PostModel> posts;
  final bool hasMore;

  CommunityLoadedState({
    required this.posts,
    required this.hasMore,
  });
}

class CommunityErrorState extends CommunityStates {
  final String error;

  CommunityErrorState(this.error);
}

class CommunityLoadingMoreState extends CommunityStates {
  final List<PostModel> posts;

  CommunityLoadingMoreState({required this.posts});
}

class CommunityRefreshingState extends CommunityStates {
  final List<PostModel> posts;

  CommunityRefreshingState({required this.posts});
}
