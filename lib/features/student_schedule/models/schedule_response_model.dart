import 'package:flutter/material.dart';

class ScheduleResponseModel {
  final List<ScheduleDayModel> schedule;

  ScheduleResponseModel({required this.schedule});

  factory ScheduleResponseModel.fromJson(Map<String, dynamic> json) {
    return ScheduleResponseModel(
      schedule: (json['schedule'] as List<dynamic>)
          .map((day) => ScheduleDayModel.fromJson(day as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {'schedule': schedule.map((day) => day.toJson()).toList()};
  }
}

class ScheduleDayModel {
  final String day;
  final String date;
  final List<ScheduleClassModel> classes;

  ScheduleDayModel({
    required this.day,
    required this.date,
    required this.classes,
  });

  factory ScheduleDayModel.fromJson(Map<String, dynamic> json) {
    return ScheduleDayModel(
      day: json['day'] as String,
      date: json['date'] as String,
      classes: (json['classes'] as List<dynamic>)
          .map((c) => ScheduleClassModel.fromJson(c as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'date': date,
      'classes': classes.map((c) => c.toJson()).toList(),
    };
  }
}

class ScheduleClassModel {
  final String courseId;
  final String courseCode;
  final String courseName;
  final String startTime;
  final String endTime;
  final String location;
  final String instructor;
  final String type;

  ScheduleClassModel({
    required this.courseId,
    required this.courseCode,
    required this.courseName,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.instructor,
    required this.type,
  });

  factory ScheduleClassModel.fromJson(Map<String, dynamic> json) {
    return ScheduleClassModel(
      courseId: json['courseId'] as String,
      courseCode: json['courseCode'] as String,
      courseName: json['courseName'] as String,
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      location: json['location'] as String,
      instructor: json['instructor'] as String,
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'courseId': courseId,
      'courseCode': courseCode,
      'courseName': courseName,
      'startTime': startTime,
      'endTime': endTime,
      'location': location,
      'instructor': instructor,
      'type': type,
    };
  }

  /// Get color based on class type
  Color get color {
    switch (type.toLowerCase()) {
      case 'lecture':
        return const Color(0xFF4A90E2);
      case 'lab':
        return const Color(0xFF2ECC71);
      case 'tutorial':
        return const Color(0xFFF5A623);
      case 'section':
        return const Color(0xFF7B61FF);
      default:
        return const Color(0xFF4A90E2);
    }
  }

  /// Get formatted time range
  String get timeRange {
    final start = _formatTime(startTime);
    final end = _formatTime(endTime);
    return '$start - $end';
  }

  String _formatTime(String time) {
    final parts = time.split(':');
    if (parts.length >= 2) {
      final hour = int.parse(parts[0]);
      final minute = parts[1];
      final period = hour >= 12 ? 'PM' : 'AM';
      final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
      return '$displayHour:$minute $period';
    }
    return time;
  }
}
