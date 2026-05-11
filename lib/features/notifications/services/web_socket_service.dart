import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'package:college_project/features/notifications/models/notification_model.dart';

enum WebSocketStatus { disconnected, connecting, connected, error }

/// Manages a persistent WebSocket connection to the college backend.
/// Emits [NotificationModel] events whenever the server pushes a new notification.
class WebSocketService {
  // ─── Configuration ────────────────────────────────────────────────────────
  /// Replace with your real WS endpoint, e.g. wss://api.college.edu/ws/notifications
  static const String _wsBaseUrl = 'wss://your-backend.com/ws/notifications';

  static const Duration _reconnectDelay = Duration(seconds: 5);
  static const Duration _pingInterval = Duration(seconds: 25);

  // ─── State ────────────────────────────────────────────────────────────────
  WebSocketChannel? _channel;
  Timer? _reconnectTimer;
  Timer? _pingTimer;
  bool _intentionalClose = false;
  String? _authToken;

  final _statusController = StreamController<WebSocketStatus>.broadcast();
  final _notificationController =
      StreamController<NotificationModel>.broadcast();

  Stream<WebSocketStatus> get statusStream => _statusController.stream;
  Stream<NotificationModel> get notificationStream =>
      _notificationController.stream;

  WebSocketStatus _currentStatus = WebSocketStatus.disconnected;
  WebSocketStatus get currentStatus => _currentStatus;

  // ─── Public API ───────────────────────────────────────────────────────────

  /// Call this once when the user logs in, passing their JWT / session token.
  Future<void> connect(String authToken) async {
    _authToken = authToken;
    _intentionalClose = false;
    await _connect();
  }

  /// Call on logout or app disposal.
  Future<void> disconnect() async {
    _intentionalClose = true;
    _cancelTimers();
    await _channel?.sink.close(status.goingAway);
    _setStatus(WebSocketStatus.disconnected);
  }

  Future<void> dispose() async {
    await disconnect();
    await _statusController.close();
    await _notificationController.close();
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  Future<void> _connect() async {
    _setStatus(WebSocketStatus.connecting);

    try {
      // Pass the token as a query param (adjust to match your backend auth)
      final uri = Uri.parse('$_wsBaseUrl?token=$_authToken');
      _channel = WebSocketChannel.connect(uri);

      // Wait for the handshake to complete
      await _channel!.ready;

      _setStatus(WebSocketStatus.connected);
      _startPing();

      _channel!.stream.listen(
        _onMessage,
        onError: _onError,
        onDone: _onDone,
        cancelOnError: false,
      );
    } catch (e) {
      debugPrint('[WS] Connection failed: $e');
      _setStatus(WebSocketStatus.error);
      _scheduleReconnect();
    }
  }

  void _onMessage(dynamic raw) {
    try {
      final Map<String, dynamic> data = jsonDecode(raw as String);

      // Expected server envelope: { "type": "notification", "payload": { ...NotificationModel fields } }
      if (data['type'] == 'notification') {
        final notification = NotificationModel.fromJson(
          data['payload'] as Map<String, dynamic>,
        );
        _notificationController.add(notification);
      } else if (data['type'] == 'pong') {
        // Server acknowledged our ping – connection is healthy
        debugPrint('[WS] pong received');
      }
    } catch (e) {
      debugPrint('[WS] Message parse error: $e  raw=$raw');
    }
  }

  void _onError(Object error, StackTrace stack) {
    debugPrint('[WS] Error: $error');
    _setStatus(WebSocketStatus.error);
    if (!_intentionalClose) _scheduleReconnect();
  }

  void _onDone() {
    debugPrint('[WS] Connection closed');
    _cancelTimers();
    if (!_intentionalClose) {
      _setStatus(WebSocketStatus.disconnected);
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(_reconnectDelay, () async {
      if (!_intentionalClose) {
        debugPrint('[WS] Reconnecting…');
        await _connect();
      }
    });
  }

  void _startPing() {
    _pingTimer?.cancel();
    _pingTimer = Timer.periodic(_pingInterval, (_) {
      if (_currentStatus == WebSocketStatus.connected) {
        _channel?.sink.add(jsonEncode({'type': 'ping'}));
      }
    });
  }

  void _cancelTimers() {
    _reconnectTimer?.cancel();
    _pingTimer?.cancel();
  }

  void _setStatus(WebSocketStatus s) {
    _currentStatus = s;
    _statusController.add(s);
  }
}
