import 'package:college_project/features/notifications/cubit/notification_states.dart';
import 'package:college_project/features/notifications/repo/notification_repo.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class NotificationsCubit extends Cubit<NotificationsState> {
  final _repo = NotificationsRepo();

  static const int _pageSize = 20;

  NotificationsCubit() : super(NotificationsInitial());

  // ─── Fetch first page ────────────────────────────────────────────────────
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

  // ─── Load next page (pagination) ─────────────────────────────────────────
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
    } catch (e) {
      // On load-more failure, restore the existing list
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

  // ─── Mark single notification as read ────────────────────────────────────
  Future<void> markAsRead(int id) async {
    final current = state;
    if (current is! NotificationsLoaded) return;

    // Optimistic UI update
    final updated = current.notifications
        .map((n) => n.id == id ? n.copyWith(isRead: true) : n)
        .toList();

    final wasUnread = current.notifications.any((n) => n.id == id && !n.isRead);
    final newUnreadCount = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    emit(current.copyWith(notifications: updated, unreadCount: newUnreadCount));

    try {
      await _repo.markAsRead(id);
    } catch (_) {
      // Rollback on failure
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

  // ─── Delete notification ──────────────────────────────────────────────────
  Future<void> deleteNotification(int id) async {
    final current = state;
    if (current is! NotificationsLoaded) return;

    final wasUnread = current.notifications.any((n) => n.id == id && !n.isRead);
    final updated = current.notifications.where((n) => n.id != id).toList();
    final newUnreadCount = wasUnread
        ? (current.unreadCount - 1).clamp(0, 9999)
        : current.unreadCount;

    // Optimistic
    emit(current.copyWith(notifications: updated, unreadCount: newUnreadCount));

    try {
      await _repo.deleteNotification(id);
    } catch (_) {
      emit(current); // rollback
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  String _friendlyError(Object e) =>
      e.toString().replaceFirst('Exception: ', '');
}
