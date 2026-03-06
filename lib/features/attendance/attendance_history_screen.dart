import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/attendance/cubit/attendance_cubit.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class AttendanceHistoryScreen extends StatelessWidget {
  const AttendanceHistoryScreen({super.key});

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

                context.read<AttendanceCubit>().scanAttendance(code);
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
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
      ),
    );
  }
}
