class Grade {
  final String courseId;
  final String courseName;
  final String courseCode;
  final String semester;
  final int creditHours;
  final String? grade;
  final double? gradePoints;
  final bool isInProgress;

  const Grade({
    required this.courseId,
    required this.courseName,
    required this.courseCode,
    required this.semester,
    required this.creditHours,
    this.grade,
    this.gradePoints,
    this.isInProgress = false,
  });

  // Mock data
  static List<Grade> mockRecentGrades = [
    const Grade(
      courseId: '1',
      courseName: 'Database Systems',
      courseCode: 'CS310',
      semester: 'Fall 2024',
      creditHours: 3,
      grade: 'A-',
      gradePoints: 3.7,
    ),
    const Grade(
      courseId: '2',
      courseName: 'Web Development',
      courseCode: 'CS320',
      semester: 'Fall 2024',
      creditHours: 3,
      grade: 'B+',
      gradePoints: 3.3,
    ),
    const Grade(
      courseId: '3',
      courseName: 'Software Engineering',
      courseCode: 'CS330',
      semester: 'Fall 2024',
      creditHours: 3,
      grade: 'A',
      gradePoints: 4.0,
    ),
  ];
}
