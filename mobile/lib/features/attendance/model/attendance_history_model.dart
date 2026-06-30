class AttendanceHistoryResponseModel {
  final int totalSessions;
  final int presentCount;
  final int absentCount;
  final double attendancePercentage;
  final List<AttendanceDayModel> history;

  AttendanceHistoryResponseModel({
    required this.totalSessions,
    required this.presentCount,
    required this.absentCount,
    required this.attendancePercentage,
    required this.history,
  });

  factory AttendanceHistoryResponseModel.fromJson(Map<String, dynamic> json) {
    return AttendanceHistoryResponseModel(
      totalSessions: json['total_sessions'] as int? ?? 0,
      presentCount: json['present_count'] as int? ?? 0,
      absentCount: json['absent_count'] as int? ?? 0,
      attendancePercentage:
          (json['attendance_percentage'] as num?)?.toDouble() ?? 0.0,
      history:
          (json['history'] as List<dynamic>?)
              ?.map(
                (e) => AttendanceDayModel.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          [],
    );
  }
}

class AttendanceDayModel {
  final String date;
  final List<AttendanceSessionModel> sessions;

  AttendanceDayModel({required this.date, required this.sessions});

  factory AttendanceDayModel.fromJson(Map<String, dynamic> json) {
    return AttendanceDayModel(
      date: json['date'] as String? ?? '',
      sessions:
          (json['sessions'] as List<dynamic>?)
              ?.map(
                (e) =>
                    AttendanceSessionModel.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          [],
    );
  }
}

class AttendanceSessionModel {
  final int attendanceId;
  final String sessionType;
  final String courseName;
  final String courseCode;
  final String group;
  final String tutorialType;
  final String location;
  final String dayOfWeek;
  final String startTime;
  final String endTime;
  final String status;
  final bool isLive;
  final double longitude;
  final double latitude;

  AttendanceSessionModel({
    required this.attendanceId,
    required this.sessionType,
    required this.courseName,
    required this.courseCode,
    required this.group,
    required this.tutorialType,
    required this.location,
    required this.dayOfWeek,
    required this.startTime,
    required this.endTime,
    required this.status,
    required this.isLive,
    required this.longitude,
    required this.latitude,
  });

  factory AttendanceSessionModel.fromJson(Map<String, dynamic> json) {
    return AttendanceSessionModel(
      attendanceId: json['attendance_id'] as int? ?? 0,
      sessionType: json['session_type'] as String? ?? '',
      courseName: json['course_name'] as String? ?? '',
      courseCode: json['course_code'] as String? ?? '',
      group: json['group'] as String? ?? '',
      tutorialType: json['tutorial_type'] as String? ?? '',
      location: json['location'] as String? ?? '',
      dayOfWeek: json['day_of_week'] as String? ?? '',
      startTime: json['start_time'] as String? ?? '',
      endTime: json['end_time'] as String? ?? '',
      status: json['status'] as String? ?? '',
      isLive: json['is_live'] as bool? ?? false,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
    );
  }

  bool get isPresent => status == 'present';
  bool get isAbsent => status == 'absent';
}
