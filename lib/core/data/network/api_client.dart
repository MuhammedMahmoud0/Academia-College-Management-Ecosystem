import 'package:dio/dio.dart';
import '../../constants/endpoints.dart';
import 'api_exception.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  late final Dio _dio;

  /// Multi-listener token-refresh callbacks. Register via
  /// [addTokenRefreshedListener] so several subsystems (auth persistence,
  /// WebSocket reconnect, …) can react to the same refresh event.
  final List<void Function(String newToken)> _tokenRefreshedListeners = [];

  /// Back-compat single-setter form. Setting this APPENDS a listener; the
  /// list-based API is preferred for new code.
  set onTokenRefreshed(void Function(String newToken)? cb) {
    if (cb != null) _tokenRefreshedListeners.add(cb);
  }

  void addTokenRefreshedListener(void Function(String newToken) cb) {
    _tokenRefreshedListeners.add(cb);
  }

  void removeTokenRefreshedListener(void Function(String newToken) cb) {
    _tokenRefreshedListeners.remove(cb);
  }

  /// Called when the refresh attempt itself fails (e.g. server rejects it).
  /// Use this to surface a logged-out / expired state to the UI.
  void Function()? onRefreshFailed;

  Future<String?>? _refreshFuture;

  factory ApiClient() => _instance;

  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: Endpoints.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onError: (error, handler) async {
          final req = error.requestOptions;
          final isUnauthorized = error.response?.statusCode == 401;
          final isRefreshCall = req.path == Endpoints.refreshToken;
          final alreadyRetried = req.extra['_retried'] == true;

          if (!isUnauthorized || isRefreshCall || alreadyRetried) {
            return handler.next(error);
          }

          final newToken = await _refreshAccessToken();
          if (newToken == null) {
            onRefreshFailed?.call();
            return handler.next(error);
          }

          // Retry the original request once with the new token.
          req.headers['Authorization'] = 'Bearer $newToken';
          req.extra['_retried'] = true;
          try {
            final retry = await _dio.fetch(req);
            return handler.resolve(retry);
          } on DioException catch (e) {
            return handler.next(e);
          }
        },
      ),
    );
  }

  /// Calls /auth/refresh, dedupes concurrent callers via a shared future.
  Future<String?> _refreshAccessToken() {
    return _refreshFuture ??= _doRefresh().whenComplete(() {
      _refreshFuture = null;
    });
  }

  Future<String?> _doRefresh() async {
    try {
      final response = await _dio.post(Endpoints.refreshToken);
      final newToken = response.data is Map ? response.data['accessToken'] : null;
      if (newToken is String && newToken.isNotEmpty) {
        setToken(newToken);
        for (final cb in List.of(_tokenRefreshedListeners)) {
          try {
            cb(newToken);
          } catch (_) {}
        }
        return newToken;
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Manually trigger a refresh (used by the periodic 15-min timer).
  Future<String?> refreshAccessToken() => _refreshAccessToken();

  /// Set authorization token
  void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  /// Remove authorization token
  void clearToken() {
    _dio.options.headers.remove('Authorization');
  }

  /// GET request
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  /// POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  /// PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  /// PATCH request
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  /// DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  /// Upload file with multipart/form-data
  Future<Response<T>> uploadFile<T>(
    String path, {
    required FormData formData,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    void Function(int, int)? onSendProgress,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: formData,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
      );
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}
