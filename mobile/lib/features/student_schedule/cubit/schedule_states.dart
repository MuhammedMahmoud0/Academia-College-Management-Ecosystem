import 'package:college_project/features/student_schedule/models/schedule_response_model.dart';

abstract class ScheduleStates {}

class ScheduleInitialState extends ScheduleStates {}

class ScheduleLoadingState extends ScheduleStates {}

class ScheduleLoadedState extends ScheduleStates {
  final ScheduleResponseModel schedule;

  ScheduleLoadedState({required this.schedule});
}

class ScheduleErrorState extends ScheduleStates {
  final String error;

  ScheduleErrorState(this.error);
}

class ScheduleRefreshingState extends ScheduleStates {
  final ScheduleResponseModel schedule;

  ScheduleRefreshingState({required this.schedule});
}
