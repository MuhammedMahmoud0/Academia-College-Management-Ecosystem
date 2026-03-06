import 'package:college_project/features/attendance/model/attendance_model.dart';

class AttendanceStates {}

class AttendanceInitialState extends AttendanceStates {}

class AttendanceLoadingState extends AttendanceStates {}

class AttendanceLoadedState extends AttendanceStates {
  AttendanceModel attendance;

  AttendanceLoadedState({required this.attendance});
}

class AttendanceHistoryLoadedState extends AttendanceStates {
  final List<AttendanceModel> attendance;

  AttendanceHistoryLoadedState({required this.attendance});
}

class AttendanceErrorState extends AttendanceStates {
  final String error;

  AttendanceErrorState({required this.error});
}
