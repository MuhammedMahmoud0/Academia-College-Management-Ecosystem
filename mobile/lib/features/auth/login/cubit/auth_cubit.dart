import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/data/local/hive_storage_helper.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/auth/login/cubit/auth_states.dart';
import 'package:college_project/features/auth/login/repo/auth_repo.dart';
import 'package:college_project/features/home/models/student_profile_model.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthCubit extends Cubit<AuthState> {
  AuthCubit() : super(AuthInitial()) {
    // The ApiClient's 401 interceptor refreshes the access token on demand and
    // silently retries the failed request. We only need to (a) persist the
    // refreshed token and (b) surface a logged-out state if the refresh itself
    // fails — no periodic timer required.
    _apiClient.addTokenRefreshedListener(_persistRefreshedToken);
    _apiClient.onRefreshFailed = () {
      debugPrint('Refresh failed — session expired');
      emit(AuthTokenExpired());
    };
  }

  void _persistRefreshedToken(String newToken) async {
    await secureStorage.write(key: 'token', value: newToken);
    debugPrint('Access token refreshed and persisted');
  }

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

        // notifications
        await FirebaseMessaging.instance.requestPermission();
        String? newPushToken = await FirebaseMessaging.instance.getToken();

        if (newPushToken != null) {
          debugPrint('Push token: $newPushToken');
          await _authRepo.updateFCMToken(newPushToken);
        }
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
    final expirationTime = DateTime.now().add(const Duration(days: 3));
    await secureStorage.write(
      key: 'expirationTime',
      value: expirationTime.toIso8601String(),
    );
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
      // The ApiClient's 401 interceptor will transparently refresh + retry
      // if the stored token has expired.
      await getStudentData(rethrowApiException: true);
    } on ApiException catch (e) {
      if (e.message.contains('Authentication invalid') || e.statusCode == 401) {
        emit(AuthTokenExpired());
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

      final studentProfileModel = StudentProfileModel.fromStudentModel(
        studentModel,
      );
      await HiveStorageService.saveStudent(studentProfileModel);
      debugPrint('Student data saved to Hive successfully');

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
    await _apiClient.clearCookies();
    await secureStorage.delete(key: 'token');
    await secureStorage.delete(key: 'email');
    await secureStorage.delete(key: 'password');
    await secureStorage.delete(key: 'expirationTime');

    await HiveStorageService.clearAll();
    debugPrint('Logged out and cleared all data');

    emit(AuthInitial());
  }

  @override
  Future<void> close() {
    _apiClient.removeTokenRefreshedListener(_persistRefreshedToken);
    _apiClient.onRefreshFailed = null;
    return super.close();
  }
}
