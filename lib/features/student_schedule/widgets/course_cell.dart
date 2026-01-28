import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/student_schedule/models/schedule_models.dart';
import 'package:flutter/material.dart';

/// A widget that displays a course session in the timetable grid
class CourseCell extends StatelessWidget {
  final ScheduleSlot session;
  final double width;
  final double height;
  final VoidCallback? onTap;
  final bool isOngoing;

  const CourseCell({
    super.key,
    required this.session,
    required this.width,
    required this.height,
    this.onTap,
    this.isOngoing = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        border: Border(
          right: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
          bottom: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          child: Container(
            margin: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: session.color,
              borderRadius: BorderRadius.circular(8),
              border: isOngoing
                  ? Border.all(
                      color: AppColors.primaryColor,
                      width: 2,
                    )
                  : null,
              boxShadow: [
                BoxShadow(
                  color: session.color.withValues(alpha: 0.4),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Course name (primary)
                  Text(
                    session.courseName,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.textColor,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),

                  // Hall/room (secondary)
                  Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        size: 12,
                        color: AppColors.subtitleColor,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          session.hall,
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.subtitleColor,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),

                  // Instructor (tertiary)
                  Row(
                    children: [
                      Icon(
                        Icons.person_outline_rounded,
                        size: 12,
                        color: AppColors.subtitleColor,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          session.instructor,
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.subtitleColor,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  // Ongoing indicator
                  if (isOngoing) ...[
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Ongoing',
                        style: AppTextStyles.caption.copyWith(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
