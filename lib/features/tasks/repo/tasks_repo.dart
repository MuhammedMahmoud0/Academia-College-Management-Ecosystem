import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/features/tasks/models/task_model.dart';
import 'package:flutter/material.dart';

class TasksRepo {
  final _dio = ApiClient();

  // GET /tasks/my/available
  Future<TasksResponse> getTasks() async {
    final response = await _dio.get(Endpoints.myAvailableTasks);
    return TasksResponse.fromJson(response.data as Map<String, dynamic>);
  }

  // GET /tasks/{id}/my-submission
  Future<TaskSubmission?> getMySubmission(int taskId) async {
    try {
      final response = await _dio.get(Endpoints.myTaskSubmission(taskId));
      final data = response.data as Map<String, dynamic>?;
      if (data == null) return null;
      //  debugPrint("submission for $taskId ${TaskSubmission.fromJson(data).toString()}");
      debugPrint("submission ${data['submission'].toString()}");
      return TaskSubmission.fromJson(data['submission']);
    } catch (_) {
      return null;
    }
  }

  // POST /tasks/{id}/submit  — body key is "submission_content"
  Future<TaskSubmission> submitTask({
    required int taskId,
    required String content,
  }) async {
    final response = await _dio.post(
      Endpoints.submitTask(taskId),
      data: {'submission_content': content},
    );
    final data = response.data as Map<String, dynamic>;
    // The submit response may wrap the submission under "submission"
    // or return it directly — handle both
    final submissionJson = data.containsKey('submission')
        ? data['submission']
        : data;
    return TaskSubmission.fromJson(submissionJson as Map<String, dynamic>);
  }

  // DELETE /tasks/{taskId}/my-submission
  Future<void> deleteSubmission({required int taskId}) async {
    await _dio.delete(Endpoints.myTaskSubmission(taskId));
  }
}
