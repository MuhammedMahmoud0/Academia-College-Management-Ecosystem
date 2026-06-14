import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/attendance/cubit/attendance_cubit.dart';
import 'package:college_project/features/attendance/cubit/attendance_states.dart';
import 'package:college_project/features/attendance/model/attendance_history_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class AttendanceHistoryScreen extends StatefulWidget {
  const AttendanceHistoryScreen({super.key});

  @override
  State<AttendanceHistoryScreen> createState() =>
      _AttendanceHistoryScreenState();
}

class _AttendanceHistoryScreenState extends State<AttendanceHistoryScreen> {
  /// Converts "1970-01-01T11:00:00.000Z" → "11:00 AM"
  String _formatTime(String raw) {
    if (raw.isEmpty) return '';
    try {
      final dt = DateTime.parse(raw).toLocal();
      final hour = dt.hour;
      final minute = dt.minute.toString().padLeft(2, '0');
      final period = hour >= 12 ? 'PM' : 'AM';
      final displayHour = hour % 12 == 0 ? 12 : hour % 12;
      return '$displayHour:$minute $period';
    } catch (_) {
      return raw;
    }
  }

  @override
  void initState() {
    super.initState();
    context.read<AttendanceCubit>().getAttendanceHistory();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      backgroundColor: AppColors.getBackground(isDark),
      appBar: AppBar(
        title: Text(
          S.of(context).attendanceHistory,
          style: AppTextStyles.heading2.copyWith(
            color: AppColors.getTextColor(isDark),
          ),
        ),
        backgroundColor: AppColors.getBackground(isDark),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: AppColors.getTextColor(isDark),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primaryColor,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.qr_code_scanner_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            onPressed: () async {
              String? code = await GoRouter.of(
                context,
              ).pushNamed(AppRoutes.qrScannerScreen);
              if (code != null) {
                debugPrint("Code is: $code");
                if (mounted) {
                  context.read<AttendanceCubit>().scanAttendance(code);
                }
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: BlocBuilder<AttendanceCubit, AttendanceStates>(
        builder: (context, state) {
          if (state is AttendanceLoadingState) {
            return Center(
              child: CircularProgressIndicator(color: AppColors.primaryColor),
            );
          }

          if (state is AttendanceErrorState) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  state.error,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium.copyWith(color: Colors.red),
                ),
              ),
            );
          }

          if (state is AttendanceHistoryLoadedState) {
            final data = state.attendance;

            if (data.history.isEmpty) {
              return _buildEmptyState(isDark, context);
            }

            return Column(
              children: [
                _buildSummaryCard(data, isDark, context),
                Expanded(
                  child: Builder(
                    builder: (context) {
                      final sorted = [...data.history]
                        ..sort((a, b) => b.date.compareTo(a.date));
                      return ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        itemCount: sorted.length,
                        itemBuilder: (context, index) =>
                            _buildDayCard(sorted[index], isDark),
                      );
                    },
                  ),
                ),
              ],
            );
          }

          return _buildEmptyState(isDark, context);
        },
      ),
    );
  }

  Widget _buildSummaryCard(
    AttendanceHistoryResponseModel data,
    bool isDark,
    BuildContext context,
  ) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStat(
            'Total',
            data.totalSessions.toString(),
            AppColors.primaryColor,
          ),
          _buildDivider(isDark),
          _buildStat('Present', data.presentCount.toString(), Colors.green),
          _buildDivider(isDark),
          _buildStat('Absent', data.absentCount.toString(), Colors.red),
          _buildDivider(isDark),
          _buildStat(
            'Percentage',
            '${data.attendancePercentage.toStringAsFixed(0)}%',
            AppColors.primaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(bool isDark) {
    return Container(
      height: 36,
      width: 1,
      color: AppColors.getBorderColor(isDark),
    );
  }

  Widget _buildStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: AppTextStyles.heading2.copyWith(color: color)),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            color: color.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }

  String _formatDate(String raw) {
    try {
      final dt = DateTime.parse(raw);
      const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      final dayName = days[dt.weekday - 1];
      return '$raw • $dayName';
    } catch (_) {
      return raw;
    }
  }

  Widget _buildDayCard(AttendanceDayModel day, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Text(
              _formatDate(day.date),
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.getTextColor(isDark),
              ),
            ),
          ),
          Divider(height: 1, color: AppColors.getBorderColor(isDark)),
          ...day.sessions.map((s) => _buildSessionRow(s, isDark)),
        ],
      ),
    );
  }

  Widget _buildSessionRow(AttendanceSessionModel session, bool isDark) {
    final isPresent = session.isPresent;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: isPresent ? Colors.green : Colors.red,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  session.courseName,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${session.courseCode} • ${session.sessionType} • ${session.group}',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.getSubtitleColor(isDark),
                  ),
                ),
                if (session.startTime.isNotEmpty)
                  Text(
                    '${_formatTime(session.startTime)} - ${_formatTime(session.endTime)}',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.getSubtitleColor(isDark),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isPresent
                  ? Colors.green.withValues(alpha: 0.1)
                  : Colors.red.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              isPresent ? 'Present' : 'Absent',
              style: AppTextStyles.bodySmall.copyWith(
                color: isPresent ? Colors.green : Colors.red,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(bool isDark, BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.fact_check_outlined,
            size: 80,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Text(
            S.of(context).noAttendanceRecords,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }
}
