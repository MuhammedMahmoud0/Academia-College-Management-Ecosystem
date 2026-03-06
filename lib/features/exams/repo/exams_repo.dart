import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/exams/models/exams_response_model.dart';

class ExamsRepo {
  final api = ApiClient();

  Future<ExamsResponseModel> getExams() async {
    try {
      final response = await api.get(Endpoints.examsSchedule);
      return ExamsResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
