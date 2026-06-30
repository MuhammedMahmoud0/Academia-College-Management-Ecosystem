import 'package:college_project/features/tasks/cubit/tasks_cubit.dart';
import 'package:college_project/features/tasks/cubit/tasks_states.dart';
import 'package:college_project/features/tasks/models/task_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';

class TaskItemWidget extends StatelessWidget {
  /// Only the task id is stored — the live TaskModel is always read from
  /// the cubit's state so it never goes stale between navigations.
  final int taskId;

  const TaskItemWidget({super.key, required this.taskId});

  static const Color _primary = Color(0xFF6C63FF);

  @override
  Widget build(BuildContext context) {
    // Re-read the task from the cubit on every build so we always have the
    // latest submission data, even after navigating away and coming back.
    final task = context.select<TasksCubit, TaskModel>((cubit) {
      return cubit.currentTasks.firstWhere((t) => t.id == taskId);
    });

    final isSubmitted = task.isSubmitted;

    return Container(
      margin: EdgeInsets.only(bottom: 16.h),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.hardEdge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Gradient top bar ──────────────────────────────────────────
          Container(
            height: 5.h,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isSubmitted
                    ? [Colors.green.shade400, Colors.teal.shade300]
                    : [_primary, Colors.purpleAccent.shade100],
              ),
            ),
          ),

          Padding(
            padding: EdgeInsets.all(18.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Lecture badge + Done chip ─────────────────────────
                Row(
                  children: [
                    _LectureBadge(
                      lectureId: task.lectureId,
                      tutorialLabId: task.tutorialLabId,
                    ),
                    const Spacer(),
                    if (isSubmitted) _DoneChip(),
                  ],
                ),
                SizedBox(height: 12.h),

                // ── Title ─────────────────────────────────────────────
                Text(
                  task.title,
                  style: TextStyle(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                SizedBox(height: 6.h),

                // ── Description ───────────────────────────────────────
                Text(
                  task.description,
                  style: TextStyle(
                    fontSize: 13.sp,
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withOpacity(0.6),
                    height: 1.4,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 16.h),

                // ── Assigned date ─────────────────────────────────────
                Row(
                  children: [
                    Icon(
                      Icons.calendar_today_outlined,
                      size: 14.sp,
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.5),
                    ),
                    SizedBox(width: 6.w),
                    Text(
                      'Assigned',
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: Colors.grey.shade500,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      DateFormat('M/d/yyyy').format(task.createdAt.toLocal()),
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: Theme.of(
                          context,
                        ).colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.h),

                // ── Due date pill ─────────────────────────────────────
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 14.w,
                    vertical: 10.h,
                  ),
                  decoration: BoxDecoration(
                    color: _primary.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(12.r),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.access_time_rounded,
                        size: 15.sp,
                        color: _primary,
                      ),
                      SizedBox(width: 8.w),
                      Text(
                        'Due By',
                        style: TextStyle(
                          fontSize: 12.sp,
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurface.withOpacity(0.7),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        DateFormat(
                          'MMM d, yyyy, hh:mm a',
                        ).format(task.dueDate.toLocal()),
                        style: TextStyle(
                          fontSize: 12.sp,
                          fontWeight: FontWeight.bold,
                          color: _primary,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 16.h),

                // ── Action button ─────────────────────────────────────
                isSubmitted
                    ? _ViewSubmissionButton(task: task)
                    : _SubmitButton(task: task),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Lecture badge ────────────────────────────────────────────────────────────
class _LectureBadge extends StatelessWidget {
  final int? lectureId;
  final int? tutorialLabId;

  const _LectureBadge({this.lectureId, this.tutorialLabId});

  @override
  Widget build(BuildContext context) {
    final int? id = lectureId ?? tutorialLabId;
    final String label = lectureId != null
        ? 'Lecture #$lectureId'
        : tutorialLabId != null
        ? 'Lab #$tutorialLabId'
        : '';

    if (id == null) return const SizedBox.shrink();

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 5.h),
      decoration: BoxDecoration(
        color: const Color(0xFF6C63FF).withOpacity(0.1),
        borderRadius: BorderRadius.circular(20.r),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11.sp,
          fontWeight: FontWeight.bold,
          color: const Color(0xFF6C63FF),
        ),
      ),
    );
  }
}

// ─── Done chip ────────────────────────────────────────────────────────────────
class _DoneChip extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 5.h),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20.r),
        border: Border.all(color: Colors.green.shade300, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.check_circle_outline_rounded,
            size: 13.sp,
            color: Colors.green.shade600,
          ),
          SizedBox(width: 4.w),
          Text(
            'Done',
            style: TextStyle(
              fontSize: 11.sp,
              fontWeight: FontWeight.bold,
              color: Colors.green.shade600,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Submit button ────────────────────────────────────────────────────────────
class _SubmitButton extends StatelessWidget {
  final TaskModel task;
  const _SubmitButton({required this.task});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48.h,
      child: ElevatedButton.icon(
        onPressed: () => _showSubmitSheet(context, task),
        icon: Icon(Icons.cloud_upload_outlined, size: 18.sp),
        label: Text(
          'Submit Solution',
          style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF6C63FF),
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14.r),
          ),
        ),
      ),
    );
  }
}

// ─── View submission button ───────────────────────────────────────────────────
class _ViewSubmissionButton extends StatelessWidget {
  final TaskModel task;
  const _ViewSubmissionButton({required this.task});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48.h,
      child: OutlinedButton.icon(
        onPressed: () => _showSubmissionSheet(context, task),
        icon: Icon(Icons.remove_red_eye_outlined, size: 18.sp),
        label: Text('View My Submission', style: TextStyle(fontSize: 14.sp)),
        style: OutlinedButton.styleFrom(
          foregroundColor: Theme.of(context).colorScheme.onSurface,
          side: BorderSide(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14.r),
          ),
        ),
      ),
    );
  }
}

// ─── Submit bottom sheet ──────────────────────────────────────────────────────
void _showSubmitSheet(BuildContext context, TaskModel task) {
  final cubit = context.read<TasksCubit>();
  final controller = TextEditingController();

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Theme.of(context).colorScheme.surface,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28.r)),
    ),
    builder: (sheetCtx) => Padding(
      padding: EdgeInsets.only(
        left: 24.w,
        right: 24.w,
        top: 20.h,
        bottom: MediaQuery.of(sheetCtx).viewInsets.bottom + 32.h,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40.w,
              height: 4.h,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2.r),
              ),
            ),
          ),
          SizedBox(height: 20.h),

          // Header
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Submit Task',
                      style: TextStyle(
                        fontSize: 20.sp,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4.h),
                    Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 13.sp,
                        color: Colors.grey.shade500,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: Icon(Icons.close, color: Colors.grey.shade500),
                onPressed: () => Navigator.pop(sheetCtx),
              ),
            ],
          ),
          Divider(height: 28.h),

          // Label
          Row(
            children: [
              Icon(
                Icons.link_rounded,
                size: 18.sp,
                color: const Color(0xFF6C63FF),
              ),
              SizedBox(width: 8.w),
              Text(
                'Submission Link / Content',
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF6C63FF),
                ),
              ),
            ],
          ),
          SizedBox(height: 10.h),

          // Input
          TextField(
            controller: controller,
            maxLines: 5,
            decoration: InputDecoration(
              hintText:
                  'Paste your GitHub repository link, drive link, or plain text solution here...',
              hintStyle: TextStyle(
                fontSize: 13.sp,
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              ),
              filled: true,
              fillColor: Theme.of(context).colorScheme.surfaceContainerHighest,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16.r),
                borderSide: BorderSide.none,
              ),
              contentPadding: EdgeInsets.symmetric(
                horizontal: 16.w,
                vertical: 14.h,
              ),
            ),
          ),
          SizedBox(height: 10.h),

          Row(
            children: [
              Icon(
                Icons.info_outline,
                size: 14.sp,
                color: Colors.grey.shade600,
              ),
              SizedBox(width: 6.w),
              Expanded(
                child: Text(
                  'Make sure your links are public or accessible to the instructor.',
                  style: TextStyle(
                    fontSize: 11.sp,
                    color: Colors.grey.shade600,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 20.h),

          // Confirm button
          BlocConsumer<TasksCubit, TasksState>(
            bloc: cubit,
            listener: (ctx, state) {
              if (state is TaskSubmitSuccess) {
                Navigator.pop(sheetCtx);
                ScaffoldMessenger.of(ctx).showSnackBar(
                  const SnackBar(
                    content: Text('Submitted successfully!'),
                    backgroundColor: Colors.green,
                  ),
                );
              } else if (state is TaskSubmitError) {
                final alreadySaved = state.tasks.any(
                  (t) => t.id == task.id && t.isSubmitted,
                );
                if (alreadySaved) {
                  Navigator.pop(sheetCtx);
                } else {
                  ScaffoldMessenger.of(ctx).showSnackBar(
                    SnackBar(
                      content: Text(state.message),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            builder: (ctx, state) {
              final isLoading = state is TaskSubmitting;
              return SizedBox(
                width: double.infinity,
                height: 52.h,
                child: ElevatedButton.icon(
                  onPressed: isLoading
                      ? null
                      : () {
                          if (controller.text.trim().isEmpty) {
                            ScaffoldMessenger.of(ctx).showSnackBar(
                              const SnackBar(
                                content: Text('Please enter your submission.'),
                              ),
                            );
                            return;
                          }
                          cubit.submitTask(
                            taskId: task.id,
                            content: controller.text.trim(),
                          );
                        },
                  icon: isLoading
                      ? SizedBox(
                          width: 18.w,
                          height: 18.h,
                          child: const CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Icon(Icons.cloud_upload_outlined, size: 20.sp),
                  label: Text(
                    isLoading ? 'Submitting...' : 'Confirm Submission',
                    style: TextStyle(
                      fontSize: 15.sp,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6C63FF),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.r),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    ),
  );
}

// ─── View submission bottom sheet ─────────────────────────────────────────────
void _showSubmissionSheet(BuildContext context, TaskModel task) {
  final cubit = context.read<TasksCubit>();
  //  debugPrint("task submission ${task.submission?.toString()}");
  String statusLabel(String s) {
    switch (s) {
      case 'pending_review':
        return 'Pending Review';
      case 'graded':
        return 'Graded';
      default:
        return s
            .replaceAll('_', ' ')
            .split(' ')
            .map(
              (w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}',
            )
            .join(' ');
    }
  }

  Color statusColor(String s) {
    switch (s) {
      case 'pending_review':
        return Colors.orange;
      case 'graded':
        return Colors.green;
      default:
        return Colors.blue;
    }
  }

  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.white,
    isScrollControlled: true,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28.r)),
    ),
    builder: (sheetCtx) => BlocProvider.value(
      value: cubit,
      child: BlocConsumer<TasksCubit, TasksState>(
        bloc: cubit,
        listener: (ctx, state) {
          if (state is TaskDeleteSubmissionSuccess) {
            Navigator.pop(sheetCtx);
            ScaffoldMessenger.of(ctx).showSnackBar(
              const SnackBar(
                content: Text('Submission deleted.'),
                backgroundColor: Colors.orange,
              ),
            );
          } else if (state is TaskDeleteSubmissionError) {
            ScaffoldMessenger.of(ctx).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        builder: (ctx, state) {
          // Always read the freshest task from live state
          final tasks = switch (state) {
            TasksLoaded s => s.tasks,
            TaskSubmitting s => s.tasks,
            TaskSubmitSuccess s => s.tasks,
            TaskSubmitError s => s.tasks,
            TaskDeletingSubmission s => s.tasks,
            TaskDeleteSubmissionSuccess s => s.tasks,
            TaskDeleteSubmissionError s => s.tasks,
            _ => <TaskModel>[],
          };

          final liveTask = tasks.firstWhere(
            (t) => t.id == task.id,
            orElse: () => task,
          );
          final submission = liveTask.submission;

          if (submission == null) return const SizedBox.shrink();

          final isDeleting = state is TaskDeletingSubmission;

          return Padding(
            padding: EdgeInsets.fromLTRB(24.w, 20.h, 24.w, 36.h),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Handle
                Center(
                  child: Container(
                    width: 40.w,
                    height: 4.h,
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(2.r),
                    ),
                  ),
                ),
                SizedBox(height: 20.h),

                // Header
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Your Submission',
                            style: TextStyle(
                              fontSize: 20.sp,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4.h),
                          Text(
                            liveTask.title,
                            style: TextStyle(
                              fontSize: 13.sp,
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurface.withOpacity(0.5),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Status badge
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12.w,
                        vertical: 6.h,
                      ),
                      decoration: BoxDecoration(
                        color: statusColor(submission.status).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20.r),
                      ),
                      child: Text(
                        statusLabel(submission.status),
                        style: TextStyle(
                          fontSize: 11.sp,
                          fontWeight: FontWeight.bold,
                          color: statusColor(submission.status),
                        ),
                      ),
                    ),
                    SizedBox(width: 8.w),
                    IconButton(
                      icon: Icon(Icons.close, color: Colors.grey.shade500),
                      onPressed: () => Navigator.pop(sheetCtx),
                    ),
                  ],
                ),
                Divider(height: 28.h),

                // Submitted content
                Text(
                  'Submitted Content:',
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 10.h),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(14.w),
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  child: Text(
                    submission.content,
                    style: TextStyle(
                      fontSize: 13.sp,
                      color: Theme.of(context).colorScheme.onSurface,
                      height: 1.5,
                    ),
                  ),
                ),
                SizedBox(height: 16.h),

                // Submitted on
                Row(
                  children: [
                    Icon(
                      Icons.access_time_rounded,
                      size: 15.sp,
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurface.withOpacity(0.5),
                    ),
                    SizedBox(width: 8.w),
                    Text(
                      'Submitted on: ',
                      style: TextStyle(
                        fontSize: 13.sp,
                        color: Theme.of(
                          context,
                        ).colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                    Text(
                      DateFormat(
                        'MMM d, yyyy, hh:mm a',
                      ).format(submission.submittedAt.toLocal()),
                      style: TextStyle(
                        fontSize: 13.sp,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12.h),

                // Grade (only shown when graded)
                if (submission.grade != null)
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.symmetric(
                      horizontal: 16.w,
                      vertical: 12.h,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12.r),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.grade_rounded,
                          size: 18.sp,
                          color: Colors.green.shade600,
                        ),
                        SizedBox(width: 8.w),
                        Text(
                          'Grade: ',
                          style: TextStyle(
                            fontSize: 13.sp,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                        Text(
                          '${submission.grade}',
                          style: TextStyle(
                            fontSize: 15.sp,
                            fontWeight: FontWeight.bold,
                            color: Colors.green.shade700,
                          ),
                        ),
                      ],
                    ),
                  ),
                SizedBox(height: 24.h),

                // Delete & Re-submit button
                SizedBox(
                  width: double.infinity,
                  height: 52.h,
                  child: ElevatedButton.icon(
                    onPressed: isDeleting
                        ? null
                        : () => cubit.deleteSubmission(taskId: task.id),
                    icon: isDeleting
                        ? SizedBox(
                            width: 18.w,
                            height: 18.h,
                            child: const CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : Icon(Icons.delete_outline_rounded, size: 20.sp),
                    label: Text(
                      isDeleting ? 'Deleting...' : 'Delete & Re-submit',
                      style: TextStyle(
                        fontSize: 15.sp,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade400,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.r),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    ),
  );
}
