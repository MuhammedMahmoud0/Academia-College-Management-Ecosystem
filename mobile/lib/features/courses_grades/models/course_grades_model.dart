class CourseGradesModel {
  final int lectureId;
  final String courseCode;
  final String courseName;
  final int credits;
  final String letterGrade;
  final double? totalScore;
  // final String? distribution;
  final List<GradeBreakdown> breakdown;

  CourseGradesModel({
    required this.lectureId,
    required this.courseCode,
    required this.courseName,
    required this.credits,
    required this.letterGrade,
    this.totalScore,
    // this.distribution,
    required this.breakdown,
  });

  factory CourseGradesModel.fromJson(Map<String, dynamic> json) {
    return CourseGradesModel(
      lectureId: json['lecture_id'] as int,
      courseCode: json['course_code'] as String,
      courseName: json['course_name'] as String,
      credits: json['credits'] as int,
      letterGrade: json['letter_grade'] as String,
      totalScore: json['total_score'] != null
          ? (json['total_score'] as num).toDouble()
          : null,
      //   distribution: json['distribution'] as String?,
      breakdown:
          (json['breakdown'] as List<dynamic>?)
              ?.map(
                (item) => GradeBreakdown.fromJson(item as Map<String, dynamic>),
              )
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lecture_id': lectureId,
      'course_code': courseCode,
      'course_name': courseName,
      'credits': credits,
      'letter_grade': letterGrade,
      'total_score': totalScore,
      // 'distribution': distribution,
      'breakdown': breakdown.map((item) => item.toJson()).toList(),
    };
  }

  bool get isInProgress => letterGrade == 'In Progress';

  bool get hasGrades => totalScore != null;
}

class GradeBreakdown {
  final String category;
  final double? score;
  final double? maxScore;

  GradeBreakdown({required this.category, this.score, this.maxScore});

  factory GradeBreakdown.fromJson(Map<String, dynamic> json) {
    return GradeBreakdown(
      category: json['category'] as String,
      score: json['score'] != null ? (json['score'] as num).toDouble() : null,
      maxScore: json['max_score'] != null
          ? (json['max_score'] as num).toDouble()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {'category': category, 'score': score, 'max_score': maxScore};
  }

  double? get percentage {
    if (score == null || maxScore == null || maxScore == 0) return null;
    return (score! / maxScore!) * 100;
  }

  bool get hasScore => score != null && maxScore != null;

  String get displayScore {
    if (score == null || maxScore == null) return 'N/A';
    return '${score!.toStringAsFixed(1)} / ${maxScore!.toStringAsFixed(1)}';
  }
}
