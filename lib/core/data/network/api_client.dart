import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import '../../constants/endpoints.dart';
import 'api_exception.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();

  /// Main client — carries the bearer access token on every request.
  late final Dio _dio;

  /// Dedicated client for POST /auth/refresh. It deliberately carries NO
  /// Authorization header: the server authenticates the refresh via the
  /// httpOnly refresh-token cookie that login set, not the (expired) access
  /// token. Sending the expired token here makes the server reject the refresh.
  late final Dio _refreshDio;

  /// Shared, disk-backed cookie store so the refresh-token cookie survives
  /// app restarts (the refresh token typically lives far longer than the
  /// short-lived access token). Set up lazily in [initCookieJar].
  PersistCookieJar? _cookieJar;

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
    BaseOptions buildOptions() => BaseOptions(
      baseUrl: Endpoints.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    // Separate BaseOptions per client so setToken() on the main client never
    // leaks an Authorization header onto the refresh client.
    _dio = Dio(buildOptions());
    _refreshDio = Dio(buildOptions());

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

  /// Sets up the disk-backed cookie jar and wires it into both clients so the
  /// login `Set-Cookie` (refresh token) is stored and resent automatically.
  /// Must be awaited once on startup, before the first request.
  Future<void> initCookieJar() async {
    if (_cookieJar != null) return;
    try {
      final dir = await getApplicationDocumentsDirectory();
      _cookieJar = PersistCookieJar(
        storage: FileStorage('${dir.path}/.cookies/'),
      );
      _dio.interceptors.add(CookieManager(_cookieJar!));
      _refreshDio.interceptors.add(CookieManager(_cookieJar!));
    } catch (e) {
      debugPrint('Cookie jar init failed: $e');
    }
  }

  /// Clear stored cookies (call on logout so the refresh token can't be reused).
  Future<void> clearCookies() async {
    await _cookieJar?.deleteAll();
  }

  /// Calls /auth/refresh, dedupes concurrent callers via a shared future.
  Future<String?> _refreshAccessToken() {
    return _refreshFuture ??= _doRefresh().whenComplete(() {
      _refreshFuture = null;
    });
  }

  Future<String?> _doRefresh() async {
    debugPrint('Refresh token...');
    try {
      // Use the tokenless client: the server authenticates this via the
      // refresh-token cookie, not the expired access token.
      final response = await _refreshDio.post(Endpoints.refreshToken);
      final newToken = response.data is Map
          ? response.data['accessToken']
          : null;
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
