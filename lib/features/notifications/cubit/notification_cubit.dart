import 'dart:async';
import 'package:college_project/features/notifications/services/web_socket_service.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:college_project/features/notifications/cubit/notification_states.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/repo/notification_repo.dart';
import 'package:college_project/features/notifications/services/push_notification_service.dart';

class NotificationsCubit extends Cubit<NotificationsState> {
  final _repo = NotificationsRepo();
  final _ws = WebSocketService();
  final _push = PushNotificationService();

  static const int _pageSize = 20;

  StreamSubscription<NotificationModel>? _wsSubscription;

  NotificationsCubit() : super(NotificationsInitial());

  // ─── WebSocket lifecycle ──────────────────────────────────────────────────

  /// Call this right after the user logs in, passing their auth token.
  Future<void> startRealtime(String authToken) async {
    await _ws.connect(authToken);

    _wsSubscription = _ws.notificationStream.listen(_onWebSocketNotification);
  }

  /// Call on logout.
  Future<void> stopRealtime() async {
    await _wsSubscription?.cancel();
    await _ws.disconnect();
  }

  /// Handles a notification pushed from the server in real time.
  void _onWebSocketNotification(NotificationModel incoming) {
    // 1. Show native system-tray notification (like WhatsApp)
    _push.show(incoming);

    // 2. Prepend it to the in-app list immediately
    final current = state;
    if (current is NotificationsLoaded) {
      final updated = [incoming, ...current.notifications];
      emit(
        current.copyWith(
          notifications: updated,
          unreadCount: current.unreadCount + 1,
        ),
      );
    } else {
      // If the list hasn't loaded yet, trigger a fresh fetch
      fetchNotifications();
    }
  }

  // ─── Fetch first page ─────────────────────────────────────────────────────
  Future<void> fetchNotifications() async {
    emit(NotificationsLoading());
    try {
      final response = await _repo.getNotifications(page: 1, limit: _pageSize);
      emit(
        NotificationsLoaded(
          notifications: response.notifications,
          unreadCount: response.unreadCount,
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
      final merged = [...current.notifications, ...response.notifications];
      emit(
        NotificationsLoaded(
          notifications: merged,
          unreadCount: response.unreadCount,
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

    final updated = current.notifications
        .map((n) => n.id == id ? n.copyWith(isRead: true) : n)
        .toList();
    final wasUnread = current.notifications.any((n) => n.id == id && !n.isRead);
    final newUnread = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    emit(current.copyWith(notifications: updated, unreadCount: newUnread));

    try {
      await _repo.markAsRead(id);
    } catch (_) {
      emit(current); // rollback
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
      final updated = current.notifications
          .map((n) => n.copyWith(isRead: true))
          .toList();
      emit(current.copyWith(notifications: updated, unreadCount: 0));
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
    final updated = current.notifications.where((n) => n.id != id).toList();
    final newUnread = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    emit(current.copyWith(notifications: updated, unreadCount: newUnread));

    try {
      await _repo.deleteNotification(id);
    } catch (_) {
      emit(current);
    }
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────
  @override
  Future<void> close() async {
    await stopRealtime();
    return super.close();
  }

  String _friendlyError(Object e) =>
      e.toString().replaceFirst('Exception: ', '');
}
