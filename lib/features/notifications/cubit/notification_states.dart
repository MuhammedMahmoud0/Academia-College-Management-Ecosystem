import 'package:college_project/features/notifications/models/notification_model.dart';

abstract class NotificationsState {}

// ─── Initial ───────────────────────────────────────────────────────────────
class NotificationsInitial extends NotificationsState {}

// ─── Loading (first page) ──────────────────────────────────────────────────
class NotificationsLoading extends NotificationsState {}

// ─── Loading more (pagination) ─────────────────────────────────────────────
class NotificationsLoadingMore extends NotificationsState {
  final List<NotificationModel> currentNotifications;
  final int unreadCount;

  NotificationsLoadingMore({
    required this.currentNotifications,
    required this.unreadCount,
  });
}

// ─── Loaded ────────────────────────────────────────────────────────────────
class NotificationsLoaded extends NotificationsState {
  final List<NotificationModel> notifications;
  final int unreadCount;
  final int currentPage;
  final int totalPages;
  final bool hasReachedMax;

  NotificationsLoaded({
    required this.notifications,
    required this.unreadCount,
    required this.currentPage,
    required this.totalPages,
    required this.hasReachedMax,
  });

  NotificationsLoaded copyWith({
    List<NotificationModel>? notifications,
    int? unreadCount,
    int? currentPage,
    int? totalPages,
    bool? hasReachedMax,
  }) {
    return NotificationsLoaded(
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
    );
  }
}

// ─── Mark-all-read in progress ─────────────────────────────────────────────
class NotificationsMarkAllReadLoading extends NotificationsState {
  final List<NotificationModel> currentNotifications;

  NotificationsMarkAllReadLoading({required this.currentNotifications});
}

// ─── Error ─────────────────────────────────────────────────────────────────
class NotificationsError extends NotificationsState {
  final String message;

  NotificationsError({required this.message});
}

// ─── Mark-all-read error (non-fatal – list stays visible) ──────────────────
class NotificationsMarkAllReadError extends NotificationsState {
  final List<NotificationModel> notifications;
  final int unreadCount;
  final String message;

  NotificationsMarkAllReadError({
    required this.notifications,
    required this.unreadCount,
    required this.message,
  });
}
