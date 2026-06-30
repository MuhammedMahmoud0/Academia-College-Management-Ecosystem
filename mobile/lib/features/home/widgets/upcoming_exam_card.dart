import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

import '../models/exam_model.dart';

class UpcomingExamsCard extends StatelessWidget {
  final List<Exam> exams;
  final VoidCallback? onSeeAllTap;
  final bool isDark;

  const UpcomingExamsCard({
    super.key,
    required this.exams,
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
                      color: AppColors.warningColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.schedule_rounded,
                      color: AppColors.warningColor,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    S.of(context).upcomingExams,
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
        ...exams.take(3).map((exam) => _ExamItem(exam: exam, isDark: isDark)),
      ],
    );
  }
}

class _ExamItem extends StatelessWidget {
  final Exam exam;
  final bool isDark;

  const _ExamItem({required this.exam, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final isUrgent = exam.daysRemaining <= 3;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUrgent
              ? AppColors.warningColor.withValues(alpha: 0.3)
              : AppColors.getBorderColor(isDark),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: isUrgent
                  ? AppColors.warningColor.withValues(alpha: 0.1)
                  : (isDark
                      ? AppColors.primaryColor.withValues(alpha: 0.2)
                      : AppColors.primaryLight),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Text(
                  exam.formattedDate.split(' ')[0],
                  style: AppTextStyles.caption.copyWith(
                    color: isUrgent
                        ? AppColors.warningColor
                        : AppColors.primaryColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  exam.formattedDate.split(' ')[1],
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: isUrgent
                        ? AppColors.warningColor
                        : AppColors.primaryColor,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exam.courseName,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      Icons.access_time_rounded,
                      size: 14,
                      color: AppColors.getSubtitleColor(isDark),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      exam.formattedTime,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Icon(
                      Icons.location_on_outlined,
                      size: 14,
                      color: AppColors.getSubtitleColor(isDark),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      exam.location,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isUrgent
                  ? AppColors.warningColor
                  : AppColors.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              exam.daysRemaining == 0
                  ? S.of(context).today
                  : exam.daysRemaining == 1
                      ? '1 ${S.of(context).day}'
                      : '${exam.daysRemaining} ${S.of(context).days}',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isUrgent ? Colors.white : AppColors.primaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
