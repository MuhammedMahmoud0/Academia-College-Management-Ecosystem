import 'package:college_project/features/registration/models/course_model.dart';
import 'package:flutter/material.dart';

class RegistrationCard extends StatelessWidget {
  final Course course;
  final bool isEnrolled;
  final VoidCallback onToggleEnrollment;

  const RegistrationCard({
    super.key,
    required this.course,
    required this.isEnrolled,
    required this.onToggleEnrollment,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF64748B).withOpacity(0.04),
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
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF4F46E5).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  course.code,
                  style: const TextStyle(
                    color: Color(0xFF4F46E5),
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
                          ? const Color(0xFFEF4444)
                          : const Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    course.isFull ? 'Full' : '${course.seats} Seats',
                    style: TextStyle(
                      fontSize: 13,
                      color: course.isFull
                          ? const Color(0xFFEF4444)
                          : const Color(0xFF10B981),
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
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E293B),
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
          _buildActionButton(),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 6),
        Text(
          text,
          style: const TextStyle(
            fontSize: 14,
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton() {
    final bool canEnroll = !course.isFull || isEnrolled;

    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: canEnroll ? onToggleEnrollment : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: isEnrolled
              ? const Color(0xFFFEE2E2)
              : const Color(0xFF4F46E5),
          foregroundColor: isEnrolled ? const Color(0xFFEF4444) : Colors.white,
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
          isEnrolled ? 'Remove Course' : 'Add Course',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
