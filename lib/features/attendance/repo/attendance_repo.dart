import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/features/attendance/model/active_sessions_model.dart';
import 'package:college_project/features/attendance/model/attendance_history_model.dart';
import 'package:college_project/features/attendance/model/attendance_model.dart';

class AttendanceRepo {
  final _api = ApiClient();

  Future<AttendanceModel> scanAttendance(String code) async {
    final response = await _api.post(
      Endpoints.scanAttendance,
      data: {"qrCode": code},
    );
    return AttendanceModel.fromJson(response.data);
  }

  Future<AttendanceHistoryResponseModel> getAttendanceHistory() async {
    final response = await _api.get(Endpoints.attendanceHistory);
    return AttendanceHistoryResponseModel.fromJson(response.data);
  }

  Future<ActiveSessionsResponseModel> getAttendanceActiveSession() async {
    final response = await _api.get(Endpoints.attendanceActiveSession);
    return ActiveSessionsResponseModel.fromJson(response.data);
  }
}
