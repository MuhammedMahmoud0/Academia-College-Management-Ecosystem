import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/appCubit/app_states.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/courses_grades/widgets/course_card.dart';
import 'package:college_project/features/courses_grades/widgets/gpa_summary_card.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CoursesGradesScreen extends StatefulWidget {
  const CoursesGradesScreen({super.key});

  @override
  State<CoursesGradesScreen> createState() => _CoursesGradesScreenState();
}

class _CoursesGradesScreenState extends State<CoursesGradesScreen> {
  final List<Map<String, dynamic>> semesterData = [
    {'name': 'Fall 2024', 'grades': Grade.mockRecentGrades},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(
          context.watch<AppCubit>().isDarkMode,
        ),
        centerTitle: false,
        title: Text(
          'Courses & Grades',
          style: TextStyle(
            color: AppColors.getTextColor(context.watch<AppCubit>().isDarkMode),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GPASummaryCard(
              gpa: '3.84',
              creditsEarned: '102',
              currentSemester: 'Fall 2024',
              isDark: context.watch<AppCubit>().isDarkMode,
            ),
            const SizedBox(height: 24),
            ...semesterData.map(
              (data) => _buildSemesterSection(
                data['name'] as String,
                data['grades'] as List<Grade>,
                context.watch<AppCubit>().isDarkMode,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSemesterSection(
    String semesterName,
    List<Grade> grades,
    bool isDark,
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
        ...grades.map((grade) => CourseGradeCard(grade: grade, isDark: isDark)),
        const SizedBox(height: 8),
      ],
    );
  }
}
