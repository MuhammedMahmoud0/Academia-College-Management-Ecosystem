import 'dart:io';

import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/auth/login/models/login_model.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:flutter/material.dart';

class AuthRepo {
  final api = ApiClient();
  Future<LoginModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await api.post(
        Endpoints.login,
        data: {'email': email, 'password': password},
      );
      return LoginModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<LoginModel> refreshToken() async {
    try {
      final response = await api.post(Endpoints.refreshToken);
      return LoginModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<StudentModel> getStudentData() async {
    try {
      final response = await api.get(Endpoints.profile);
      return StudentModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<void> updateFCMToken(String fcmToken) async {
    try {
      final response = await api.post(
        Endpoints.registerDevice,
        data: {
          'fcmToken': fcmToken,
          'platform': Platform.isAndroid ? 'Android' : 'iOS',
        },
      );
      if (response.statusCode == 200) {
        debugPrint('FCM token updated successfully');
      }
    } on ApiException catch (e) {
      debugPrint('Failed to update FCM token: $e');
    }
  }
}
