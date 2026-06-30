import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/student_schedule/models/schedule_response_model.dart';

class ScheduleRepo {
  final api = ApiClient();

  Future<ScheduleResponseModel> getSchedule() async {
    try {
      final response = await api.get(Endpoints.schedule);
      return ScheduleResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
