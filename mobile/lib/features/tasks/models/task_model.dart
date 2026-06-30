class TaskModel {
  final int id;
  final String title;
  final String description;
  final DateTime dueDate;
  final int? lectureId;
  final int? tutorialLabId;
  final DateTime createdAt;
  final TaskSubmission? submission;

  TaskModel({
    required this.id,
    required this.title,
    required this.description,
    required this.dueDate,
    this.lectureId,
    this.tutorialLabId,
    required this.createdAt,
    this.submission,
  });

  bool get isSubmitted => submission != null;

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    // Safe int helper — returns null if value is null or 0
    int? safeInt(dynamic v) {
      if (v == null) return null;
      final n = (v as num).toInt();
      return n == 0 ? null : n; // treat 0 as "not set"
    }

    return TaskModel(
      id: (json['id'] as num).toInt(),
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      dueDate: DateTime.parse(json['due_date'] as String),
      lectureId: safeInt(json['lecture_id']),
      tutorialLabId: safeInt(json['tutorial_lab_id']),
      createdAt: DateTime.parse(json['created_at'] as String),
      submission: json['my_submission'] != null
          ? TaskSubmission.fromJson(
              json['my_submission'] as Map<String, dynamic>,
            )
          : null,
    );
  }

  TaskModel copyWith({
    TaskSubmission? submission,
    bool clearSubmission = false,
  }) {
    return TaskModel(
      id: id,
      title: title,
      description: description,
      dueDate: dueDate,
      lectureId: lectureId,
      tutorialLabId: tutorialLabId,
      createdAt: createdAt,
      submission: clearSubmission ? null : (submission ?? this.submission),
    );
  }
}

class TaskSubmission {
  final int id;
  final int? taskId;
  final String content;
  final DateTime submittedAt;
  final String status;
  final double? grade;

  TaskSubmission({
    required this.id,
    this.taskId,
    required this.content,
    required this.submittedAt,
    required this.status,
    this.grade,
  });

  factory TaskSubmission.fromJson(Map<String, dynamic> json) {
    return TaskSubmission(
      id: json['id'] != null ? (json['id'] as num).toInt() : 0,
      taskId: json['task_id'] != null ? (json['task_id'] as num).toInt() : null,
      content:
          json['submission_content']?.toString() ??
          json['content']?.toString() ??
          '',
      submittedAt: json['submitted_at'] != null
          ? DateTime.parse(json['submitted_at'] as String)
          : DateTime.now(),
      status:
          json['status']?.toString() ??
          (json['grade'] != null ? 'graded' : 'pending_review'),
      grade: json['grade'] != null ? (json['grade'] as num).toDouble() : null,
    );
  }
}

class TasksResponse {
  final List<TaskModel> tasks;
  final int total;

  TasksResponse({required this.tasks, required this.total});

  factory TasksResponse.fromJson(Map<String, dynamic> json) {
    final rawList = json['tasks'] ?? json['data'] ?? <dynamic>[];
    // API returns "total" — also handle "count" as fallback
    final totalRaw = json['total'] ?? json['count'];
    return TasksResponse(
      tasks: (rawList as List<dynamic>)
          .map((e) => TaskModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: totalRaw != null ? (totalRaw as num).toInt() : 0,
    );
  }
}
