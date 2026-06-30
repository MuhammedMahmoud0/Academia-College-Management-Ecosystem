import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/community/models/community_response_model.dart';

class CommunityRepo {
  final api = ApiClient();

  Future<CommunityResponseModel> getFeed({int page = 1, int limit = 10}) async {
    try {
      final response = await api.get(
        Endpoints.community,
        queryParameters: {'page': page, 'limit': limit},
      );
      return CommunityResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<void> likePost(int postId) async {
    try {
      await api.post(Endpoints.communityPostLike(postId.toString()));
    } on ApiException {
      rethrow;
    }
  }

  Future<CommentModel> addComment(int postId, String content) async {
    try {
      final response = await api.post(
        Endpoints.communityPostComment(postId.toString()),
        data: {'content': content},
      );
      return CommentModel.fromJson(response.data['comment']);
    } on ApiException {
      rethrow;
    }
  }
}
