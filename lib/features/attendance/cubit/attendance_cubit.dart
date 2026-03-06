import 'package:college_project/features/attendance/cubit/attendance_states.dart';
import 'package:college_project/features/attendance/repo/attendance_repo.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AttendanceCubit extends Cubit<AttendanceStates> {
  AttendanceCubit() : super(AttendanceInitialState());

  final _repo = AttendanceRepo();

  Future<void> scanAttendance(String code) async {
    emit(AttendanceLoadingState());
    try {
      final attendance = await _repo.scanAttendance(code);
      if (attendance.error != null) {
        emit(AttendanceErrorState(error: attendance.error!));
      } else {
        emit(AttendanceLoadedState(attendance: attendance));
      }
    } catch (e) {
      emit(AttendanceErrorState(error: e.toString()));
    }
  }

  Future<void> getAttendanceHistory() async {
    emit(AttendanceLoadingState());
    try {
      final attendance = await _repo.getAttendanceHistory();
      emit(AttendanceHistoryLoadedState(attendance: attendance));
    } catch (e) {
      emit(AttendanceErrorState(error: e.toString()));
    }
  }
}
