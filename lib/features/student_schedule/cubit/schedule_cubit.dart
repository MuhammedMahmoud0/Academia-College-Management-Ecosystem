import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/student_schedule/cubit/schedule_states.dart';
import 'package:college_project/features/student_schedule/models/schedule_response_model.dart';
import 'package:college_project/features/student_schedule/repo/schedule_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ScheduleCubit extends Cubit<ScheduleStates> {
  ScheduleCubit() : super(ScheduleInitialState());

  static ScheduleCubit get(BuildContext context) => BlocProvider.of(context);

  final ScheduleRepo _scheduleRepo = ScheduleRepo();

  ScheduleResponseModel? scheduleData;

  Future<void> getSchedule() async {
    emit(ScheduleLoadingState());
    try {
      scheduleData = await _scheduleRepo.getSchedule();
      emit(ScheduleLoadedState(schedule: scheduleData!));
    } on ApiException catch (e) {
      debugPrint('Get schedule failed: $e');
      emit(ScheduleErrorState(e.message));
    } catch (e) {
      debugPrint('Get schedule failed: $e');
      emit(ScheduleErrorState('Failed to load schedule'));
    }
  }

  Future<void> refreshSchedule() async {
    if (scheduleData == null) {
      return getSchedule();
    }

    emit(ScheduleRefreshingState(schedule: scheduleData!));
    try {
      scheduleData = await _scheduleRepo.getSchedule();
      emit(ScheduleLoadedState(schedule: scheduleData!));
    } on ApiException catch (e) {
      debugPrint('Refresh schedule failed: $e');
      emit(ScheduleErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh schedule failed: $e');
      emit(ScheduleErrorState('Failed to refresh schedule'));
    }
  }

  /// Get classes for a specific day index
  List<ScheduleClassModel> getClassesForDay(int dayIndex) {
    if (scheduleData == null ||
        dayIndex < 0 ||
        dayIndex >= scheduleData!.schedule.length) {
      return [];
    }
    return scheduleData!.schedule[dayIndex].classes;
  }

  /// Get day info for a specific index
  ScheduleDayModel? getDayInfo(int dayIndex) {
    if (scheduleData == null ||
        dayIndex < 0 ||
        dayIndex >= scheduleData!.schedule.length) {
      return null;
    }
    return scheduleData!.schedule[dayIndex];
  }
}
