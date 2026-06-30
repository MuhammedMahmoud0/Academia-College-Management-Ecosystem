import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/student_schedule/models/schedule_response_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class WeeklyGridScheduleScreen extends StatefulWidget {
  final ScheduleResponseModel schedule;

  const WeeklyGridScheduleScreen({super.key, required this.schedule});

  @override
  State<WeeklyGridScheduleScreen> createState() =>
      _WeeklyGridScheduleScreenState();
}

class _WeeklyGridScheduleScreenState extends State<WeeklyGridScheduleScreen> {
  static const double timeColumnWidth = 70;
  static const double dayColumnWidth = 140;
  static const double cellHeight = 120;
  static const double headerHeight = 56;
  static const double minScale = 0.5;
  static const double maxScale = 2.5;

  late List<String> days;
  late List<String> timeSlots;
  late Map<String, List<ScheduleClassModel>> scheduleByDay;

  @override
  void initState() {
    super.initState();
    _buildScheduleData();
  }

  @override
  void didUpdateWidget(WeeklyGridScheduleScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.schedule != widget.schedule) {
      _buildScheduleData();
    }
  }

  void _buildScheduleData() {
    days = widget.schedule.schedule
        .map((d) => d.day.substring(0, 3).toUpperCase())
        .toList();

    scheduleByDay = {};
    for (var daySchedule in widget.schedule.schedule) {
      final dayKey = daySchedule.day.substring(0, 3).toUpperCase();
      scheduleByDay[dayKey] = daySchedule.classes;
    }

    final allTimes = <String>{};
    for (var daySchedule in widget.schedule.schedule) {
      for (var classItem in daySchedule.classes) {
        final hour = int.parse(classItem.startTime.split(':')[0]);
        allTimes.add('${hour.toString().padLeft(2, '0')}:00');
      }
    }

    if (allTimes.isEmpty) {
      timeSlots = [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
      ];
    } else {
      final sortedTimes = allTimes.toList()..sort();
      final minHour = int.parse(sortedTimes.first.split(':')[0]); //-1;
      final maxHour = int.parse(sortedTimes.last.split(':')[0]); //+ 2;
      timeSlots = List.generate(
        maxHour - minHour + 1,
        (i) => '${(minHour + i).toString().padLeft(2, '0')}:00',
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(32.r),
        topRight: Radius.circular(32.r),
      ),
      child: InteractiveViewer(
        minScale: minScale,
        maxScale: maxScale,
        boundaryMargin: const EdgeInsets.all(100),
        constrained: false,
        child: Padding(
          padding: EdgeInsets.all(16.w),
          child: Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(20.r),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 20,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.r),
              child: Column(
                children: [
                  _buildHeaderRow(),
                  ...timeSlots.asMap().entries.map(
                    (entry) => _buildTimeRow(entry.value, entry.key),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderRow() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor,
            AppColors.primaryColor.withOpacity(0.85),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: timeColumnWidth,
            height: headerHeight,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              border: Border(
                right: BorderSide(
                  color: Colors.white.withOpacity(0.2),
                  width: 1,
                ),
              ),
            ),
            child: Icon(
              Icons.schedule_rounded,
              color: Colors.white.withOpacity(0.9),
              size: 22.sp,
            ),
          ),
          ...days.asMap().entries.map(
            (entry) => Container(
              width: dayColumnWidth,
              height: headerHeight,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                border: Border(
                  right: entry.key < days.length - 1
                      ? BorderSide(
                          color: Colors.white.withOpacity(0.2),
                          width: 1,
                        )
                      : BorderSide.none,
                ),
              ),
              child: Text(
                entry.value,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 14.sp,
                  color: Colors.white,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeRow(String timeSlot, int rowIndex) {
    final isEvenRow = rowIndex % 2 == 0;

    return Row(
      children: [
        Container(
          width: timeColumnWidth,
          height: cellHeight,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isEvenRow
                ? Theme.of(context).colorScheme.surfaceContainerLow
                : Theme.of(context).colorScheme.surface,
            border: Border(
              right: BorderSide(
                color: Theme.of(context).colorScheme.outlineVariant,
                width: 1,
              ),
              bottom: BorderSide(
                color: Theme.of(context).colorScheme.outlineVariant,
                width: 1,
              ),
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _formatTimeDisplay(timeSlot),
                style: TextStyle(
                  fontSize: 13.sp,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryColor,
                ),
              ),
              SizedBox(height: 2.h),
              Text(
                _getAmPm(timeSlot),
                style: TextStyle(
                  fontSize: 10.sp,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        ...days.asMap().entries.map((entry) {
          final classData = _getClassForTimeSlot(entry.value, timeSlot);
          final isLastColumn = entry.key == days.length - 1;

          return Container(
            width: dayColumnWidth,
            height: cellHeight,
            padding: EdgeInsets.all(6.w),
            decoration: BoxDecoration(
              color: isEvenRow
                  ? Theme.of(context).colorScheme.surfaceContainerLow
                  : Theme.of(context).colorScheme.surface,
              border: Border(
                right: isLastColumn
                    ? BorderSide.none
                    : BorderSide(color: Colors.grey.shade200, width: 1),
                bottom: BorderSide(color: Colors.grey.shade200, width: 1),
              ),
            ),
            child: classData != null
                ? _buildClassCard(classData)
                : const SizedBox(),
          );
        }),
      ],
    );
  }

  String _formatTimeDisplay(String timeSlot) {
    final hour = int.parse(timeSlot.split(':')[0]);
    final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
    return displayHour.toString().padLeft(2, '0');
  }

  String _getAmPm(String timeSlot) {
    final hour = int.parse(timeSlot.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  }

  ScheduleClassModel? _getClassForTimeSlot(String day, String timeSlot) {
    final daySchedule = scheduleByDay[day];
    if (daySchedule == null) return null;

    final slotHour = int.parse(timeSlot.split(':')[0]);

    for (final classData in daySchedule) {
      final startHour = int.parse(classData.startTime.split(':')[0]);
      if (startHour == slotHour) {
        return classData;
      }
    }
    return null;
  }

  Widget _buildClassCard(ScheduleClassModel classData) {
    final color = classData.color;

    return GestureDetector(
      onTap: () => _showClassDetailsBottomSheet(context, classData),
      child: Container(
        padding: EdgeInsets.all(8.w),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color.withOpacity(0.15), color.withOpacity(0.08)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(color: color.withOpacity(0.3), width: 1),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 4.w,
                  height: 20.h,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(2.r),
                  ),
                ),
                SizedBox(width: 6.w),
                Expanded(
                  child: Text(
                    classData.courseCode,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 12.sp,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 6.h),
            Row(
              children: [
                Icon(
                  Icons.access_time_filled_rounded,
                  size: 11.sp,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                SizedBox(width: 4.w),
                Expanded(
                  child: Text(
                    classData.timeRange,
                    style: TextStyle(
                      fontSize: 10.sp,
                      color: Theme.of(context).colorScheme.onSurface,
                      fontWeight: FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            SizedBox(height: 4.h),
            Row(
              children: [
                Icon(
                  Icons.location_on_rounded,
                  size: 11.sp,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                SizedBox(width: 4.w),
                Expanded(
                  child: Text(
                    classData.location,
                    style: TextStyle(
                      fontSize: 10.sp,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4.r),
              ),
              child: Text(
                classData.type.toUpperCase(),
                style: TextStyle(
                  fontSize: 8.sp,
                  fontWeight: FontWeight.w700,
                  color: color,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showClassDetailsBottomSheet(
    BuildContext context,
    ScheduleClassModel classData,
  ) {
    final color = classData.color;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(28.r),
            topRight: Radius.circular(28.r),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              margin: EdgeInsets.only(top: 12.h),
              width: 40.w,
              height: 4.h,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2.r),
              ),
            ),
            // Header with gradient
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(16.w),
              padding: EdgeInsets.all(20.w),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [color, color.withOpacity(0.8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20.r),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 10.w,
                          vertical: 5.h,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.25),
                          borderRadius: BorderRadius.circular(8.r),
                        ),
                        child: Text(
                          classData.type.toUpperCase(),
                          style: TextStyle(
                            fontSize: 11.sp,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: EdgeInsets.all(8.w),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.school_rounded,
                          color: Colors.white,
                          size: 20.sp,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16.h),
                  Text(
                    classData.courseCode,
                    style: TextStyle(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w500,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    classData.courseName,
                    style: TextStyle(
                      fontSize: 22.sp,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            // Details section
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w),
              child: Column(
                children: [
                  _buildDetailRow(
                    icon: Icons.access_time_filled_rounded,
                    title: 'Time',
                    value: classData.timeRange,
                    color: color,
                  ),
                  SizedBox(height: 12.h),
                  _buildDetailRow(
                    icon: Icons.location_on_rounded,
                    title: 'Location',
                    value: classData.location,
                    color: color,
                  ),
                  SizedBox(height: 12.h),
                  _buildDetailRow(
                    icon: Icons.person_rounded,
                    title: 'Instructor',
                    value: classData.instructor,
                    color: color,
                  ),
                ],
              ),
            ),
            SizedBox(height: 24.h),
            // Action buttons
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 14.h),
                        side: BorderSide(color: color, width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.r),
                        ),
                      ),
                      icon: Icon(
                        Icons.close_rounded,
                        color: color,
                        size: 20.sp,
                      ),
                      label: Text(
                        'Close',
                        style: TextStyle(
                          color: color,
                          fontWeight: FontWeight.w600,
                          fontSize: 14.sp,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        // TODO: Navigate to course details
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: color,
                        padding: EdgeInsets.symmetric(vertical: 14.h),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.r),
                        ),
                      ),
                      icon: Icon(
                        Icons.arrow_forward_rounded,
                        color: Colors.white,
                        size: 20.sp,
                      ),
                      label: Text(
                        'View Course',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 14.sp,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: MediaQuery.of(context).padding.bottom + 16.h),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(10.w),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Icon(icon, color: color, size: 22.sp),
          ),
          SizedBox(width: 14.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12.sp,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15.sp,
                    color: Theme.of(context).colorScheme.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
