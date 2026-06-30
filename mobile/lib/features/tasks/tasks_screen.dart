import 'package:college_project/features/tasks/cubit/tasks_cubit.dart';
import 'package:college_project/features/tasks/cubit/tasks_states.dart';
import 'package:college_project/features/tasks/widgets/task_item_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({Key? key}) : super(key: key);

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  @override
  void initState() {
    super.initState();
    context.read<TasksCubit>().fetchTasks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: SafeArea(
        child: BlocConsumer<TasksCubit, TasksState>(
          listener: (context, state) {
            if (state is TaskSubmitError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is TaskDeleteSubmissionError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
          builder: (context, state) {
            // ── Loading ────────────────────────────────────────────────────
            if (state is TasksLoading || state is TasksInitial) {
              return const Center(child: CircularProgressIndicator());
            }

            // ── Error ──────────────────────────────────────────────────────
            if (state is TasksError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline_rounded,
                      size: 54.sp,
                      color: Colors.red.shade300,
                    ),
                    SizedBox(height: 16.h),
                    Text(
                      state.message,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14.sp,
                        color: Theme.of(
                          context,
                        ).colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                    SizedBox(height: 20.h),
                    ElevatedButton.icon(
                      onPressed: () => context.read<TasksCubit>().fetchTasks(),
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Retry'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6C63FF),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.r),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }

            // ── Loaded (and all transitional states that carry tasks) ──────
            final tasks = _extractTasks(state);
            final pendingCount = _extractPending(state);
            final submittedCount = _extractSubmitted(state);
            final isSubmitting =
                state is TaskSubmitting || state is TaskDeletingSubmission;

            return CustomScrollView(
              slivers: [
                // ── Header ─────────────────────────────────────────────────
                SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(20.w, 24.h, 20.w, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title row with back button
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () => Navigator.of(context).pop(),
                              child: Container(
                                padding: EdgeInsets.all(8.w),
                                decoration: BoxDecoration(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.surfaceContainerHighest,
                                  borderRadius: BorderRadius.circular(12.r),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.06),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Icon(
                                  Icons.arrow_back_ios_new_rounded,
                                  size: 18.sp,
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurface,
                                ),
                              ),
                            ),
                            SizedBox(width: 14.w),
                            Text(
                              'My Tasks',
                              style: TextStyle(
                                fontSize: 26.sp,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.onSurface,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 6.h),
                        // Subtitle
                        Text(
                          'View your assigned tasks, submit your solutions, '
                          'and check your grades. Keep an eye on the due dates!',
                          style: TextStyle(
                            fontSize: 13.sp,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurface.withOpacity(0.6),
                            height: 1.4,
                          ),
                        ),
                        SizedBox(height: 20.h),

                        // ── Pending / Submitted counter chips ───────────
                        Row(
                          children: [
                            _CounterChip(label: 'Pending', count: pendingCount),
                            SizedBox(width: 12.w),
                            _CounterChip(
                              label: 'Submitted',
                              count: submittedCount,
                            ),
                          ],
                        ),
                        SizedBox(height: 24.h),
                      ],
                    ),
                  ),
                ),

                // ── Global loading overlay (submit / delete in-progress) ───
                if (isSubmitting)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                        horizontal: 20.w,
                        vertical: 8.h,
                      ),
                      child: LinearProgressIndicator(
                        backgroundColor: Colors.grey.shade200,
                        color: const Color(0xFF6C63FF),
                        borderRadius: BorderRadius.circular(4.r),
                      ),
                    ),
                  ),

                // ── Empty state ────────────────────────────────────────────
                if (tasks.isEmpty)
                  SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.assignment_outlined,
                            size: 64.sp,
                            color: Theme.of(
                              context,
                            ).colorScheme.onSurface.withOpacity(0.2),
                          ),
                          SizedBox(height: 16.h),
                          Text(
                            'No TasksScreen yet',
                            style: TextStyle(
                              fontSize: 16.sp,
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurface.withOpacity(0.45),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  // ── Task list ──────────────────────────────────────────
                  SliverPadding(
                    padding: EdgeInsets.symmetric(
                      horizontal: 20.w,
                      vertical: 4.h,
                    ),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) =>
                            TaskItemWidget(taskId: tasks[index].id),
                        childCount: tasks.length,
                      ),
                    ),
                  ),

                // Bottom padding
                SliverToBoxAdapter(child: SizedBox(height: 20.h)),
              ],
            );
          },
        ),
      ),
    );
  }

  // ── Helpers to extract data from any state that carries tasks ─────────────
  List _extractTasks(TasksState state) {
    if (state is TasksLoaded) return state.tasks;
    if (state is TaskSubmitting) return state.tasks;
    if (state is TaskSubmitSuccess) return state.tasks;
    if (state is TaskSubmitError) return state.tasks;
    if (state is TaskDeletingSubmission) return state.tasks;
    if (state is TaskDeleteSubmissionSuccess) return state.tasks;
    if (state is TaskDeleteSubmissionError) return state.tasks;
    return [];
  }

  int _extractPending(TasksState state) {
    if (state is TasksLoaded) return state.pendingCount;
    if (state is TaskSubmitting) return state.pendingCount;
    if (state is TaskSubmitSuccess) return state.pendingCount;
    if (state is TaskSubmitError) return state.pendingCount;
    if (state is TaskDeletingSubmission) return state.pendingCount;
    if (state is TaskDeleteSubmissionSuccess) return state.pendingCount;
    if (state is TaskDeleteSubmissionError) return state.pendingCount;
    return 0;
  }

  int _extractSubmitted(TasksState state) {
    if (state is TasksLoaded) return state.submittedCount;
    if (state is TaskSubmitting) return state.submittedCount;
    if (state is TaskSubmitSuccess) return state.submittedCount;
    if (state is TaskSubmitError) return state.submittedCount;
    if (state is TaskDeletingSubmission) return state.submittedCount;
    if (state is TaskDeleteSubmissionSuccess) return state.submittedCount;
    if (state is TaskDeleteSubmissionError) return state.submittedCount;
    return 0;
  }
}

// ─── Counter chip ─────────────────────────────────────────────────────────────
class _CounterChip extends StatelessWidget {
  final String label;
  final int count;

  const _CounterChip({required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 18.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(14.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13.sp,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(width: 8.w),
          Text(
            '$count',
            style: TextStyle(
              fontSize: 15.sp,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF6C63FF),
            ),
          ),
        ],
      ),
    );
  }
}
