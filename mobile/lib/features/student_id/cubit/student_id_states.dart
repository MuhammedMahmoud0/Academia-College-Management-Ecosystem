import 'package:college_project/features/student_id/models/student_id_back_model.dart';
import 'package:college_project/features/student_id/models/student_id_front_model.dart';

class StudentIdStates {}

class StudentIdInitial extends StudentIdStates {}

class StudentIdLoading extends StudentIdStates {}

class StudentIdLoaded extends StudentIdStates {
  final StudentIdFrontModel front;
  final StudentIdBackModel back;

  StudentIdLoaded({required this.front, required this.back});
}

class StudentIdError extends StudentIdStates {
  final String error;
  StudentIdError(this.error);
}
