import 'package:college_project/features/leaderboard/models/leaderboard_response_model.dart';

class LeaderboardState {}

class LeaderboardInitial extends LeaderboardState {}

class LeaderboardLoading extends LeaderboardState {}

class LeaderboardSuccess extends LeaderboardState {
  final LeaderboardResponseModel data;

  LeaderboardSuccess(this.data);
}

class LeaderboardError extends LeaderboardState {
  final String message;

  LeaderboardError(this.message);
}
