import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/courses_grades/cubit/courses_states.dart';
import 'package:college_project/features/courses_grades/models/course_grades_model.dart';
import 'package:college_project/features/courses_grades/models/courses_response_model.dart';
import 'package:college_project/features/courses_grades/repo/courses_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CoursesCubit extends Cubit<CoursesStates> {
  CoursesCubit() : super(CoursesInitialState());

  static CoursesCubit get(BuildContext context) => BlocProvider.of(context);

  final CoursesRepo _coursesRepo = CoursesRepo();

  CoursesResponseModel? coursesData;
  CourseGradesModel? selectedCourseGrades;

  Future<void> getCourses() async {
    emit(CoursesLoadingState());
    try {
      coursesData = await _coursesRepo.getCourses();
      emit(CoursesLoadedState(courses: coursesData!));
    } on ApiException catch (e) {
      debugPrint('Get courses failed: $e');
      emit(CoursesErrorState(e.message));
    } catch (e) {
      debugPrint('Get courses failed: $e');
      emit(CoursesErrorState('Failed to load courses'));
    }
  }

  Future<void> refreshCourses() async {
    if (coursesData == null) {
      return getCourses();
    }

    emit(CoursesRefreshingState(courses: coursesData!));
    try {
      coursesData = await _coursesRepo.getCourses();
      emit(CoursesLoadedState(courses: coursesData!));
    } on ApiException catch (e) {
      debugPrint('Refresh courses failed: $e');
      emit(CoursesErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh courses failed: $e');
      emit(CoursesErrorState('Failed to refresh courses'));
    }
  }

  /// Get courses grouped by semester (latest first)
  Map<String, List<CourseModel>> get coursesGroupedBySemester {
    return coursesData?.coursesGroupedBySemester ?? {};
  }

  /// Get cumulative GPA
  double get cumulativeGPA => coursesData?.cumulativeGPA ?? 0.0;

  /// Get total credits
  int get totalCredits => coursesData?.totalCredits ?? 0;

  /// Get current semester
  String get currentSemester => coursesData?.currentSemester ?? 'N/A';

  /// Get all courses
  List<CourseModel> get allCourses => coursesData?.courses ?? [];

  /// Get course grades by courseId
  Future<CourseGradesModel?> getCourseGrades(String courseId) async {
    try {
      selectedCourseGrades = await _coursesRepo.getCourseGrades(courseId);
      return selectedCourseGrades;
    } on ApiException catch (e) {
      debugPrint('Get course grades failed: $e');
      return null;
    } catch (e) {
      debugPrint('Get course grades failed: $e');
      return null;
    }
  }
}
