import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/models/course_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

class RegistrationCard extends StatelessWidget {
  final Course course;
  final bool isEnrolled;
  final VoidCallback onToggleEnrollment;
  final bool isDark;

  const RegistrationCard({
    super.key,
    required this.course,
    required this.isEnrolled,
    required this.onToggleEnrollment,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.getBorderColor(isDark), width: 1),
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
                  color: AppColors.primaryColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  course.code,
                  style: const TextStyle(
                    color: AppColors.primaryColor,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: course.isFull
                          ? AppColors.errorColor
                          : AppColors.successColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    course.isFull ? S.of(context).full : '${course.seats} ${S.of(context).seats}',
                    style: TextStyle(
                      fontSize: 13,
                      color: course.isFull
                          ? AppColors.errorColor
                          : AppColors.successColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            course.title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.getTextColor(isDark),
            ),
          ),
          const SizedBox(height: 8),
          _buildDetailRow(Icons.person_outline, course.instructor),
          const SizedBox(height: 4),
          _buildDetailRow(
            Icons.access_time,
            '${course.credits.split(' ')[0]} Credit Hours',
          ),
          const SizedBox(height: 4),
          _buildDetailRow(Icons.calendar_today, course.time),
          const SizedBox(height: 20),
          _buildActionButton(context),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.getSubtitleColor(isDark)),
        const SizedBox(width: 6),
        Text(
          text,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.getSubtitleColor(isDark),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(BuildContext context) {
    final bool canEnroll = !course.isFull || isEnrolled;

    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: canEnroll ? onToggleEnrollment : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: isEnrolled
              ? AppColors.errorColor.withValues(alpha: 0.1)
              : AppColors.primaryColor,
          foregroundColor: isEnrolled ? AppColors.errorColor : Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        icon: Icon(
          isEnrolled ? Icons.remove_circle_outline : Icons.add_circle_outline,
          size: 18,
        ),
        label: Text(
          isEnrolled ? S.of(context).removeCourse : S.of(context).addCourse,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
