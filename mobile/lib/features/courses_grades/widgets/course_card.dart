import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/courses_grades/models/courses_response_model.dart';
import 'package:flutter/material.dart';

class CourseGradeCard extends StatelessWidget {
  final CourseModel course;
  final bool isDark;
  final VoidCallback? onTap;

  const CourseGradeCard({
    super.key,
    required this.course,
    this.isDark = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color gradeColor = _getGradeColor(course.grade ?? '');

    return GestureDetector(
      onTap: onTap,
      child: Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: gradeColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  course.code,
                  style: TextStyle(
                    color: gradeColor,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              if (!course.isInProgress)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: gradeColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    course.grade ?? '-',
                    style: TextStyle(
                      color: gradeColor,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              else
                Text(
                  'IN PROGRESS',
                  style: TextStyle(
                    color: AppColors.getSubtitleColor(isDark),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            course.name,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.getTextColor(isDark),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${course.credits} Credit Hours • ${course.instructor}',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Grade Points',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.getSubtitleColor(isDark),
                ),
              ),
              Text(
                course.gradePoints?.toStringAsFixed(1) ?? 'N/A',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: gradeColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: course.isInProgress ? 0.5 : (course.gradePoints ?? 0) / 4.0,
              minHeight: 8,
              backgroundColor: AppColors.getBorderColor(isDark),
              valueColor: AlwaysStoppedAnimation<Color>(
                course.isInProgress
                    ? AppColors.getSubtitleColor(isDark)
                    : gradeColor,
              ),
            ),
          ),
        ],
      ),
      ),
    );
  }

  Color _getGradeColor(String gradeStr) {
    if (gradeStr.startsWith('A')) return const Color(0xFF3B82F6);
    if (gradeStr.startsWith('B')) return const Color(0xFF10B981);
    if (gradeStr.startsWith('C')) return const Color(0xFFF59E0B);
    return const Color(0xFF6366F1);
  }
}
