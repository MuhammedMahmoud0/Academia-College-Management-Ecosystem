import 'dart:async';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/features/notifications/services/web_socket_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:college_project/features/notifications/cubit/notification_states.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/repo/notification_repo.dart';
import 'package:college_project/features/notifications/services/push_notification_service.dart';

class NotificationsCubit extends Cubit<NotificationsState> {
  final _repo = NotificationsRepo();
  final _ws = WebSocketService();
  final _push = PushNotificationService();
  final _apiClient = ApiClient();

  static const int _pageSize = 20;

  StreamSubscription<NotificationModel>? _wsSubscription;
  StreamSubscription<int>? _unreadCountSubscription;
  StreamSubscription<WebSocketStatus>? _statusSubscription;
  bool _realtimeStarted = false;

  // Source-of-truth, kept in sync with every emit so badges/lists react live.
  int unreadCount = 0;
  List<NotificationModel> _notifications = [];

  NotificationsCubit() : super(NotificationsInitial());

  // ─── WebSocket lifecycle ──────────────────────────────────────────────────

  /// Call this right after the user logs in, passing their auth token.
  /// Subscribes to the three Socket.IO streams exposed by [WebSocketService]:
  ///   - `new-notification` → prepend + push to system tray
  ///   - `unread-count`     → server-authoritative badge value
  ///   - status changes      → expose token-expired so callers can refresh JWT
  ///
  /// Also hooks into [ApiClient]'s token-refresh stream so the WS is
  /// reconnected transparently when the JWT is rotated by the 15-min timer
  /// or the 401 interceptor — otherwise the socket would hold a stale token.
  Future<void> startRealtime(String authToken) async {
    if (_realtimeStarted) return;
    _realtimeStarted = true;

    _wsSubscription ??= _ws.notificationStream.listen(_onWebSocketNotification);
    _unreadCountSubscription ??= _ws.unreadCountStream.listen(_onUnreadCount);
    _statusSubscription ??= _ws.statusStream.listen(_onSocketStatus);

    _apiClient.addTokenRefreshedListener(_onTokenRefreshed);

    await _ws.connect(authToken);
  }

  /// Call on logout.
  Future<void> stopRealtime() async {
    _realtimeStarted = false;
    _apiClient.removeTokenRefreshedListener(_onTokenRefreshed);
    await _wsSubscription?.cancel();
    await _unreadCountSubscription?.cancel();
    await _statusSubscription?.cancel();
    _wsSubscription = null;
    _unreadCountSubscription = null;
    _statusSubscription = null;
    await _ws.disconnect();
  }

  /// Reconnect the live socket with the freshly-rotated JWT.
  void _onTokenRefreshed(String newToken) {
    if (!_realtimeStarted) return;
    debugPrint('[NotificationsCubit] reconnecting WS with refreshed token');
    // _ws.connect() tears down the existing socket then opens a new one,
    // so a hot-swap of the auth token is safe.
    _ws.connect(newToken);
  }

  /// Called from FCM foreground / background-tap handlers. Refreshes the
  /// unread-count from the server (cheap, authoritative) so the badge stays
  /// in sync even when the WS is asleep (e.g. doze mode, app reopened cold).
  Future<void> onFcmMessageReceived(RemoteMessage message) async {
    final data = message.data;
    final idStr = data['id']?.toString() ?? data['notificationId']?.toString();
    final id = int.tryParse(idStr ?? '');
    final type = data['type']?.toString();
    final body =
        message.notification?.body ??
        data['message']?.toString() ??
        data['body']?.toString();

    // System-tray surface for foreground messages (background is handled
    // by the bg isolate in main.dart).
    if (body != null && body.isNotEmpty) {
      await _push.showRaw(
        id: id ?? DateTime.now().millisecondsSinceEpoch.remainder(1 << 31),
        body: body,
        title: message.notification?.title,
        type: type,
      );
    }

    // Re-pull authoritative unread count.
    try {
      await getUnreadCount();
    } catch (_) {/* swallow — badge will catch up on next WS event */}
  }

  void _onSocketStatus(WebSocketStatus s) {
    if (s == WebSocketStatus.tokenExpired) {
      // Allow the auth layer to refresh JWT & call startRealtime again.
      debugPrint('[NotificationsCubit] socket reports token expired');
      _realtimeStarted = false;
    }
  }

  /// Server-authoritative unread badge update.
  void _onUnreadCount(int serverCount) {
    if (serverCount == unreadCount) return;
    unreadCount = serverCount;

    final current = state;
    if (current is NotificationsLoaded) {
      emit(current.copyWith(unreadCount: unreadCount));
    } else if (current is NotificationsLoadingMore) {
      emit(
        NotificationsLoadingMore(
          currentNotifications: current.currentNotifications,
          unreadCount: unreadCount,
        ),
      );
    } else if (current is NotificationsMarkAllReadError) {
      emit(
        NotificationsMarkAllReadError(
          notifications: current.notifications,
          unreadCount: unreadCount,
          message: current.message,
        ),
      );
    } else {
      emit(NotificationsRealtimeBadgeUpdated(unreadCount: unreadCount));
    }
  }

  /// Handles a notification pushed from the server in real time.
  /// The unread badge is driven by the separate `unread-count` event, so we
  /// only touch the list here.
  void _onWebSocketNotification(NotificationModel incoming) {
    // System-tray notification (always)
    _push.show(incoming);

    // Dedupe by id so a retransmit doesn't duplicate the list.
    final alreadyHave = _notifications.any((n) => n.id == incoming.id);
    if (!alreadyHave) {
      _notifications = [incoming, ..._notifications];
    }

    final current = state;
    if (current is NotificationsLoaded) {
      emit(
        current.copyWith(
          notifications: _notifications,
          unreadCount: unreadCount,
        ),
      );
    } else if (current is NotificationsLoadingMore) {
      emit(
        NotificationsLoadingMore(
          currentNotifications: _notifications,
          unreadCount: unreadCount,
        ),
      );
    } else if (current is NotificationsMarkAllReadLoading) {
      emit(
        NotificationsMarkAllReadLoading(currentNotifications: _notifications),
      );
    } else if (current is NotificationsMarkAllReadError) {
      emit(
        NotificationsMarkAllReadError(
          notifications: _notifications,
          unreadCount: unreadCount,
          message: current.message,
        ),
      );
    } else {
      // List not hydrated yet — just bump the badge so home rebuilds.
      emit(NotificationsRealtimeBadgeUpdated(unreadCount: unreadCount));
    }
  }

  // ─── Unread count ─────────────────────────────────────────────────────────
  Future<void> getUnreadCount() async {
    try {
      unreadCount = await _repo.getUnreadCount();
      emit(NotificationsGetUnreadCountSuccess(unreadCount: unreadCount));
      debugPrint('Unread count: $unreadCount');
    } catch (e) {
      debugPrint('getUnreadCount failed: $e');
    }
  }

  // ─── Fetch first page ─────────────────────────────────────────────────────
  Future<void> fetchNotifications() async {
    emit(NotificationsLoading());
    try {
      final response = await _repo.getNotifications(page: 1, limit: _pageSize);
      _notifications = response.notifications;
      unreadCount = response.unreadCount;
      emit(
        NotificationsLoaded(
          notifications: _notifications,
          unreadCount: unreadCount,
          currentPage: 1,
          totalPages: response.pagination.totalPages,
          hasReachedMax:
              response.pagination.page >= response.pagination.totalPages,
        ),
      );
    } catch (e) {
      emit(NotificationsError(message: _friendlyError(e)));
    }
  }

  // ─── Load next page (pagination) ──────────────────────────────────────────
  Future<void> loadMore() async {
    final current = state;
    if (current is! NotificationsLoaded) return;
    if (current.hasReachedMax) return;

    emit(
      NotificationsLoadingMore(
        currentNotifications: current.notifications,
        unreadCount: current.unreadCount,
      ),
    );

    try {
      final nextPage = current.currentPage + 1;
      final response = await _repo.getNotifications(
        page: nextPage,
        limit: _pageSize,
      );
      _notifications = [...current.notifications, ...response.notifications];
      unreadCount = response.unreadCount;
      emit(
        NotificationsLoaded(
          notifications: _notifications,
          unreadCount: unreadCount,
          currentPage: nextPage,
          totalPages: response.pagination.totalPages,
          hasReachedMax: nextPage >= response.pagination.totalPages,
        ),
      );
    } catch (_) {
      emit(
        NotificationsLoaded(
          notifications: current.notifications,
          unreadCount: current.unreadCount,
          currentPage: current.currentPage,
          totalPages: current.totalPages,
          hasReachedMax: current.hasReachedMax,
        ),
      );
    }
  }

  // ─── Mark single as read ──────────────────────────────────────────────────
  Future<void> markAsRead(int id) async {
    final current = state;
    if (current is! NotificationsLoaded) return;

    final wasUnread = current.notifications.any((n) => n.id == id && !n.isRead);
    _notifications = current.notifications
        .map((n) => n.id == id ? n.copyWith(isRead: true) : n)
        .toList();
    unreadCount = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    emit(
      current.copyWith(notifications: _notifications, unreadCount: unreadCount),
    );

    try {
      await _repo.markAsRead(id);
    } catch (_) {
      // rollback
      _notifications = current.notifications;
      unreadCount = current.unreadCount;
      emit(current);
    }
  }

  // ─── Mark ALL as read ─────────────────────────────────────────────────────
  Future<void> markAllAsRead() async {
    final current = state;
    if (current is! NotificationsLoaded) return;

    emit(
      NotificationsMarkAllReadLoading(
        currentNotifications: current.notifications,
      ),
    );

    try {
      await _repo.markAllAsRead();
      _notifications = current.notifications
          .map((n) => n.copyWith(isRead: true))
          .toList();
      unreadCount = 0;
      emit(
        current.copyWith(
          notifications: _notifications,
          unreadCount: unreadCount,
        ),
      );
    } catch (e) {
      emit(
        NotificationsMarkAllReadError(
          notifications: current.notifications,
          unreadCount: current.unreadCount,
          message: _friendlyError(e),
        ),
      );
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────────────
  Future<void> deleteNotification(int id) async {
    final current = state;
    if (current is! NotificationsLoaded) return;

    final wasUnread = current.notifications.any((n) => n.id == id && !n.isRead);
    _notifications = current.notifications.where((n) => n.id != id).toList();
    unreadCount = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    emit(
      current.copyWith(notifications: _notifications, unreadCount: unreadCount),
    );

    try {
      await _repo.deleteNotification(id);
    } catch (_) {
      _notifications = current.notifications;
      unreadCount = current.unreadCount;
      emit(current);
    }
  }

  // NOTE: FCM messages are SENT from the backend using the Firebase Admin SDK.
  // Service-account credentials must NEVER live in the client — any user with
  // an APK can decompile and impersonate the server. Sending pushes from the
  // app has been removed; only receiving + display happens here.

  // ─── Cleanup ──────────────────────────────────────────────────────────────
  @override
  Future<void> close() async {
    await stopRealtime();
    return super.close();
  }

  String _friendlyError(Object e) =>
      e.toString().replaceFirst('Exception: ', '');
}
