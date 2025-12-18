enum NotificationType { grade, exam, registration, announcement, payment }

class AppNotification {
  final String id;
  final String title;
  final String message;
  final NotificationType type;
  final DateTime createdAt;
  final bool isRead;

  const AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.createdAt,
    this.isRead = false,
  });

  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  // Mock data
  static List<AppNotification> mockNotifications = [
    AppNotification(
      id: '1',
      title: 'New Grade Posted',
      message: 'Your grade for Database Systems has been posted.',
      type: NotificationType.grade,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      isRead: false,
    ),
    AppNotification(
      id: '2',
      title: 'Exam Reminder',
      message: 'Data Structures exam in 3 days. Don\'t forget to prepare!',
      type: NotificationType.exam,
      createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      isRead: false,
    ),
    AppNotification(
      id: '3',
      title: 'Registration Opens',
      message: 'Spring 2025 course registration opens on Jan 15.',
      type: NotificationType.registration,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      isRead: true,
    ),
  ];

  static int get unreadCount =>
      mockNotifications.where((n) => !n.isRead).length;
}
