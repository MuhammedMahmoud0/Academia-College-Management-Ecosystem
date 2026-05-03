class NotificationModel {
  final int id;
  final String message;
  final String type;
  final bool isRead;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.message,
    required this.type,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as int,
      message: json['message'] as String,
      type: json['type'] as String,
      isRead: json['is_read'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'message': message,
    'type': type,
    'is_read': isRead,
    'created_at': createdAt.toIso8601String(),
  };

  NotificationModel copyWith({bool? isRead}) {
    return NotificationModel(
      id: id,
      message: message,
      type: type,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt,
    );
  }
}

class PaginationModel {
  final int page;
  final int limit;
  final int totalCount;
  final int totalPages;

  PaginationModel({
    required this.page,
    required this.limit,
    required this.totalCount,
    required this.totalPages,
  });

  factory PaginationModel.fromJson(Map<String, dynamic> json) {
    return PaginationModel(
      page: json['page'] as int,
      limit: json['limit'] as int,
      totalCount: json['totalCount'] as int,
      totalPages: json['totalPages'] as int,
    );
  }
}

class NotificationsResponse {
  final List<NotificationModel> notifications;
  final PaginationModel pagination;
  final int unreadCount;

  NotificationsResponse({
    required this.notifications,
    required this.pagination,
    required this.unreadCount,
  });

  factory NotificationsResponse.fromJson(Map<String, dynamic> json) {
    return NotificationsResponse(
      notifications: (json['notifications'] as List<dynamic>)
          .map((e) => NotificationModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pagination: PaginationModel.fromJson(
        json['pagination'] as Map<String, dynamic>,
      ),
      unreadCount: json['unreadCount'] as int,
    );
  }
}
