import 'package:college_project/features/tasks/cubit/tasks_states.dart';
import 'package:college_project/features/tasks/models/task_model.dart';
import 'package:college_project/features/tasks/repo/tasks_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class TasksCubit extends Cubit<TasksState> {
  final _repo = TasksRepo();

  TasksCubit() : super(TasksInitial());

  List<TaskModel> get _currentTasks => currentTasks;

  /// Public — used by TaskItemWidget via context.select to always read
  /// the latest task data without holding a stale widget prop.
  List<TaskModel> get currentTasks {
    final s = state;
    if (s is TasksLoaded) return s.tasks;
    if (s is TaskSubmitting) return s.tasks;
    if (s is TaskSubmitSuccess) return s.tasks;
    if (s is TaskSubmitError) return s.tasks;
    if (s is TaskDeletingSubmission) return s.tasks;
    if (s is TaskDeleteSubmissionSuccess) return s.tasks;
    if (s is TaskDeleteSubmissionError) return s.tasks;
    return [];
  }

  // ── Fetch all tasks ───────────────────────────────────────────────────────
  Future<void> fetchTasks() async {
    emit(TasksLoading());
    try {
      final response = await _repo.getTasks();
      final tasks = response.tasks;

      final enriched = await Future.wait(
        tasks.map((task) async {
          if (!task.isSubmitted) return task;
          debugPrint("task id ${task.id}");
          final full = await _repo.getMySubmission(task.id);
          return full != null ? task.copyWith(submission: full) : task;
        }),
      );

      emit(
        TasksLoaded(
          tasks: enriched,
          pendingCount: enriched.where((t) => !t.isSubmitted).length,
          submittedCount: enriched.where((t) => t.isSubmitted).length,
        ),
      );
    } catch (e) {
      emit(TasksError(message: _friendly(e)));
    }
  }

  // ── Submit a task ─────────────────────────────────────────────────────────
  Future<void> submitTask({
    required int taskId,
    required String content,
  }) async {
    final tasks = _currentTasks;
    final counts = _counts(tasks);
    emit(
      TaskSubmitting(
        tasks: tasks,
        pendingCount: counts.$1,
        submittedCount: counts.$2,
      ),
    );
    try {
      final submission = await _repo.submitTask(
        taskId: taskId,
        content: content,
      );

      final updated = tasks.map((t) {
        if (t.id == taskId) return t.copyWith(submission: submission);
        return t;
      }).toList();

      emit(
        TaskSubmitSuccess(
          tasks: updated,
          pendingCount: updated.where((t) => !t.isSubmitted).length,
          submittedCount: updated.where((t) => t.isSubmitted).length,
        ),
      );
    } catch (e) {
      emit(
        TaskSubmitError(
          tasks: tasks,
          pendingCount: counts.$1,
          submittedCount: counts.$2,
          message: _friendly(e),
        ),
      );
    }
  }

  // ── Delete a submission ───────────────────────────────────────────────────
  Future<void> deleteSubmission({required int taskId}) async {
    final tasks = _currentTasks;
    final counts = _counts(tasks);
    emit(
      TaskDeletingSubmission(
        tasks: tasks,
        pendingCount: counts.$1,
        submittedCount: counts.$2,
      ),
    );
    try {
      await _repo.deleteSubmission(taskId: taskId);

      final updated = tasks.map((t) {
        if (t.id == taskId) return t.copyWith(clearSubmission: true);
        return t;
      }).toList();

      emit(
        TaskDeleteSubmissionSuccess(
          tasks: updated,
          pendingCount: updated.where((t) => !t.isSubmitted).length,
          submittedCount: updated.where((t) => t.isSubmitted).length,
        ),
      );
    } catch (e) {
      emit(
        TaskDeleteSubmissionError(
          tasks: tasks,
          pendingCount: counts.$1,
          submittedCount: counts.$2,
          message: _friendly(e),
        ),
      );
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  (int, int) _counts(List<TaskModel> tasks) => (
    tasks.where((t) => !t.isSubmitted).length,
    tasks.where((t) => t.isSubmitted).length,
  );

  String _friendly(Object e) => e.toString().replaceFirst('Exception: ', '');
}
