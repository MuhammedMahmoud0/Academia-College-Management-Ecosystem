import 'package:flutter/material.dart';

class NotificationTypeHelper {
  static String title(String type) {
    switch (type) {
      case 'new_grade':
        return 'New Grade Posted';
      case 'exam_deadline':
        return 'Exam Deadline';
      case 'community_activity':
        return 'Community Activity';
      case 'campus_announcement':
        return 'Campus Announcement';
      default:
        return type
            .replaceAll('_', ' ')
            .split(' ')
            .map(
              (w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}',
            )
            .join(' ');
    }
  }

  static IconData icon(String type) {
    switch (type) {
      case 'new_grade':
        return Icons.stars_rounded;
      case 'exam_deadline':
        return Icons.timer_rounded;
      case 'community_activity':
        return Icons.people_rounded;
      case 'campus_announcement':
        return Icons.campaign_rounded;
      default:
        return Icons.notifications_active_rounded;
    }
  }

  static Color color(String type) {
    switch (type) {
      case 'new_grade':
        return Colors.green;
      case 'exam_deadline':
        return const Color(0xFF6C63FF);
      case 'community_activity':
        return Colors.teal;
      case 'campus_announcement':
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }
}
