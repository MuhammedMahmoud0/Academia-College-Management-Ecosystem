import 'package:college_project/features/tasks/models/task_model.dart';

abstract class TasksState {}

class TasksInitial extends TasksState {}

class TasksLoading extends TasksState {}

class TasksLoaded extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;

  TasksLoaded({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
  });

  TasksLoaded copyWith({List<TaskModel>? tasks}) {
    final updated = tasks ?? this.tasks;
    return TasksLoaded(
      tasks: updated,
      pendingCount: updated.where((t) => !t.isSubmitted).length,
      submittedCount: updated.where((t) => t.isSubmitted).length,
    );
  }
}

class TasksError extends TasksState {
  final String message;
  TasksError({required this.message});
}

// Submission states
class TaskSubmitting extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  TaskSubmitting({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
  });
}

class TaskSubmitSuccess extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  TaskSubmitSuccess({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
  });
}

class TaskSubmitError extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  final String message;
  TaskSubmitError({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
    required this.message,
  });
}

// Delete submission states
class TaskDeletingSubmission extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  TaskDeletingSubmission({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
  });
}

class TaskDeleteSubmissionSuccess extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  TaskDeleteSubmissionSuccess({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
  });
}

class TaskDeleteSubmissionError extends TasksState {
  final List<TaskModel> tasks;
  final int pendingCount;
  final int submittedCount;
  final String message;
  TaskDeleteSubmissionError({
    required this.tasks,
    required this.pendingCount,
    required this.submittedCount,
    required this.message,
  });
}
