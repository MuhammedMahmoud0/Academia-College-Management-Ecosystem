import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';

import 'package:college_project/features/notifications/models/notification_model.dart';

class NotificationsRepo {
  final _dioHelper = ApiClient();

  /// Fetch a paginated page of notifications.
  /// [page] is 1-based on most backends – adjust the query key if yours differs.
  Future<NotificationsResponse> getNotifications({
    required int page,
    int limit = 10,
  }) async {
    final response = await _dioHelper.get(
      Endpoints.notification,
      queryParameters: {'page': page, 'limit': limit},
    );
    return NotificationsResponse.fromJson(
      response.data as Map<String, dynamic>,
    );
  }

  /// Fetch the live unread badge count.
  Future<int> getUnreadCount() async {
    final response = await _dioHelper.get(Endpoints.notificationUnreadCount);
    // Expected shape: { "unreadCount": N }
    return (response.data as Map<String, dynamic>)['unreadCount'] as int;
  }

  /// Mark a single notification as read.
  Future<void> markAsRead(int id) async {
    await _dioHelper.patch(Endpoints.notificationRead(id));
  }

  /// Mark every notification as read.
  Future<void> markAllAsRead() async {
    await _dioHelper.patch(Endpoints.notificationMarkAllRead);
  }

  /// Delete a notification.
  Future<void> deleteNotification(int id) async {
    await _dioHelper.delete(Endpoints.deleteNotification(id));
  }
}
