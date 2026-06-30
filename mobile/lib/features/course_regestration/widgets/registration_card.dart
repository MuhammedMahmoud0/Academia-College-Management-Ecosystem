import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class RegistrationCard extends StatelessWidget {
  final CourseOffering offering;
  final VoidCallback onTap;
  final bool isDark;
  final bool isLoading;

  const RegistrationCard({
    super.key,
    required this.offering,
    required this.onTap,
    this.isDark = false,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final isEnrolled = offering.hasEnrolledLecture;
    final enrolledLecture = offering.enrolledLecture;

    return GestureDetector(
      onTap: isLoading ? null : onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: 16.h),
        padding: EdgeInsets.all(20.w),
        decoration: BoxDecoration(
          color: AppColors.getCardBackground(isDark),
          borderRadius: BorderRadius.circular(24.r),
          border: Border.all(
            color: isEnrolled
                ? AppColors.successColor.withValues(alpha: 0.3)
                : AppColors.getBorderColor(isDark),
            width: isEnrolled ? 2 : 1,
          ),
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
                  padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                  child: Text(
                    offering.courseCode,
                    style: TextStyle(
                      color: AppColors.primaryColor,
                      fontSize: 11.sp,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                if (isEnrolled)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: AppColors.successColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6.r),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.check_circle,
                          color: AppColors.successColor,
                          size: 14.w,
                        ),
                        SizedBox(width: 4.w),
                        Text(
                          'Enrolled',
                          style: TextStyle(
                            color: AppColors.successColor,
                            fontSize: 11.sp,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  _buildSeatsIndicator(),
              ],
            ),
            SizedBox(height: 12.h),
            Text(
              offering.courseName,
              style: TextStyle(
                fontSize: 18.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.getTextColor(isDark),
              ),
            ),
            SizedBox(height: 8.h),
            if (isEnrolled && enrolledLecture != null) ...[
              _buildDetailRow(Icons.person_outline, enrolledLecture.instructor),
              SizedBox(height: 4.h),
              _buildDetailRow(Icons.school_outlined, 'Group ${enrolledLecture.groupNumber}'),
              SizedBox(height: 4.h),
              _buildDetailRow(Icons.schedule, enrolledLecture.scheduleText),
              SizedBox(height: 4.h),
              _buildDetailRow(Icons.location_on_outlined, enrolledLecture.location),
            ] else ...[
              _buildDetailRow(
                Icons.school_outlined,
                '${offering.creditHours} ${S.of(context).creditHours}',
              ),
              SizedBox(height: 4.h),
              _buildDetailRow(
                Icons.groups_outlined,
                '${offering.lectures.length} Lecture Groups',
              ),
              if (offering.labs.isNotEmpty) ...[
                SizedBox(height: 4.h),
                _buildDetailRow(
                  Icons.science_outlined,
                  '${offering.labs.length} Lab Groups',
                ),
              ],
            ],
            if (offering.hasEnrolledLab) ...[
              SizedBox(height: 8.h),
              _buildLabInfo(offering.enrolledLab!),
            ],
            SizedBox(height: 16.h),
            _buildActionButton(context, isEnrolled),
          ],
        ),
      ),
    );
  }

  Widget _buildSeatsIndicator() {
    final hasAvailableSeats = offering.lectures.any((l) => !l.isFull);

    return Row(
      children: [
        Container(
          width: 8.w,
          height: 8.w,
          decoration: BoxDecoration(
            color: hasAvailableSeats ? AppColors.successColor : AppColors.errorColor,
            shape: BoxShape.circle,
          ),
        ),
        SizedBox(width: 8.w),
        Text(
          hasAvailableSeats ? offering.seatsText : 'Full',
          style: TextStyle(
            fontSize: 13.sp,
            color: hasAvailableSeats ? AppColors.successColor : AppColors.errorColor,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16.w, color: AppColors.getSubtitleColor(isDark)),
        SizedBox(width: 6.w),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14.sp,
              color: AppColors.getSubtitleColor(isDark),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLabInfo(SessionModel lab) {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: AppColors.primaryColor.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(
          color: AppColors.primaryColor.withValues(alpha: 0.1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.science_outlined,
                size: 14.w,
                color: AppColors.primaryColor,
              ),
              SizedBox(width: 6.w),
              Text(
                'Lab - Group ${lab.groupNumber}',
                style: TextStyle(
                  fontSize: 12.sp,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryColor,
                ),
              ),
            ],
          ),
          SizedBox(height: 6.h),
          Text(
            '${lab.scheduleText} • ${lab.location}',
            style: TextStyle(
              fontSize: 11.sp,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, bool isEnrolled) {
    return SizedBox(
      width: double.infinity,
      height: 48.h,
      child: ElevatedButton.icon(
        onPressed: isLoading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: isEnrolled
              ? AppColors.primaryColor.withValues(alpha: 0.1)
              : AppColors.primaryColor,
          foregroundColor: isEnrolled ? AppColors.primaryColor : Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
          ),
        ),
        icon: isLoading
            ? SizedBox(
                width: 18.w,
                height: 18.w,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: isEnrolled ? AppColors.primaryColor : Colors.white,
                ),
              )
            : Icon(
                isEnrolled ? Icons.settings : Icons.add_circle_outline,
                size: 18.w,
              ),
        label: Text(
          isEnrolled ? 'Manage Course' : 'Select Groups',
          style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
