import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/data/local/hive_storage_helper.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/auth/cubit/auth_states.dart';
import 'package:college_project/features/auth/repo/auth_repo.dart';
import 'package:college_project/features/home/models/student_profile_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthCubit extends Cubit<AuthState> {
  AuthCubit() : super(AuthInitial());

  final AuthRepo _authRepo = AuthRepo();
  final ApiClient _apiClient = ApiClient();
  final secureStorage = FlutterSecureStorage();

  Future<void> login({required String email, required String password}) async {
    emit(AuthLoading());
    try {
      final loginModel = await _authRepo.login(
        email: email,
        password: password,
      );
      if (loginModel.token != null) {
        await _saveTokenAndCredentials(
          token: loginModel.token!,
          email: email,
          password: password,
        );
        _apiClient.setToken(loginModel.token!);
        debugPrint('Login successful');

        await getStudentData();
      } else {
        emit(AuthError(loginModel.msg ?? 'Login failed'));
      }
    } on ApiException catch (e) {
      debugPrint(e.toString());
      emit(AuthError(e.message));
    } catch (e) {
      debugPrint(e.toString());
      emit(AuthError('An unexpected error occurred'));
    }
  }

  Future<void> _saveTokenAndCredentials({
    required String token,
    required String email,
    required String password,
  }) async {
    await secureStorage.write(key: 'token', value: token);
    await secureStorage.write(key: 'email', value: email);
    await secureStorage.write(key: 'password', value: password);
    // Set expiration time to 2 days from now
    final expirationTime = DateTime.now().add(const Duration(days: 2));
    await secureStorage.write(
      key: 'expirationTime',
      value: expirationTime.toIso8601String(),
    );
  }

  /// Refresh token using stored credentials
  Future<bool> refreshToken() async {
    try {
      final email = await secureStorage.read(key: 'email');
      final password = await secureStorage.read(key: 'password');

      if (email == null || password == null) {
        return false;
      }

      final loginModel = await _authRepo.login(
        email: email,
        password: password,
      );

      if (loginModel.token != null) {
        await _saveTokenAndCredentials(
          token: loginModel.token!,
          email: email,
          password: password,
        );
        _apiClient.setToken(loginModel.token!);
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Token refresh failed: $e');
      return false;
    }
  }

  /// Try to restore session from stored token
  Future<void> tryAutoLogin() async {
    emit(AuthLoading());
    try {
      final token = await secureStorage.read(key: 'token');
      if (token == null || token.isEmpty) {
        emit(AuthTokenExpired());
        return;
      }

      _apiClient.setToken(token);
      await getStudentData(rethrowApiException: true);
    } on ApiException catch (e) {
      // Check if token is invalid/expired
      if (e.message.contains('Authentication invalid') || e.statusCode == 401) {
        // Try to refresh token
        final refreshed = await refreshToken();
        if (refreshed) {
          await getStudentData();
        } else {
          emit(AuthTokenExpired());
        }
      } else {
        emit(AuthError(e.message));
      }
    } catch (e) {
      debugPrint('Auto login failed: $e');
      emit(AuthTokenExpired());
    }
  }

  Future<void> getStudentData({bool rethrowApiException = false}) async {
    try {
      final studentModel = await _authRepo.getStudentData();

      // Save student data in Hive for offline access
      final studentProfileModel = StudentProfileModel.fromStudentModel(
        studentModel,
      );
      await HiveStorageService.saveStudent(studentProfileModel);
      debugPrint('Student data saved to Hive successfully');

      // Also save to Constants for immediate use
      Constants.student = studentModel;

      emit(AuthSuccess());
    } on ApiException catch (e) {
      debugPrint('get student data failed: $e');
      if (rethrowApiException) {
        rethrow;
      }
      emit(AuthError(e.message));
    } catch (e) {
      debugPrint('get student data failed: $e');
      emit(AuthError(e.toString()));
    }
  }

  Future<void> logout() async {
    _apiClient.clearToken();
    await secureStorage.delete(key: 'token');
    await secureStorage.delete(key: 'email');
    await secureStorage.delete(key: 'password');
    await secureStorage.delete(key: 'expirationTime');

    // Clear Hive data on logout
    await HiveStorageService.clearAll();
    debugPrint('Logged out and cleared all data');

    emit(AuthInitial());
  }
}
