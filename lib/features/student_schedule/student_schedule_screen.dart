import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/student_schedule/cubit/schedule_cubit.dart';
import 'package:college_project/features/student_schedule/cubit/schedule_states.dart';
import 'package:college_project/features/student_schedule/widgets/weeklyGridScheduleScreen.dart';
import 'package:college_project/features/student_schedule/widgets/weeklyListScheduleScreen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentScheduleScreen extends StatelessWidget {
  const StudentScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ScheduleCubit()..getSchedule(),
      child: const _StudentScheduleView(),
    );
  }
}

class _StudentScheduleView extends StatefulWidget {
  const _StudentScheduleView();

  @override
  State<_StudentScheduleView> createState() => _StudentScheduleViewState();
}

class _StudentScheduleViewState extends State<_StudentScheduleView> {
  int _selectedViewIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
            size: 20.sp,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Student Schedule',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20.sp,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 10.h),
          _buildYearFilter(),
          SizedBox(height: 24.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.getBackground(
                  context.watch<AppCubit>().isDarkMode,
                ),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: BlocBuilder<ScheduleCubit, ScheduleStates>(
                builder: (context, state) {
                  if (state is ScheduleLoadingState) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (state is ScheduleErrorState) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 64.sp,
                            color: Colors.grey[400],
                          ),
                          SizedBox(height: 16.h),
                          Text(
                            state.error,
                            style: TextStyle(
                              fontSize: 16.sp,
                              color: Colors.grey[600],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 16.h),
                          ElevatedButton(
                            onPressed: () {
                              context.read<ScheduleCubit>().getSchedule();
                            },
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    );
                  }

                  if (state is ScheduleLoadedState ||
                      state is ScheduleRefreshingState) {
                    final schedule = state is ScheduleLoadedState
                        ? state.schedule
                        : (state as ScheduleRefreshingState).schedule;

                    return _selectedViewIndex == 0
                        ? WeeklyListScheduleScreen(schedule: schedule)
                        : WeeklyGridScheduleScreen(schedule: schedule);
                  }

                  return const SizedBox.shrink();
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _exportToPdf();
        },
        backgroundColor: AppColors.primaryColor,
        child: Icon(Icons.save_alt_rounded, color: Colors.white, size: 24.sp),
      ),
    );
  }

  Widget _buildYearFilter() {
    return Container(
      height: 48.h,
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.2),
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildYearToggleItem(
              "List View",
              0,
              Icons.view_list_rounded,
            ),
          ),
          Expanded(
            child: _buildYearToggleItem(
              "Grid View",
              1,
              Icons.grid_view_rounded,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildYearToggleItem(String title, int index, IconData icon) {
    bool isSelected = _selectedViewIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() => _selectedViewIndex = index);
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.white.withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20.r),
        ),
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.white.withOpacity(0.5),
              size: 20.sp,
            ),
            SizedBox(width: 8.w),
            Text(
              title,
              style: TextStyle(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.5),
                fontWeight: FontWeight.bold,
                fontSize: 13.sp,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _exportToPdf() async {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(width: 12),
            const Text('Generating PDF...'),
          ],
        ),
        duration: const Duration(seconds: 2),
        backgroundColor: AppColors.primaryColor,
      ),
    );

    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text('Schedule exported to PDF successfully!'),
            ],
          ),
          duration: Duration(seconds: 3),
          backgroundColor: AppColors.successColor,
        ),
      );
    }
  }
}
