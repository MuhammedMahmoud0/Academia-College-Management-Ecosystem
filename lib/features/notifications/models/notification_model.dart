enum NotificationType { announcement, assignment, grade, reminder }

class NotificationModel {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final NotificationType type;
  final bool isRead;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.type,
    this.isRead = false,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['isRead'] ?? false,
      type: _parseType(json['type']),
    );
  }

  static NotificationType _parseType(String? type) {
    switch (type?.toLowerCase()) {
      case 'announcement':
        return NotificationType.announcement;
      case 'assignment':
        return NotificationType.assignment;
      case 'grade':
        return NotificationType.grade;
      default:
        return NotificationType.reminder;
    }
  }

  // Mock data generator for testing
  static List<NotificationModel> getMockNotifications() {
    return [
      NotificationModel(
        id: '1',
        title: 'New Study Material',
        message: 'Professor added "Linear Algebra Basics" to the Math section.',
        timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
        type: NotificationType.announcement,
        isRead: false,
      ),
      NotificationModel(
        id: '2',
        title: 'Assignment Deadline',
        message:
            'Your Algorithms assignment is due in 2 hours. Don\'t forget to upload!',
        timestamp: DateTime.now().subtract(const Duration(hours: 3)),
        type: NotificationType.reminder,
        isRead: false,
      ),
      NotificationModel(
        id: '3',
        title: 'New Grade Released',
        message: 'Your Mobile Dev Project has been graded. Tap to see results.',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        type: NotificationType.grade,
        isRead: true,
      ),
    ];
  }
}
