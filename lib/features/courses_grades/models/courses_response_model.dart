class CoursesResponseModel {
  final List<CourseModel> courses;
  final double cumulativeGPA;
  final int totalCredits;

  CoursesResponseModel({
    required this.courses,
    required this.cumulativeGPA,
    required this.totalCredits,
  });

  factory CoursesResponseModel.fromJson(Map<String, dynamic> json) {
    return CoursesResponseModel(
      courses: (json['courses'] as List<dynamic>)
          .map((course) => CourseModel.fromJson(course as Map<String, dynamic>))
          .toList(),
      cumulativeGPA: (json['cumulativeGPA'] as num).toDouble(),
      totalCredits: json['totalCredits'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'courses': courses.map((course) => course.toJson()).toList(),
      'cumulativeGPA': cumulativeGPA,
      'totalCredits': totalCredits,
    };
  }

  /// Get courses grouped by semester, sorted with latest semester first
  Map<String, List<CourseModel>> get coursesGroupedBySemester {
    final grouped = <String, List<CourseModel>>{};

    for (final course in courses) {
      final key = '${course.semester} ${course.year}';
      grouped.putIfAbsent(key, () => []).add(course);
    }

    // Sort by year descending, then by semester order (Fall > Spring)
    final sortedKeys = grouped.keys.toList()
      ..sort((a, b) {
        final yearA = _extractYear(a);
        final yearB = _extractYear(b);

        if (yearA != yearB) {
          return yearB.compareTo(yearA); // Descending year
        }

        // Same year, sort by semester (Fall comes after Spring in a year, so Fall should appear first)
        final semesterA = _extractSemester(a);
        final semesterB = _extractSemester(b);
        return _semesterOrder(semesterB).compareTo(_semesterOrder(semesterA));
      });

    return {for (final key in sortedKeys) key: grouped[key]!};
  }

  int _extractYear(String semesterKey) {
    final parts = semesterKey.split(' ');
    return int.tryParse(parts.last) ?? 0;
  }

  String _extractSemester(String semesterKey) {
    final parts = semesterKey.split(' ');
    return parts.first;
  }

  int _semesterOrder(String semester) {
    switch (semester.toLowerCase()) {
      case 'fall':
        return 3;
      case 'summer':
        return 2;
      case 'spring':
        return 1;
      default:
        return 0;
    }
  }

  /// Get the current/latest semester name
  String get currentSemester {
    final grouped = coursesGroupedBySemester;
    return grouped.keys.isNotEmpty ? grouped.keys.first : 'N/A';
  }
}

class CourseModel {
  final String id;
  final String code;
  final String name;
  final int credits;
  final String instructor;
  final String semester;
  final int year;
  final String? grade;
  final String status;

  CourseModel({
    required this.id,
    required this.code,
    required this.name,
    required this.credits,
    required this.instructor,
    required this.semester,
    required this.year,
    this.grade,
    required this.status,
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    return CourseModel(
      id: json['id'] as String,
      code: json['code'] as String,
      name: json['name'] as String,
      credits: json['credits'] as int,
      instructor: json['instructor'] as String,
      semester: json['semester'] as String,
      year: json['year'] as int,
      grade: json['grade'] as String?,
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'credits': credits,
      'instructor': instructor,
      'semester': semester,
      'year': year,
      'grade': grade,
      'status': status,
    };
  }

  bool get isInProgress =>
      status.toLowerCase() == 'in_progress' ||
      status.toLowerCase() == 'inprogress' ||
      status.toLowerCase() == 'in progress';

  double? get gradePoints {
    if (grade == null || isInProgress) return null;
    return _gradeToPoints(grade!);
  }

  double _gradeToPoints(String gradeStr) {
    switch (gradeStr.toUpperCase()) {
      case 'A+':
      case 'A':
        return 4.0;
      case 'A-':
        return 3.7;
      case 'B+':
        return 3.3;
      case 'B':
        return 3.0;
      case 'B-':
        return 2.7;
      case 'C+':
        return 2.3;
      case 'C':
        return 2.0;
      case 'C-':
        return 1.7;
      case 'D+':
        return 1.3;
      case 'D':
        return 1.0;
      case 'D-':
        return 0.7;
      case 'F':
        return 0.0;
      default:
        return 0.0;
    }
  }

  String get semesterYear => '$semester $year';
}