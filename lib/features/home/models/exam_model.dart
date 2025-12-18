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
    return '${months[dateTime.month - 1]} ${dateTime.day}';
  }

  String get formattedTime {
    final hour = dateTime.hour > 12 ? dateTime.hour - 12 : dateTime.hour;
    final period = dateTime.hour >= 12 ? 'PM' : 'AM';
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$hour:$minute $period';
  }

  // Mock data
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
      dateTime: DateTime.now().add(const Duration(days: 12)),
      location: 'Hall A-301',
      duration: const Duration(hours: 2),
    ),
  ];
}
