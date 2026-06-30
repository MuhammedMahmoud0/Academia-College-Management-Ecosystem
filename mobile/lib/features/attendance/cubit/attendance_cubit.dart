import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/features/attendance/cubit/attendance_states.dart';
import 'package:college_project/features/attendance/repo/attendance_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';

class AttendanceCubit extends Cubit<AttendanceStates> {
  AttendanceCubit() : super(AttendanceInitialState());

  final _repo = AttendanceRepo();

  Future<void> scanAttendance(String code) async {
    emit(AttendanceScanningState());
    try {
      final attendance = await _repo.scanAttendance(code);
      if (attendance.error != null) {
        emit(AttendanceErrorState(error: attendance.error!));
      } else {
        debugPrint("Attendance: $attendance");
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

  Future<void> getActiveSessions() async {
    emit(AttendanceLoadingState());
    try {
      final attendance = await _repo.getAttendanceActiveSession();
      if (attendance.error != null) {
        emit(AttendanceErrorState(error: attendance.error!));
        return;
      }

      if (attendance.sessions!.isEmpty) {
        emit(AttendanceErrorState(error: "No active sessions found"));
        return;
      }

      final session = attendance.sessions!.first;

      if (!(session.isLive ?? false)) {
        final position = await _getCurrentLocation();
        if (position == null) {
          emit(AttendanceErrorState(error: "Could not get your location"));
          return;
        }
        debugPrint("Position: ${position.latitude}");
        debugPrint("Position: ${position.longitude}");
        final distanceInMeters = Geolocator.distanceBetween(
          position.latitude,
          position.longitude,

          session.latitude ?? 0.0,
          session.longitude ?? 0.0,
        );

        if (distanceInMeters > Constants.availableMeters) {
          emit(
            AttendanceErrorState(
              error:
                  "You must be within ${Constants.availableMeters} meters of the session location",
            ),
          );
          return;
        }
      }

      emit(AttendanceActiveSessionsLoadedState());
    } catch (e) {
      emit(AttendanceErrorState(error: e.toString()));
    }
  }

  Future<Position?> _getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return null;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return null;
    }

    if (permission == LocationPermission.deniedForever) return null;

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}
