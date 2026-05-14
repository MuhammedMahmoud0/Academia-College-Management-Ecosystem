import 'dart:async';
import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

enum WebSocketStatus { disconnected, connecting, connected, error, tokenExpired }

/// Socket.IO client that mirrors the backend contract documented in
/// `socketIO.js`:
///   - Default namespace ("/").
///   - JWT is passed via `auth: { token: <jwt> }` (NOT a query string).
///   - Server auto-joins `notifications:<userId>`; no client "join" emit.
///   - Server emits:
///       * `new-notification` → NotificationModel JSON
///       * `unread-count`     → int OR `{ count|unreadCount: int }`
///   - On expired JWT the server raises `connect_error` with message
///     "Token expired. Reconnect required." — surfaced as
///     [WebSocketStatus.tokenExpired] so callers can refresh & reconnect.
class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  io.Socket? _socket;
  String? _authToken;

  final _statusController = StreamController<WebSocketStatus>.broadcast();
  final _notificationController =
      StreamController<NotificationModel>.broadcast();
  final _unreadCountController = StreamController<int>.broadcast();

  Stream<WebSocketStatus> get statusStream => _statusController.stream;
  Stream<NotificationModel> get notificationStream =>
      _notificationController.stream;
  Stream<int> get unreadCountStream => _unreadCountController.stream;

  WebSocketStatus _currentStatus = WebSocketStatus.disconnected;
  WebSocketStatus get currentStatus => _currentStatus;

  // ─── Public API ───────────────────────────────────────────────────────────

  /// Open (or refresh) the Socket.IO connection with the given JWT.
  /// Safe to call multiple times — an existing socket is torn down first
  /// so a new token is honoured.
  Future<void> connect(String authToken) async {
    if (_socket != null && _authToken == authToken && _socket!.connected) {
      return;
    }
    _authToken = authToken;
    await _teardown();
    _setStatus(WebSocketStatus.connecting);

    final socket = io.io(
      Endpoints.notificationsSocketIO,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': authToken})
          .build(),
    );

    socket
      ..onConnect((_) {
        debugPrint('[SocketIO] connected (sid=${socket.id})');
        _setStatus(WebSocketStatus.connected);
      })
      ..onDisconnect((reason) {
        debugPrint('[SocketIO] disconnected: $reason');
        _setStatus(WebSocketStatus.disconnected);
      })
      ..onConnectError((err) {
        debugPrint('[SocketIO] connect_error: $err');
        if (_isTokenExpired(err)) {
          _setStatus(WebSocketStatus.tokenExpired);
        } else {
          _setStatus(WebSocketStatus.error);
        }
      })
      ..onError((err) => debugPrint('[SocketIO] error: $err'))
      ..on('new-notification', _onNewNotification)
      ..on('unread-count', _onUnreadCount);

    _socket = socket;
    socket.connect();
  }

  /// Close the connection — call on logout.
  Future<void> disconnect() async {
    await _teardown();
    _setStatus(WebSocketStatus.disconnected);
  }

  Future<void> dispose() async {
    await disconnect();
    await _statusController.close();
    await _notificationController.close();
    await _unreadCountController.close();
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  void _onNewNotification(dynamic data) {
    try {
      final map = _asMap(data);
      if (map == null) {
        debugPrint('[SocketIO] new-notification: unexpected payload $data');
        return;
      }
      _notificationController.add(NotificationModel.fromJson(map));
    } catch (e) {
      debugPrint('[SocketIO] new-notification parse error: $e  raw=$data');
    }
  }

  void _onUnreadCount(dynamic data) {
    final value = _asUnreadCount(data);
    if (value == null) {
      debugPrint('[SocketIO] unread-count: unexpected payload $data');
      return;
    }
    _unreadCountController.add(value);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  Future<void> _teardown() async {
    final s = _socket;
    if (s == null) return;
    s
      ..clearListeners()
      ..disconnect()
      ..dispose();
    _socket = null;
  }

  bool _isTokenExpired(Object? err) {
    final msg = err?.toString().toLowerCase() ?? '';
    return msg.contains('token expired') || msg.contains('reconnect required');
  }

  Map<String, dynamic>? _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    return null;
  }

  int? _asUnreadCount(dynamic data) {
    if (data is int) return data;
    if (data is num) return data.toInt();
    final map = _asMap(data);
    if (map != null) {
      final v = map['count'] ?? map['unreadCount'] ?? map['unread_count'];
      if (v is int) return v;
      if (v is num) return v.toInt();
    }
    return null;
  }

  void _setStatus(WebSocketStatus s) {
    _currentStatus = s;
    _statusController.add(s);
  }
}
