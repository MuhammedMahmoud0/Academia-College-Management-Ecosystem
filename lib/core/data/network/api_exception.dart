import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ApiException({required this.message, this.statusCode, this.data});

  factory ApiException.fromDioException(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        return ApiException(
          message: 'Connection timeout. Please check your internet connection.',
          statusCode: null,
        );
      case DioExceptionType.sendTimeout:
        return ApiException(
          message: 'Send timeout. Please try again.',
          statusCode: null,
        );
      case DioExceptionType.receiveTimeout:
        return ApiException(
          message: 'Receive timeout. Please try again.',
          statusCode: null,
        );
      case DioExceptionType.badCertificate:
        return ApiException(message: 'Invalid certificate.', statusCode: null);
      case DioExceptionType.badResponse:
        return _handleBadResponse(e.response);
      case DioExceptionType.cancel:
        return ApiException(
          message: 'Request was cancelled.',
          statusCode: null,
        );
      case DioExceptionType.connectionError:
        return ApiException(
          message: 'No internet connection.',
          statusCode: null,
        );
      case DioExceptionType.unknown:
        return ApiException(
          message: e.message ?? 'An unexpected error occurred.',
          statusCode: null,
        );
    }
  }

  static ApiException _handleBadResponse(Response? response) {
    final statusCode = response?.statusCode;
    final data = response?.data;

    String message;
    if (data is Map && data.containsKey('message')) {
      message = data['message'];
    } else if (data is Map && data.containsKey('error')) {
      message = data['error'];
    } else {
      switch (statusCode) {
        case 400:
          message = 'Bad request.';
          break;
        case 401:
          message = 'Unauthorized. Please login again.';
          break;
        case 403:
          message = 'Access denied.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 422:
          message = 'Validation error.';
          break;
        case 500:
          message = 'Internal server error.';
          break;
        case 502:
          message = 'Bad gateway.';
          break;
        case 503:
          message = 'Service unavailable.';
          break;
        default:
          message = 'Something went wrong.';
      }
    }

    return ApiException(message: message, statusCode: statusCode, data: data);
  }

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';
}
