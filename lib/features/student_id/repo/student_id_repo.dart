import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/features/student_id/models/student_id_back_model.dart';
import 'package:college_project/features/student_id/models/student_id_front_model.dart';

class StudentIdRepo {
  final ApiClient _apiService;

  StudentIdRepo(this._apiService);

  Future<StudentIdFrontModel> getStudentIdFront() async {
    final response = await _apiService.get(Endpoints.digitalIdFront);
    return StudentIdFrontModel.fromJson(response.data);
  }

  Future<StudentIdBackModel> getStudentIdBack() async {
    final response = await _apiService.get(Endpoints.digitalIdBack);
    return StudentIdBackModel.fromJson(response.data);
  }
}
