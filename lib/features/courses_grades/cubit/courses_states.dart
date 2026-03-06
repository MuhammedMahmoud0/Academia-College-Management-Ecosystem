import 'package:college_project/features/courses_grades/models/courses_response_model.dart';

abstract class CoursesStates {}

class CoursesInitialState extends CoursesStates {}

class CoursesLoadingState extends CoursesStates {}

class CoursesLoadedState extends CoursesStates {
  final CoursesResponseModel courses;

  CoursesLoadedState({required this.courses});
}

class CoursesErrorState extends CoursesStates {
  final String error;

  CoursesErrorState(this.error);
}

class CoursesRefreshingState extends CoursesStates {
  final CoursesResponseModel courses;

  CoursesRefreshingState({required this.courses});
}
