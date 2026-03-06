import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:flutter/material.dart';

class RegistrationRepo {
  final api = ApiClient();

  /// Get available course offerings for registration
  Future<RegistrationResponseModel> getAvailableOfferings() async {
    try {
      final response = await api.get(Endpoints.availableOfferings);
      return RegistrationResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  /// Register for courses (lectures and labs)
  /// [lectureIds] - List of lecture IDs to register
  /// [labIds] - List of lab IDs to register
  Future<void> registerCourses({
    required List<int> lectureIds,
    required List<int> labIds,
  }) async {
    try {
      await api.post(
        Endpoints.registerCourse,
        data: {'selectedLectureIds': lectureIds, 'selectedLabIds': labIds},
      );
    } on ApiException {
      rethrow;
    }
  }

  /// Re-register for a different lab (change lab group)
  /// [lectureId] - The lecture ID of the course
  /// [labId] - The new lab ID to register
  Future<void> reregisterLab({
    required int lectureId,
    required int labId,
    required int oldLabId,
  }) async {
    try {
      await dropCourse(labId: oldLabId);
      await api.post(
        Endpoints.registerLab,
        data: {'lectureId': lectureId, 'labId': labId},
      );
      debugPrint('Lab reregistered successfully');
    } on ApiException {
      rethrow;
    }
  }

  /// Unregister/drop a course
  /// [lectureId] - The lecture ID to unregister
  Future<void> dropCourse({int? lectureId, int? labId}) async {
    try {
      await api.delete(
        Endpoints.dropCourse,
        data: {'lectureId': lectureId, 'tutorialLabId': labId},
      );
      debugPrint('Lab dropped successfully');
    } on ApiException {
      rethrow;
    }
  }
}
