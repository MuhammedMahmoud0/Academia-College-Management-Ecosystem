import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentPrivilegesTable extends StatelessWidget {
  final List<String> privileges;

  const StudentPrivilegesTable({super.key, required this.privileges});

  IconData _iconForPrivilege(String label) {
    final lower = label.toLowerCase();
    if (lower.contains('library')) return Icons.menu_book_rounded;
    if (lower.contains('gym') || lower.contains('sport'))
      return Icons.fitness_center_rounded;
    if (lower.contains('lab')) return Icons.science_rounded;
    if (lower.contains('clinic') || lower.contains('health'))
      return Icons.local_hospital_rounded;
    if (lower.contains('gate') || lower.contains('main'))
      return Icons.door_front_door_rounded;
    if (lower.contains('park')) return Icons.local_parking_rounded;
    if (lower.contains('cafe') || lower.contains('food'))
      return Icons.restaurant_rounded;
    return Icons.verified_rounded;
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: 24.w),
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? colorScheme.surfaceContainerHighest
            : Colors.white, // ← بدل Colors.white
        borderRadius: BorderRadius.circular(24.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20.r,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Access Privileges',
                style: TextStyle(
                  color: colorScheme.onSurface, // ← بدل Color(0xFF0F172A)
                  fontSize: 15.sp,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Icon(
                Icons.verified_user_rounded,
                color: Colors.green.shade600,
                size: 20.w,
              ),
            ],
          ),
          SizedBox(height: 16.h),
          Divider(
            color: colorScheme.outline.withValues(alpha: 0.3),
            height: 1,
          ), // ← بدل hardcoded
          SizedBox(height: 16.h),
          Wrap(
            spacing: 16.w,
            runSpacing: 16.h,
            children: privileges
                .map((p) => _buildPrivilegeItem(p, colorScheme))
                .toList(), // ← pass colorScheme
          ),
        ],
      ),
    );
  }

  Widget _buildPrivilegeItem(String label, ColorScheme colorScheme) {
    // ← أضفي colorScheme
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Stack(
          children: [
            Container(
              height: 44.h,
              width: 44.w,
              decoration: BoxDecoration(
                color: colorScheme.surface, // ← بدل Color(0xFFF8FAFC)
                shape: BoxShape.circle,
                border: Border.all(
                  color: colorScheme.outline.withValues(alpha: 0.3),
                ),
              ),
              child: Icon(
                _iconForPrivilege(label),
                color: const Color(0xFF4F46E5),
                size: 20.w,
              ),
            ),
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                padding: EdgeInsets.all(2.w),
                decoration: BoxDecoration(
                  color: Colors.green,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: colorScheme.surface,
                    width: 1.5,
                  ), // ← بدل Colors.white
                ),
                child: Icon(Icons.check, color: Colors.white, size: 8.w),
              ),
            ),
          ],
        ),
        SizedBox(height: 8.h),
        SizedBox(
          width: 60.w,
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: colorScheme.onSurface.withValues(
                alpha: 0.6,
              ), // ← بدل Color(0xFF64748B)
              fontSize: 10.sp,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ],
    );
  }
}
