import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/leaderboard/models/leaderboard_response_model.dart';

class LeaderboardRepo {
  final api = ApiClient();

  Future<LeaderboardResponseModel> getLeaderboard({
    String? level,
    String? department,
    int? limit,
  }) async {
    try {
      final Map<String, dynamic> queryParams = {};

      if (level != null && level.isNotEmpty) {
        queryParams['level'] = level;
      }
      if (department != null && department.isNotEmpty) {
        queryParams['department'] = department;
      }
      if (limit != null) {
        queryParams['limit'] = limit;
      }

      final response = await api.get(
        Endpoints.leaderBoard,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      return LeaderboardResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
