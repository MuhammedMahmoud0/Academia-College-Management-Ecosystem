import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/models/course_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class RegisteredCoursesTable extends StatelessWidget {
  final List<Course> courses;
  final Function(String) onRemove;
  final bool isDark;

  const RegisteredCoursesTable({
    super.key,
    required this.courses,
    required this.onRemove,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
            decoration: BoxDecoration(
              color: isDark
                  ? AppColors.darkBackground
                  : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16.r),
                topRight: Radius.circular(16.r),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Text(S.of(context).courseId, style: _tableHeaderStyle()),
                ),
                Expanded(
                  flex: 1,
                  child: Text(
                    S.of(context).cr,
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Text(
                    S.of(context).instructor,
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Text(
                    S.of(context).scheduleHeader,
                    textAlign: TextAlign.center,
                    style: _tableHeaderStyle(),
                  ),
                ),
                SizedBox(width: 30.w),
              ],
            ),
          ),
          ...courses.map((course) => _buildTableRow(course)),
        ],
      ),
    );
  }

  Widget _buildTableRow(Course course) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 12.h),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.getBorderColor(isDark)),
        ),
      ),
      child: Row(
        children: [
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
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
                Text(
                  course.code,
                  style: TextStyle(
                    color: AppColors.getSubtitleColor(isDark),
                    fontSize: 10.sp,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 1,
            child: Text(
              course.credits.split(' ')[0],
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 12.sp,
                color: AppColors.getTextColor(isDark),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              course.instructor.replaceFirst('Dr. ', ''),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11.sp,
                color: AppColors.getSubtitleColor(isDark),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              course.time,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: TextStyle(
                fontSize: 10.sp,
                color: AppColors.getSubtitleColor(isDark),
              ),
            ),
          ),
          GestureDetector(
            onTap: () => onRemove(course.code),
            child: Container(
              padding: EdgeInsets.all(4.w),
              decoration: BoxDecoration(
                color: AppColors.errorColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(6.r),
              ),
              child: Icon(
                Icons.close,
                color: AppColors.errorColor,
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
      color: AppColors.getSubtitleColor(isDark),
      letterSpacing: 0.5,
    );
  }
}
