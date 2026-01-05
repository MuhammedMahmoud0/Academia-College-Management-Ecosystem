import 'package:college_project/features/course_regestration/models/course_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

/// A reusable table widget to display registered courses in a compact,
/// responsive format.
class RegisteredCoursesTable extends StatelessWidget {
  final List<Course> courses;
  final Function(String) onRemove;

  const RegisteredCoursesTable({
    super.key,
    required this.courses,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          // Table Header
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16.r),
                topRight: Radius.circular(16.r),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Text('COURSE & ID', style: _tableHeaderStyle()),
                ),
                Expanded(
                  flex: 1,
                  child: Text(
                    'CR',
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Text(
                    'INSTRUCTOR',
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Text(
                    'SCHEDULE',
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                SizedBox(width: 30.w), // Space for remove button
              ],
            ),
          ),
          // Table Rows
          ...courses.map((course) => _buildTableRow(course)),
        ],
      ),
    );
  }

  Widget _buildTableRow(Course course) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 12.h),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        children: [
          // Course & ID
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 12.sp,
                  ),
                ),
                Text(
                  course.code,
                  style: TextStyle(
                    color: const Color(0xFF64748B),
                    fontSize: 10.sp,
                  ),
                ),
              ],
            ),
          ),
          // Credits
          Expanded(
            flex: 1,
            child: Text(
              course.credits.split(' ')[0],
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.w500, fontSize: 12.sp),
            ),
          ),
          // Instructor
          Expanded(
            flex: 2,
            child: Text(
              course.instructor.replaceFirst('Dr. ', ''),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 11.sp, color: const Color(0xFF475569)),
            ),
          ),
          // Schedule
          Expanded(
            flex: 2,
            child: Text(
              course.time,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: TextStyle(fontSize: 10.sp, color: const Color(0xFF64748B)),
            ),
          ),
          // Remove Action
          GestureDetector(
            onTap: () => onRemove(course.code),
            child: Container(
              padding: EdgeInsets.all(4.w),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(6.r),
              ),
              child: Icon(
                Icons.close,
                color: const Color(0xFFEF4444),
                size: 16.w,
              ),
            ),
          ),
        ],
      ),
    );
  }

  TextStyle _tableHeaderStyle() {
    return TextStyle(
      fontSize: 9.sp,
      fontWeight: FontWeight.w800,
      color: const Color(0xFF94A3B8),
      letterSpacing: 0.5,
    );
  }
}
