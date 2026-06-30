import 'package:flutter/material.dart';

class ExamsResponseModel {
  final bool success;
  final int count;
  final List<ExamModel> data;

  ExamsResponseModel({
    required this.success,
    required this.count,
    required this.data,
  });

  factory ExamsResponseModel.fromJson(Map<String, dynamic> json) {
    return ExamsResponseModel(
      success: json['success'] as bool,
      count: json['count'] as int,
      data: (json['data'] as List<dynamic>)
          .map((exam) => ExamModel.fromJson(exam as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'count': count,
      'data': data.map((exam) => exam.toJson()).toList(),
    };
  }

  /// Get upcoming exams (exam date is in the future)
  List<ExamModel> get upcomingExams {
    final now = DateTime.now();
    return data.where((exam) => exam.examDateTime.isAfter(now)).toList()
      ..sort((a, b) => a.examDateTime.compareTo(b.examDateTime));
  }

  /// Get completed exams (exam date is in the past)
  List<ExamModel> get completedExams {
    final now = DateTime.now();
    return data.where((exam) => exam.examDateTime.isBefore(now)).toList()
      ..sort((a, b) => b.examDateTime.compareTo(a.examDateTime));
  }
}

class ExamModel {
  final int examId;
  final String courseCode;
  final String courseName;
  final String examType;
  final DateTime examDate; // ← غيرناها DateTime
  final String dayOfWeek;
  final String startTime;
  final String endTime;
  final String location;
  final String semester;
  final int year;
  final String instructor;

  ExamModel({
    required this.examId,
    required this.courseCode,
    required this.courseName,
    required this.examType,
    required this.examDate,
    required this.dayOfWeek,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.semester,
    required this.year,
    required this.instructor,
  });

  factory ExamModel.fromJson(Map<String, dynamic> json) {
    return ExamModel(
      examId: json['exam_id'] as int,
      courseCode: json['course_code'] as String,
      courseName: json['course_name'] as String,
      examType: json['exam_type'] as String,
      examDate: DateTime.parse(json['exam_date']).toLocal(), // ✅ مهم
      dayOfWeek: json['day_of_week'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      location: json['location'] as String,
      semester: json['semester'] as String,
      year: json['year'] as int,
      instructor: json['instructor'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'exam_id': examId,
      'course_code': courseCode,
      'course_name': courseName,
      'exam_type': examType,
      'exam_date': examDate.toUtc().toIso8601String(),
      'day_of_week': dayOfWeek,
      'start_time': startTime,
      'end_time': endTime,
      'location': location,
      'semester': semester,
      'year': year,
      'instructor': instructor,
    };
  }

  // ✅ دمج التاريخ مع start_time
  DateTime get examDateTime {
    final timeParts = startTime.split(':');
    return DateTime(
      examDate.year,
      examDate.month,
      examDate.day,
      int.parse(timeParts[0]),
      int.parse(timeParts[1]),
    );
  }

  // ✅ دمج التاريخ مع end_time
  DateTime get examEndDateTime {
    final timeParts = endTime.split(':');
    return DateTime(
      examDate.year,
      examDate.month,
      examDate.day,
      int.parse(timeParts[0]),
      int.parse(timeParts[1]),
    );
  }

  Duration get duration => examEndDateTime.difference(examDateTime);

  String get formattedDuration {
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    return hours > 0
        ? (minutes > 0 ? '${hours}h ${minutes}m' : '${hours}h')
        : '${minutes}m';
  }

  int get daysRemaining {
    final now = DateTime.now();
    final diff = examDateTime.difference(now).inDays;
    return diff < 0 ? 0 : diff; // ✅ منع السالب
  }

  bool get isUpcoming => examDateTime.isAfter(DateTime.now());
  bool get isCompleted => examDateTime.isBefore(DateTime.now());

  String get statusString => isUpcoming ? 'upcoming' : 'completed';

  Color get statusColor =>
      isUpcoming ? const Color(0xFF6366F1) : const Color(0xFF10B981);

  Color get examTypeColor {
    switch (examType.toLowerCase()) {
      case 'midterm':
        return const Color(0xFFF59E0B);
      case 'final':
        return const Color(0xFFEF4444);
      case 'quiz':
        return const Color(0xFF3B82F6);
      default:
        return const Color(0xFF6366F1);
    }
  }

  String get formattedDate =>
      '${examDate.day}/${examDate.month}/${examDate.year}';

  String get formattedTime =>
      '${_formatTime(startTime)} - ${_formatTime(endTime)}';

  String _formatTime(String time) {
    final parts = time.split(':');
    final hour = int.parse(parts[0]);
    final minute = parts[1];
    final period = hour >= 12 ? 'PM' : 'AM';
    final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
    return '$displayHour:$minute $period';
  }
}
