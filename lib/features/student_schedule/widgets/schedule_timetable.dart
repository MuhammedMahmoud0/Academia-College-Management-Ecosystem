import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/student_schedule/models/schedule_models.dart';
import 'package:college_project/features/student_schedule/widgets/course_cell.dart';
import 'package:flutter/material.dart';

class ScheduleTimetable extends StatelessWidget {
  final WeeklySchedule schedule;
  final Function(ScheduleSlot)? onCellTap;
  final int? currentDayIndex; // Highlight current day
  final int? currentTimeSlotIndex; // Highlight ongoing class

  const ScheduleTimetable({
    super.key,
    required this.schedule,
    this.onCellTap,
    this.currentDayIndex,
    this.currentTimeSlotIndex,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate cell dimensions
    const double timeColumnWidth = 80.0;
    const double dayCellWidth = 140.0;
    const double headerHeight = 50.0;
    const double cellHeight = 100.0;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackgroundColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Column(
          children: [
            // Sticky header row (days)
            _buildHeaderRow(
              timeColumnWidth: timeColumnWidth,
              dayCellWidth: dayCellWidth,
              headerHeight: headerHeight,
            ),

            // Scrollable content
            Expanded(
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sticky time column
                    _buildTimeColumn(
                      width: timeColumnWidth,
                      cellHeight: cellHeight,
                    ),

                    // Scrollable grid
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: _buildScheduleGrid(
                          dayCellWidth: dayCellWidth,
                          cellHeight: cellHeight,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Build the header row with day names
  Widget _buildHeaderRow({
    required double timeColumnWidth,
    required double dayCellWidth,
    required double headerHeight,
  }) {
    return Container(
      height: headerHeight,
      decoration: BoxDecoration(
        color: AppColors.primaryColor.withValues(alpha: 0.05),
        border: Border(
          bottom: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          // Empty corner cell
          Container(
            width: timeColumnWidth,
            decoration: BoxDecoration(
              border: Border(
                right: BorderSide(
                  color: AppColors.borderColor,
                  width: 1,
                ),
              ),
            ),
            child: Center(
              child: Icon(
                Icons.calendar_today_rounded,
                size: 20,
                color: AppColors.primaryColor,
              ),
            ),
          ),

          // Day headers
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: List.generate(
                  schedule.days.length,
                  (dayIndex) => _buildDayHeader(
                    day: schedule.days[dayIndex],
                    dayIndex: dayIndex,
                    width: dayCellWidth,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Build a single day header cell
  Widget _buildDayHeader({
    required String day,
    required int dayIndex,
    required double width,
  }) {
    final isToday = currentDayIndex == dayIndex;

    return Container(
      width: width,
      decoration: BoxDecoration(
        color: isToday
            ? AppColors.primaryColor.withValues(alpha: 0.1)
            : Colors.transparent,
        border: Border(
          right: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Center(
        child: Text(
          day,
          style: AppTextStyles.heading3.copyWith(
            color: isToday ? AppColors.primaryColor : AppColors.textColor,
            fontWeight: isToday ? FontWeight.w700 : FontWeight.w600,
          ),
        ),
      ),
    );
  }

  /// Build the sticky time column
  Widget _buildTimeColumn({
    required double width,
    required double cellHeight,
  }) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        color: AppColors.backgroundColor,
        border: Border(
          right: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: List.generate(
          schedule.timeSlots.length,
          (index) => _buildTimeCell(
            timeSlot: schedule.timeSlots[index],
            height: cellHeight,
            isOngoing: currentTimeSlotIndex == index,
          ),
        ),
      ),
    );
  }

  /// Build a single time cell
  Widget _buildTimeCell({
    required TimeSlot timeSlot,
    required double height,
    required bool isOngoing,
  }) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: isOngoing
            ? AppColors.primaryColor.withValues(alpha: 0.05)
            : AppColors.backgroundColor,
        border: Border(
          bottom: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                timeSlot.startTime,
                style: AppTextStyles.bodySmall.copyWith(
                  fontWeight: FontWeight.w600,
                  color: isOngoing
                      ? AppColors.primaryColor
                      : AppColors.textColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                timeSlot.endTime,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.subtitleColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Build the main schedule grid
  Widget _buildScheduleGrid({
    required double dayCellWidth,
    required double cellHeight,
  }) {
    return Column(
      children: List.generate(
        schedule.timeSlots.length,
        (timeIndex) => Row(
          children: List.generate(
            schedule.days.length,
            (dayIndex) => _buildGridCell(
              dayIndex: dayIndex,
              timeSlotIndex: timeIndex,
              width: dayCellWidth,
              height: cellHeight,
            ),
          ),
        ),
      ),
    );
  }

  /// Build a single grid cell (either empty or with course)
  Widget _buildGridCell({
    required int dayIndex,
    required int timeSlotIndex,
    required double width,
    required double height,
  }) {
    final sessions = schedule.getSessionsForSlot(dayIndex, timeSlotIndex);
    final isOngoing = currentDayIndex == dayIndex &&
        currentTimeSlotIndex == timeSlotIndex;

    // If there's a session in this slot
    if (sessions.isNotEmpty) {
      final session = sessions.first;

      // Only render if this is the starting time slot for the session
      if (session.timeSlotIndex == timeSlotIndex) {
        final cellHeightWithDuration = height * session.duration;

        return CourseCell(
          session: session,
          width: width,
          height: cellHeightWithDuration,
          onTap: onCellTap != null ? () => onCellTap!(session) : null,
          isOngoing: isOngoing,
        );
      } else {
        // This is a continuation cell, render empty
        return _buildEmptyCell(width: width, height: height);
      }
    }

    // Empty cell
    return _buildEmptyCell(width: width, height: height);
  }

  /// Build an empty grid cell
  Widget _buildEmptyCell({
    required double width,
    required double height,
  }) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.cardBackgroundColor,
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
    );
  }
}
