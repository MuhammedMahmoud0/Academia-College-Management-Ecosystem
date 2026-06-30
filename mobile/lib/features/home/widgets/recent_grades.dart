import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

class RecentGradesCard extends StatelessWidget {
  final List<Grade> grades;
  final VoidCallback? onSeeAllTap;
  final bool isDark;

  const RecentGradesCard({
    super.key,
    required this.grades,
    this.onSeeAllTap,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.successColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.trending_up_rounded,
                      color: AppColors.successColor,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    S.of(context).recentGrades,
                    style: AppTextStyles.heading3.copyWith(
                      color: AppColors.getTextColor(isDark),
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: onSeeAllTap,
                child: Text(
                  S.of(context).seeAll,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.primaryColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: AppColors.getCardBackground(isDark),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: grades.take(3).map((grade) {
              final isLast = grades.indexOf(grade) == grades.take(3).length - 1;
              return _GradeItem(grade: grade, showDivider: !isLast, isDark: isDark);
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _GradeItem extends StatelessWidget {
  final Grade grade;
  final bool showDivider;
  final bool isDark;

  const _GradeItem({
    required this.grade,
    this.showDivider = true,
    required this.isDark,
  });

  Color _getGradeColor(String? grade) {
    if (grade == null) return AppColors.subtitleColor;
    if (grade.startsWith('A')) return AppColors.successColor;
    if (grade.startsWith('B')) return AppColors.infoColor;
    if (grade.startsWith('C')) return AppColors.warningColor;
    return AppColors.errorColor;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: isDark
                      ? AppColors.primaryColor.withValues(alpha: 0.2)
                      : AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    grade.courseCode.substring(0, 2),
                    style: const TextStyle(
                      color: AppColors.primaryColor,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      grade.courseName,
                      style: AppTextStyles.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.getTextColor(isDark),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${grade.courseCode} • ${grade.creditHours} Credits',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _getGradeColor(grade.grade).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    grade.grade ?? '-',
                    style: TextStyle(
                      color: _getGradeColor(grade.grade),
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        if (showDivider)
          Divider(
            height: 1,
            thickness: 1,
            color: AppColors.getBorderColor(isDark).withValues(alpha: 0.5),
            indent: 74,
          ),
      ],
    );
  }
}
