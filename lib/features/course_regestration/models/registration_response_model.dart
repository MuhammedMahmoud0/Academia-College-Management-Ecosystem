class RegistrationResponseModel {
  final String semester;
  final List<CourseOffering> offerings;

  RegistrationResponseModel({required this.semester, required this.offerings});

  factory RegistrationResponseModel.fromJson(Map<String, dynamic> json) {
    return RegistrationResponseModel(
      semester: json['semester'] as String,
      offerings: (json['offerings'] as List<dynamic>)
          .map((e) => CourseOffering.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'semester': semester,
      'offerings': offerings.map((e) => e.toJson()).toList(),
    };
  }
}

class CourseOffering {
  final int offeringId;
  final String courseName;
  final String courseCode;
  final int creditHours;
  final List<SessionModel> lectures;
  final List<SessionModel> labs;

  CourseOffering({
    required this.offeringId,
    required this.courseName,
    required this.courseCode,
    required this.creditHours,
    required this.lectures,
    required this.labs,
  });

  factory CourseOffering.fromJson(Map<String, dynamic> json) {
    return CourseOffering(
      offeringId: json['offeringId'] as int,
      courseName: json['courseName'] as String,
      courseCode: json['courseCode'] as String,
      creditHours: json['creditHours'] as int,
      lectures: (json['lectures'] as List<dynamic>)
          .map((e) => SessionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      labs: (json['labs'] as List<dynamic>)
          .map((e) => SessionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'offeringId': offeringId,
      'courseName': courseName,
      'courseCode': courseCode,
      'creditHours': creditHours,
      'lectures': lectures.map((e) => e.toJson()).toList(),
      'labs': labs.map((e) => e.toJson()).toList(),
    };
  }

  /// Check if the course has any enrolled lecture
  bool get hasEnrolledLecture => lectures.any((l) => l.enrolled);

  /// Check if the course has any enrolled lab
  bool get hasEnrolledLab => labs.any((l) => l.enrolled);

  /// Check if the course is fully enrolled (has both lecture and lab if labs exist)
  bool get isFullyEnrolled =>
      hasEnrolledLecture && (labs.isEmpty || hasEnrolledLab);

  /// Get the enrolled lecture if any
  SessionModel? get enrolledLecture => lectures
      .cast<SessionModel?>()
      .firstWhere((l) => l!.enrolled, orElse: () => null);

  /// Get the enrolled lab if any
  SessionModel? get enrolledLab => labs.cast<SessionModel?>().firstWhere(
    (l) => l!.enrolled,
    orElse: () => null,
  );

  /// Get available seats text for display
  String get seatsText {
    if (lectures.isEmpty) return 'N/A';
    final firstLecture = lectures.first;
    final available = firstLecture.availableSeats;
    return '$available/${firstLecture.capacity}';
  }
}

class SessionModel {
  final int id;
  final String groupNumber;
  final String dayOfWeek;
  final String startTime;
  final String endTime;
  final String location;
  final String instructor;
  final int capacity;
  final String type;
  final bool enrolled;
  final int availableSeats;

  SessionModel({
    required this.id,
    required this.groupNumber,
    required this.dayOfWeek,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.instructor,
    required this.capacity,
    required this.type,
    required this.enrolled,
    required this.availableSeats,
  });

  factory SessionModel.fromJson(Map<String, dynamic> json) {
    return SessionModel(
      id: json['id'] as int,
      groupNumber: json['group_number'] as String,
      dayOfWeek: json['day_of_week'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      location: json['location'] as String,
      instructor: json['instructor'] as String,
      capacity: json['capacity'] as int,
      type: json['type'] as String,
      enrolled: json['enrolled'] as bool? ?? false,
      availableSeats: json['available_seats'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'group_number': groupNumber,
      'day_of_week': dayOfWeek,
      'start_time': startTime,
      'end_time': endTime,
      'location': location,
      'instructor': instructor,
      'capacity': capacity,
      'type': type,
      'enrolled': enrolled,
      'available_seats': availableSeats,
    };
  }

  bool get isLecture => type.toLowerCase() == 'lecture';
  bool get isLab => type.toLowerCase() == 'lab';

  /// Get formatted time string
  String get formattedTime => '$startTime - $endTime';

  /// Get formatted schedule string
  String get scheduleText => '$dayOfWeek • $formattedTime';

  /// Check if session is full
  bool get isFull => availableSeats <= 0;
}
