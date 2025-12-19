import 'package:flutter/material.dart';

class Exam {
  final String id;
  final String courseName;
  final String courseCode;
  final DateTime dateTime;
  final String location;
  final Duration duration;

  const Exam({
    required this.id,
    required this.courseName,
    required this.courseCode,
    required this.dateTime,
    required this.location,
    required this.duration,
  });

  int get daysRemaining {
    final now = DateTime.now();
    final difference = dateTime.difference(now);
    return difference.inDays;
  }

  String get formattedDate {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[dateTime.month - 1]} ${dateTime.day}, ${dateTime.year}';
  }

  String get formattedTime {
    final hour = dateTime.hour > 12
        ? dateTime.hour - 12
        : (dateTime.hour == 0 ? 12 : dateTime.hour);
    final period = dateTime.hour >= 12 ? 'PM' : 'AM';
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$hour:$minute $period';
  }

  String get formattedDuration {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    if (minutes == 0) return '$hours min';
    return '${duration.inMinutes} min';
  }

  // Helper for UI coloring based on logic (can be moved to a ViewModel later)
  Color get statusColor {
    final now = DateTime.now();
    if (dateTime.isBefore(now)) return const Color(0xFF10B981); // Completed
    if (daysRemaining < 0) return const Color(0xFFEF4444); // Missed
    return const Color(0xFF6366F1); // Upcoming
  }

  String get statusString {
    final now = DateTime.now();
    if (dateTime.isBefore(now)) return 'completed';
    return 'upcoming';
  }

  static List<Exam> mockExams = [
    Exam(
      id: '1',
      courseName: 'Data Structures',
      courseCode: 'CS301',
      dateTime: DateTime.now().add(const Duration(days: 3)),
      location: 'Hall A-201',
      duration: const Duration(hours: 2),
    ),
    Exam(
      id: '2',
      courseName: 'Algorithms',
      courseCode: 'CS302',
      dateTime: DateTime.now().add(const Duration(days: 7)),
      location: 'Hall B-105',
      duration: const Duration(hours: 2, minutes: 30),
    ),
    Exam(
      id: '3',
      courseName: 'Database Systems',
      courseCode: 'CS310',
      dateTime: DateTime.now().subtract(
        const Duration(days: 2),
      ), // Mocking a completed one
      location: 'Hall A-301',
      duration: const Duration(hours: 2),
    ),
  ];
}
