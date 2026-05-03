import 'dart:io';

import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:dio/dio.dart';

class ProfileRepo {
  final ApiClient _api = ApiClient();
  /*
  Future<Map<String, dynamic>> updateProfile({
    required String name,
    required String phone,
    required String address,
    required String nationalId,
    File? image,
  }) async {
    try {
      final Map<String, dynamic> data = {
        'full_name': name,
        'phone': phone,
        'address': address,
        'national_id': nationalId,
      };

      if (image != null) {
        final fileName = image.path.split('/').last;
        data['avatar'] = await MultipartFile.fromFile(
          image.path,
          filename: fileName,
        );

        final formData = FormData.fromMap(data);
        final response = await _api.uploadFile(
          Endpoints.editProfile,
          formData: formData,
        );
        return response.data as Map<String, dynamic>;
      } else {
        final response = await _api.put(Endpoints.editProfile, data: data);
        return response.data as Map<String, dynamic>;
      }
    } on ApiException {
      rethrow;
    }
  }
*/
  Future<Map<String, dynamic>> updateProfile({
    required String name,
    required String phone,
    required String address,
    required String nationalId,
    File? image,
  }) async {
    try {
      final formData = FormData.fromMap({
        'full_name': name,
        'phone': phone,
        'address': address,

        // 'national_id': nationalId,
        if (image != null)
          'avatar': await MultipartFile.fromFile(
            image.path,
            filename: image.path.split('/').last,
          ),
      });

      final response = await _api.put(Endpoints.editProfile, data: formData);

      return response.data as Map<String, dynamic>;
    } on ApiException {
      rethrow;
    }
  }
}
