import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/courses_grades/models/course_grades_model.dart';
import 'package:college_project/features/courses_grades/models/courses_response_model.dart';

class CoursesRepo {
  final api = ApiClient();

  Future<CoursesResponseModel> getCourses() async {
    try {
      final response = await api.get(Endpoints.studentCourses);
      return CoursesResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<CourseGradesModel> getCourseGrades(String courseId) async {
    try {
      final response = await api.get(Endpoints.courseGrades(courseId));
      return CourseGradesModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
