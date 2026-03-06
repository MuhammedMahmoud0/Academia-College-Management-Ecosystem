import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/courses_grades/cubit/courses_cubit.dart';
import 'package:college_project/features/courses_grades/cubit/courses_states.dart';
import 'package:college_project/features/courses_grades/models/courses_response_model.dart';
import 'package:college_project/features/courses_grades/widgets/course_card.dart';
import 'package:college_project/features/courses_grades/widgets/course_details_sheet.dart';
import 'package:college_project/features/courses_grades/widgets/gpa_summary_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CoursesGradesScreen extends StatelessWidget {
  const CoursesGradesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CoursesCubit()..getCourses(),
      child: const _CoursesGradesScreenView(),
    );
  }
}

class _CoursesGradesScreenView extends StatelessWidget {
  const _CoursesGradesScreenView();

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(isDark),
        centerTitle: false,
        title: Text(
          'Courses & Grades',
          style: TextStyle(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: BlocBuilder<CoursesCubit, CoursesStates>(
        builder: (context, state) {
          if (state is CoursesLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is CoursesErrorState) {
            return _buildErrorState(state.error, isDark, context);
          }

          if (state is CoursesLoadedState || state is CoursesRefreshingState) {
            return _buildCoursesContent(context, isDark);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildErrorState(String error, bool isDark, BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.read<CoursesCubit>().getCourses(),
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCoursesContent(BuildContext context, bool isDark) {
    final cubit = context.read<CoursesCubit>();
    final groupedCourses = cubit.coursesGroupedBySemester;

    return RefreshIndicator(
      onRefresh: () => cubit.refreshCourses(),
      color: AppColors.primaryColor,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GPASummaryCard(
              gpa: cubit.cumulativeGPA.toStringAsFixed(2),
              creditsEarned: cubit.totalCredits.toString(),
              currentSemester: cubit.currentSemester,
              isDark: isDark,
            ),
            const SizedBox(height: 24),
            if (groupedCourses.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Icon(
                        Icons.school_outlined,
                        size: 64,
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No courses found',
                        style: TextStyle(
                          color: AppColors.getSubtitleColor(isDark),
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...groupedCourses.entries.map(
                (entry) => _buildSemesterSection(
                  context,
                  entry.key,
                  entry.value,
                  isDark,
                  cubit,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSemesterSection(
    BuildContext context,
    String semesterName,
    List<CourseModel> courses,
    bool isDark,
    CoursesCubit cubit,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              Text(
                semesterName,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextColor(isDark),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(child: Divider(color: AppColors.getBorderColor(isDark))),
            ],
          ),
        ),
        const SizedBox(height: 8),
        ...courses.map(
          (course) => CourseGradeCard(
            course: course,
            isDark: isDark,
            onTap: () => CourseDetailsSheet.show(context, course, cubit, isDark),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}
