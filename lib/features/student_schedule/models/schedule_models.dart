import 'package:flutter/material.dart';

/// Represents a single course session in the schedule
class ScheduleSlot {
  final String courseName;
  final String courseCode;
  final String hall;
  final String instructor;
  final int dayIndex; // 0 = Sunday, 1 = Monday, etc.
  final int timeSlotIndex; // Index in the time slots list
  final int
  duration; // Number of time slots this session spans (usually 1 or 2)
  final Color color;

  ScheduleSlot({
    required this.courseName,
    required this.courseCode,
    required this.hall,
    required this.instructor,
    required this.dayIndex,
    required this.timeSlotIndex,
    this.duration = 1,
    required this.color,
  });

  // Create a copy with modified fields
  ScheduleSlot copyWith({
    String? courseName,
    String? courseCode,
    String? hall,
    String? instructor,
    int? dayIndex,
    int? timeSlotIndex,
    int? duration,
    Color? color,
  }) {
    return ScheduleSlot(
      courseName: courseName ?? this.courseName,
      courseCode: courseCode ?? this.courseCode,
      hall: hall ?? this.hall,
      instructor: instructor ?? this.instructor,
      dayIndex: dayIndex ?? this.dayIndex,
      timeSlotIndex: timeSlotIndex ?? this.timeSlotIndex,
      duration: duration ?? this.duration,
      color: color ?? this.color,
    );
  }
}

/// Represents a time slot in the schedule
class TimeSlot {
  final String startTime;
  final String endTime;
  final String label; // e.g., "08:00 - 09:30"

  TimeSlot({required this.startTime, required this.endTime})
    : label = '$startTime - $endTime';

  @override
  String toString() => label;
}

/// Represents the weekly schedule configuration
class WeeklySchedule {
  final List<String> days;
  final List<TimeSlot> timeSlots;
  final List<ScheduleSlot> sessions;

  WeeklySchedule({
    required this.days,
    required this.timeSlots,
    required this.sessions,
  });

  /// Get sessions for a specific day and time slot
  List<ScheduleSlot> getSessionsForSlot(int dayIndex, int timeSlotIndex) {
    return sessions.where((session) {
      return session.dayIndex == dayIndex &&
          session.timeSlotIndex <= timeSlotIndex &&
          (session.timeSlotIndex + session.duration) > timeSlotIndex;
    }).toList();
  }

  /// Check if a slot is occupied
  bool isSlotOccupied(int dayIndex, int timeSlotIndex) {
    return getSessionsForSlot(dayIndex, timeSlotIndex).isNotEmpty;
  }

  /// Default schedule configuration (Sunday-Thursday, 8 AM - 5 PM)
  static WeeklySchedule get defaultSchedule {
    return WeeklySchedule(
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
      timeSlots: [
        TimeSlot(startTime: '08:00', endTime: '09:30'),
        TimeSlot(startTime: '09:30', endTime: '11:00'),
        TimeSlot(startTime: '11:00', endTime: '12:30'),
        TimeSlot(startTime: '12:30', endTime: '02:00'),
        TimeSlot(startTime: '02:00', endTime: '03:30'),
        TimeSlot(startTime: '03:30', endTime: '05:00'),
      ],
      sessions: [],
    );
  }

  /// Mock schedule for testing
  static WeeklySchedule get mockSchedule {
    const pastelColors = [
      Color(0xFF4A90E2), // Blue
      Color(0xFFF5A623), // Orange
      Color(0xFF7B61FF), // Purple
      Color(0xFF2ECC71), // Green
      Color(0xFFE74C3C), // Red
      Color(0xFF1ABC9C), // Teal
      Color(0xFF34495E), // Dark Gray / Navy
    ];

    return WeeklySchedule(
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      timeSlots: [
        TimeSlot(startTime: '08:00', endTime: '09:30'),
        TimeSlot(startTime: '09:30', endTime: '11:00'),
        TimeSlot(startTime: '11:00', endTime: '12:30'),
        TimeSlot(startTime: '12:30', endTime: '02:00'),
        TimeSlot(startTime: '02:00', endTime: '03:30'),
        TimeSlot(startTime: '03:30', endTime: '05:00'),
      ],
      sessions: [
        // Sunday
        ScheduleSlot(
          courseName: 'Data Structures',
          courseCode: 'CS 201',
          hall: 'Hall A-301',
          instructor: 'Dr. Ahmed Hassan',
          dayIndex: 0,
          timeSlotIndex: 0,
          duration: 2,
          color: pastelColors[0],
        ),
        ScheduleSlot(
          courseName: 'Calculus II',
          courseCode: 'MATH 202',
          hall: 'Hall B-105',
          instructor: 'Dr. Sarah Mohamed',
          dayIndex: 0,
          timeSlotIndex: 3,
          color: pastelColors[1],
        ),

        // Monday
        ScheduleSlot(
          courseName: 'Digital Logic',
          courseCode: 'CS 205',
          hall: 'Lab C-210',
          instructor: 'Dr. Omar Ali',
          dayIndex: 1,
          timeSlotIndex: 1,
          duration: 2,
          color: pastelColors[2],
        ),
        ScheduleSlot(
          courseName: 'Physics II',
          courseCode: 'PHYS 201',
          hall: 'Hall A-150',
          instructor: 'Dr. Mona Ibrahim',
          dayIndex: 1,
          timeSlotIndex: 4,
          color: pastelColors[3],
        ),

        // Tuesday
        ScheduleSlot(
          courseName: 'Data Structures',
          courseCode: 'CS 201',
          hall: 'Hall A-301',
          instructor: 'Dr. Ahmed Hassan',
          dayIndex: 2,
          timeSlotIndex: 0,
          duration: 2,
          color: pastelColors[0],
        ),
        ScheduleSlot(
          courseName: 'English II',
          courseCode: 'ENG 102',
          hall: 'Hall D-220',
          instructor: 'Ms. Layla Khaled',
          dayIndex: 2,
          timeSlotIndex: 3,
          color: pastelColors[4],
        ),

        // Wednesday
        ScheduleSlot(
          courseName: 'Digital Logic',
          courseCode: 'CS 205',
          hall: 'Lab C-210',
          instructor: 'Dr. Omar Ali',
          dayIndex: 3,
          timeSlotIndex: 1,
          duration: 2,
          color: pastelColors[2],
        ),
        ScheduleSlot(
          courseName: 'Calculus II',
          courseCode: 'MATH 202',
          hall: 'Hall B-105',
          instructor: 'Dr. Sarah Mohamed',
          dayIndex: 3,
          timeSlotIndex: 4,
          color: pastelColors[1],
        ),

        // Thursday
        ScheduleSlot(
          courseName: 'Database Systems',
          courseCode: 'CS 301',
          hall: 'Hall A-401',
          instructor: 'Dr. Karim Youssef',
          dayIndex: 4,
          timeSlotIndex: 0,
          color: pastelColors[5],
        ),
        ScheduleSlot(
          courseName: 'Physics II',
          courseCode: 'PHYS 201',
          hall: 'Hall A-150',
          instructor: 'Dr. Mona Ibrahim',
          dayIndex: 4,
          timeSlotIndex: 2,
          color: pastelColors[3],
        ),
      ],
    );
  }
}
