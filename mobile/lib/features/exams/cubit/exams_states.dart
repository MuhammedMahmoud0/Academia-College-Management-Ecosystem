import 'package:college_project/features/exams/models/exams_response_model.dart';

abstract class ExamsStates {}

class ExamsInitialState extends ExamsStates {}

class ExamsLoadingState extends ExamsStates {}

class ExamsLoadedState extends ExamsStates {
  final ExamsResponseModel exams;

  ExamsLoadedState({required this.exams});
}

class ExamsErrorState extends ExamsStates {
  final String error;

  ExamsErrorState(this.error);
}

class ExamsRefreshingState extends ExamsStates {
  final ExamsResponseModel exams;

  ExamsRefreshingState({required this.exams});
}
