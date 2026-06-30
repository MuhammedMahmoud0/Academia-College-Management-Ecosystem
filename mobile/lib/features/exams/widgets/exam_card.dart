import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/exams/models/exams_response_model.dart';
import 'package:college_project/features/exams/widgets/exam_details_sheet.dart';
import 'package:flutter/material.dart';

class ExamCard extends StatelessWidget {
  final ExamModel exam;
  final bool isDark;

  const ExamCard({
    super.key,
    required this.exam,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = exam.statusColor;

    return GestureDetector(
      onTap: () => _showExamDetails(context),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.getCardBackground(isDark),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.getBorderColor(isDark)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        exam.courseCode,
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: exam.examTypeColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        exam.examType,
                        style: TextStyle(
                          color: exam.examTypeColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  exam.statusString.toUpperCase(),
                  style: TextStyle(
                    color: statusColor.withValues(alpha: 0.5),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              exam.courseName,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.getTextColor(isDark),
                height: 1.2,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _buildIconText(Icons.calendar_month_outlined, exam.formattedDate),
                const SizedBox(width: 20),
                _buildIconText(Icons.schedule_outlined, exam.formattedTime),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildIconText(
                  Icons.hourglass_bottom_rounded,
                  exam.formattedDuration,
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: _buildIconText(Icons.location_on_outlined, exam.location),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIconText(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: AppColors.getSubtitleColor(isDark)),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            text,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: AppColors.getSubtitleColor(isDark),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  void _showExamDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ExamDetailsSheet(exam: exam, isDark: isDark),
    );
  }
}
