import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/exams/cubit/exams_states.dart';
import 'package:college_project/features/exams/models/exams_response_model.dart';
import 'package:college_project/features/exams/repo/exams_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ExamsCubit extends Cubit<ExamsStates> {
  ExamsCubit() : super(ExamsInitialState());

  static ExamsCubit get(BuildContext context) => BlocProvider.of(context);

  final ExamsRepo _examsRepo = ExamsRepo();

  ExamsResponseModel? examsData;

  Future<void> getExams() async {
    emit(ExamsLoadingState());
    try {
      examsData = await _examsRepo.getExams();
      emit(ExamsLoadedState(exams: examsData!));
    } on ApiException catch (e) {
      debugPrint('Get exams failed: $e');
      emit(ExamsErrorState(e.message));
    } catch (e) {
      debugPrint('Get exams failed: $e');
      emit(ExamsErrorState('Failed to load exams'));
    }
  }

  Future<void> refreshExams() async {
    if (examsData == null) {
      return getExams();
    }

    emit(ExamsRefreshingState(exams: examsData!));
    try {
      examsData = await _examsRepo.getExams();
      emit(ExamsLoadedState(exams: examsData!));
    } on ApiException catch (e) {
      debugPrint('Refresh exams failed: $e');
      emit(ExamsErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh exams failed: $e');
      emit(ExamsErrorState('Failed to refresh exams'));
    }
  }

  /// Get upcoming exams
  List<ExamModel> get upcomingExams {
    return examsData?.upcomingExams ?? [];
  }

  /// Get completed exams
  List<ExamModel> get completedExams {
    return examsData?.completedExams ?? [];
  }

  /// Get all exams
  List<ExamModel> get allExams {
    return examsData?.data ?? [];
  }
}
