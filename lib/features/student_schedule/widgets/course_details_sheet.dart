import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/student_schedule/models/schedule_models.dart';
import 'package:flutter/material.dart';

/// Bottom sheet that displays full course details when a course cell is tapped
class CourseDetailsSheet extends StatelessWidget {
  final ScheduleSlot session;
  final WeeklySchedule schedule;

  const CourseDetailsSheet({
    super.key,
    required this.session,
    required this.schedule,
  });

  /// Show the bottom sheet
  static void show(
    BuildContext context, {
    required ScheduleSlot session,
    required WeeklySchedule schedule,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CourseDetailsSheet(
        session: session,
        schedule: schedule,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dayName = schedule.days[session.dayIndex];
    final timeSlot = schedule.timeSlots[session.timeSlotIndex];
    final endTimeSlot = session.duration > 1
        ? schedule.timeSlots[session.timeSlotIndex + session.duration - 1]
        : timeSlot;

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.cardBackgroundColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.borderColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Color indicator and course code
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: session.color,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        session.courseCode,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.subtitleColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Course name
                  Text(
                    session.courseName,
                    style: AppTextStyles.heading1.copyWith(fontSize: 26),
                  ),
                  const SizedBox(height: 24),

                  // Details grid
                  _buildDetailRow(
                    icon: Icons.person_outline_rounded,
                    label: 'Instructor',
                    value: session.instructor,
                  ),
                  const SizedBox(height: 16),

                  _buildDetailRow(
                    icon: Icons.location_on_outlined,
                    label: 'Hall/Room',
                    value: session.hall,
                  ),
                  const SizedBox(height: 16),

                  _buildDetailRow(
                    icon: Icons.calendar_today_outlined,
                    label: 'Day',
                    value: dayName,
                  ),
                  const SizedBox(height: 16),

                  _buildDetailRow(
                    icon: Icons.access_time_rounded,
                    label: 'Time',
                    value: '${timeSlot.startTime} - ${endTimeSlot.endTime}',
                  ),
                  const SizedBox(height: 16),

                  _buildDetailRow(
                    icon: Icons.timelapse_rounded,
                    label: 'Duration',
                    value: _formatDuration(session.duration),
                  ),

                  const SizedBox(height: 24),

                  // Close button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Close',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.primaryLight,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            size: 20,
            color: AppColors.primaryColor,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.subtitleColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDuration(int slots) {
    const int minutesPerSlot = 90; // 1.5 hours
    final totalMinutes = slots * minutesPerSlot;
    final hours = totalMinutes ~/ 60;
    final minutes = totalMinutes % 60;

    if (minutes == 0) {
      return '$hours Hour${hours != 1 ? 's' : ''}';
    }
    return '$hours Hour${hours != 1 ? 's' : ''} $minutes Min';
  }
}
