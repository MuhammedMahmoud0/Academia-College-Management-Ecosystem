import 'package:flutter/material.dart';

class Exam {
  final String id;
  final String courseName;
  final String courseCode;
  final DateTime dateTime;
  final String location;
  final Duration duration;
  final String? description;
  final bool isCompleted;

  const Exam({
    required this.id,
    required this.courseName,
    required this.courseCode,
    required this.dateTime,
    required this.location,
    required this.duration,
    this.description,
    this.isCompleted = false,
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
    final minutes = duration.inMinutes;
    return '$minutes min';
  }

  Color get statusColor {
    final now = DateTime.now();
    if (isCompleted) return const Color(0xFF10B981); // Completed (Green)
    if (dateTime.isBefore(now)) return const Color(0xFFEF4444); // Missed (Red)
    return const Color(0xFF6366F1); // Upcoming (Indigo)
  }

  String get statusString {
    final now = DateTime.now();
    if (isCompleted) return 'completed';
    if (dateTime.isBefore(now)) return 'missed';
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
      description: 'Covers Trees, Graphs, and Hash Tables.',
    ),
    Exam(
      id: '2',
      courseName: 'Algorithms',
      courseCode: 'CS302',
      dateTime: DateTime.now().add(const Duration(days: 7)),
      location: 'Hall B-105',
      duration: const Duration(hours: 2, minutes: 30),
      description: 'Focuses on Dynamic Programming and Greedy Algorithms.',
    ),
    Exam(
      id: '3',
      courseName: 'Database Systems',
      courseCode: 'CS310',
      dateTime: DateTime.now().subtract(const Duration(days: 2)),
      location: 'Hall A-301',
      duration: const Duration(hours: 2),
      isCompleted: true,
      description: 'Final exam covering SQL and Normalization.',
    ),
    Exam(
      id: '4',
      courseName: 'Discrete Mathematics',
      courseCode: 'MATH201',
      dateTime: DateTime.now().subtract(const Duration(days: 5)),
      location: 'Hall C-102',
      duration: const Duration(hours: 3),
      isCompleted: false,
      description: 'Midterm covering Logic and Set Theory.',
    ),
    Exam(
      id: '5',
      courseName: 'Operating Systems',
      courseCode: 'CS305',
      dateTime: DateTime.now().subtract(const Duration(hours: 5)),
      location: 'Lab 4',
      duration: const Duration(hours: 2),
      isCompleted: false,
      description: 'Exam on Process Scheduling and Memory Management.',
    ),
  ];
}
