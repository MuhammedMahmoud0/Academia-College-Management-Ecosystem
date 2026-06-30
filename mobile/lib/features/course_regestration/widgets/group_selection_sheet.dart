import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class GroupSelectionSheet extends StatefulWidget {
  final CourseOffering offering;
  final bool isDark;
  final Function(int lectureId, int? labId) onRegister;
  final Function(int lectureId) onDrop;
  final Function(int lectureId, int labId, int oldLabId)? onChangeLab;
  final bool isLoading;

  const GroupSelectionSheet({
    super.key,
    required this.offering,
    required this.isDark,
    required this.onRegister,
    required this.onDrop,
    this.onChangeLab,
    this.isLoading = false,
  });

  @override
  State<GroupSelectionSheet> createState() => _GroupSelectionSheetState();
}

class _GroupSelectionSheetState extends State<GroupSelectionSheet> {
  late int? _selectedLectureId;
  late int? _selectedLabId;

  @override
  void initState() {
    super.initState();
    _selectedLectureId = widget.offering.enrolledLecture?.id;
    _selectedLabId = widget.offering.enrolledLab?.id;
  }

  bool get isEnrolled => widget.offering.hasEnrolledLecture;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(widget.isDark),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24.r),
          topRight: Radius.circular(24.r),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40.w,
              height: 4.h,
              decoration: BoxDecoration(
                color: AppColors.getBorderColor(widget.isDark),
                borderRadius: BorderRadius.circular(2.r),
              ),
            ),
          ),
          SizedBox(height: 20.h),
          _buildHeader(),
          SizedBox(height: 20.h),
          _buildSectionTitle('Lecture Groups'),
          SizedBox(height: 12.h),
          _buildLectureGroups(),
          if (widget.offering.labs.isNotEmpty) ...[
            SizedBox(height: 20.h),
            _buildSectionTitle('Lab Groups'),
            SizedBox(height: 12.h),
            _buildLabGroups(),
          ],
          SizedBox(height: 24.h),
          _buildActionButtons(),
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(8.r),
          ),
          child: Text(
            widget.offering.courseCode,
            style: TextStyle(
              color: AppColors.primaryColor,
              fontSize: 12.sp,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.offering.courseName,
                style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.getTextColor(widget.isDark),
                ),
              ),
              Text(
                '${widget.offering.creditHours} ${S.of(context).creditHours}',
                style: TextStyle(
                  fontSize: 13.sp,
                  color: AppColors.getSubtitleColor(widget.isDark),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 14.sp,
        fontWeight: FontWeight.w700,
        color: AppColors.getTextColor(widget.isDark),
      ),
    );
  }

  Widget _buildLectureGroups() {
    return Column(
      children: widget.offering.lectures.map((lecture) {
        final isSelected = _selectedLectureId == lecture.id;
        final isCurrentEnrolled =
            widget.offering.enrolledLecture?.id == lecture.id;

        return _buildGroupCard(
          session: lecture,
          isSelected: isSelected,
          isEnrolled: isCurrentEnrolled,
          onTap: isEnrolled && !isCurrentEnrolled
              ? null // Can't change lecture if already enrolled
              : () {
                  setState(() {
                    _selectedLectureId = lecture.id;
                  });
                },
        );
      }).toList(),
    );
  }

  Widget _buildLabGroups() {
    return Column(
      children: widget.offering.labs.map((lab) {
        final isSelected = _selectedLabId == lab.id;

        final isCurrentEnrolled = widget.offering.enrolledLab?.id == lab.id;

        return _buildGroupCard(
          session: lab,
          isSelected: isSelected,
          isEnrolled: isCurrentEnrolled,
          onTap: () {
            setState(() {
              _selectedLabId = lab.id;
            });
          },
        );
      }).toList(),
    );
  }

  Widget _buildGroupCard({
    required SessionModel session,
    required bool isSelected,
    required bool isEnrolled,
    VoidCallback? onTap,
  }) {
    final isDisabled = onTap == null || session.isFull && !isEnrolled;

    return GestureDetector(
      onTap: isDisabled ? null : onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: 8.h),
        padding: EdgeInsets.all(14.w),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryColor.withValues(alpha: 0.08)
              : AppColors.getCardBackground(widget.isDark),
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryColor
                : AppColors.getBorderColor(widget.isDark),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 24.w,
              height: 24.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? AppColors.primaryColor : Colors.transparent,
                border: Border.all(
                  color: isSelected
                      ? AppColors.primaryColor
                      : AppColors.getBorderColor(widget.isDark),
                  width: 2,
                ),
              ),
              child: isSelected
                  ? Icon(Icons.check, size: 14.w, color: Colors.white)
                  : null,
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'Group ${session.groupNumber}',
                        style: TextStyle(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w600,
                          color: isDisabled
                              ? AppColors.getSubtitleColor(widget.isDark)
                              : AppColors.getTextColor(widget.isDark),
                        ),
                      ),
                      if (isEnrolled) ...[
                        SizedBox(width: 8.w),
                        Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: 6.w,
                            vertical: 2.h,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.successColor.withValues(
                              alpha: 0.1,
                            ),
                            borderRadius: BorderRadius.circular(4.r),
                          ),
                          child: Text(
                            'Current',
                            style: TextStyle(
                              fontSize: 10.sp,
                              fontWeight: FontWeight.w600,
                              color: AppColors.successColor,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    '${session.instructor} • ${session.location}',
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: AppColors.getSubtitleColor(widget.isDark),
                    ),
                  ),
                  SizedBox(height: 2.h),
                  Text(
                    session.scheduleText,
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: AppColors.getSubtitleColor(widget.isDark),
                    ),
                  ),
                ],
              ),
            ),
            _buildCapacityBadge(session),
          ],
        ),
      ),
    );
  }

  Widget _buildCapacityBadge(SessionModel session) {
    final isFull = session.isFull;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
      decoration: BoxDecoration(
        color: isFull
            ? AppColors.errorColor.withValues(alpha: 0.1)
            : AppColors.successColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6.r),
      ),
      child: Text(
        isFull
            ? S.of(context).full
            : '${session.availableSeats} ${S.of(context).seats}',
        style: TextStyle(
          fontSize: 11.sp,
          fontWeight: FontWeight.w600,
          color: isFull ? AppColors.errorColor : AppColors.successColor,
        ),
      ),
    );
  }

  Widget _buildActionButtons() {
    if (isEnrolled) {
      return Row(
        children: [
          Expanded(
            child: _buildButton(
              label: S.of(context).removeCourse,
              icon: Icons.remove_circle_outline,
              color: AppColors.errorColor,
              onTap: widget.isLoading
                  ? null
                  : () {
                      widget.onDrop(widget.offering.enrolledLecture!.id);
                    },
            ),
          ),
          if (widget.offering.labs.isNotEmpty &&
              _selectedLabId != null &&
              _selectedLabId != widget.offering.enrolledLab?.id) ...[
            SizedBox(width: 12.w),
            Expanded(
              child: _buildButton(
                label: 'Change Lab',
                icon: Icons.swap_horiz,
                color: AppColors.primaryColor,
                onTap: widget.isLoading
                    ? null
                    : () {
                        widget.onChangeLab?.call(
                          widget.offering.enrolledLecture!.id,
                          _selectedLabId!,
                          widget.offering.enrolledLab!.id,
                        );
                      },
              ),
            ),
          ],
        ],
      );
    }

    final canRegister =
        _selectedLectureId != null &&
        (widget.offering.labs.isEmpty || _selectedLabId != null);

    return _buildButton(
      label: S.of(context).register,
      icon: Icons.check_circle_outline,
      color: AppColors.primaryColor,
      onTap: (widget.isLoading || !canRegister)
          ? null
          : () {
              widget.onRegister(_selectedLectureId!, _selectedLabId);
            },
      isFullWidth: true,
    );
  }

  Widget _buildButton({
    required String label,
    required IconData icon,
    required Color color,
    VoidCallback? onTap,
    bool isFullWidth = false,
  }) {
    final isDisabled = onTap == null;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: isFullWidth ? double.infinity : null,
        padding: EdgeInsets.symmetric(vertical: 14.h, horizontal: 20.w),
        decoration: BoxDecoration(
          color: isDisabled ? color.withValues(alpha: 0.3) : color,
          borderRadius: BorderRadius.circular(12.r),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.isLoading)
              SizedBox(
                width: 18.w,
                height: 18.w,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            else
              Icon(icon, color: Colors.white, size: 18.w),
            SizedBox(width: 8.w),
            Text(
              label,
              style: TextStyle(
                color: Colors.white,
                fontSize: 14.sp,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
