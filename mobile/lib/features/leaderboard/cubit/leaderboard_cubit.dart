import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/leaderboard/cubit/leaderboard_states.dart';
import 'package:college_project/features/leaderboard/repo/leaderboard_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class LeaderboardCubit extends Cubit<LeaderboardState> {
  LeaderboardCubit() : super(LeaderboardInitial());

  final LeaderboardRepo _leaderboardRepo = LeaderboardRepo();

  Future<void> getLeaderboard({
    String? level,
    String? department,
    int? limit,
  }) async {
    emit(LeaderboardLoading());
    try {
      final response = await _leaderboardRepo.getLeaderboard(
        level: level,
        department: department,
        limit: limit,
      );
      emit(LeaderboardSuccess(response));
    } on ApiException catch (e) {
      debugPrint('Leaderboard fetch failed: $e');
      emit(LeaderboardError(e.message));
    } catch (e) {
      debugPrint('Leaderboard fetch failed: $e');
      emit(LeaderboardError('An unexpected error occurred'));
    }
  }
}
