import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/leaderboard/cubit/leaderboard_cubit.dart';
import 'package:college_project/features/leaderboard/cubit/leaderboard_states.dart';
import 'package:college_project/features/leaderboard/models/leaderboard_response_model.dart';
import 'package:college_project/features/leaderboard/widgets/Leaderboard_Card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LeaderboardCubit()..getLeaderboard(),
      child: const _LeaderboardScreenView(),
    );
  }
}

class _LeaderboardScreenView extends StatefulWidget {
  const _LeaderboardScreenView();

  @override
  State<_LeaderboardScreenView> createState() => __LeaderboardScreenViewState();
}

class __LeaderboardScreenViewState extends State<_LeaderboardScreenView> {
  // Filter state - empty means all
  String _selectedLevel = '';
  String _selectedDepartment = '';

  // Available filter options
  final List<String> _levels = ['', '1', '2', '3', '4'];
  final List<String> _departments = [
    '',
    'Computer Science',
    'Information Systems',
    'Information Technology',
    'Artificial Intelligence',
  ];

  void _fetchLeaderboard() {
    context.read<LeaderboardCubit>().getLeaderboard(
      level: _selectedLevel.isNotEmpty ? _selectedLevel : null,
      department: _selectedDepartment.isNotEmpty ? _selectedDepartment : null,
    );
  }

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
          'Student Rankings',
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
          _buildFilters(),
          SizedBox(height: 24.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.getBackground(true)
                    : AppColors.backgroundColor,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: _buildMainContent(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      child: Row(
        children: [
          Expanded(child: _buildLevelFilter()),
          SizedBox(width: 12.w),
          Expanded(child: _buildDepartmentFilter()),
        ],
      ),
    );
  }

  Widget _buildLevelFilter() {
    return Container(
      height: 48.h,
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedLevel,
          isExpanded: true,
          dropdownColor: AppColors.primaryColor,
          icon: Icon(Icons.arrow_drop_down, color: Colors.white, size: 24.sp),
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 13.sp,
          ),
          items: _levels.map((level) {
            return DropdownMenuItem<String>(
              value: level,
              child: Text(
                level.isEmpty ? 'All Levels' : 'Level $level',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 13.sp,
                ),
              ),
            );
          }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedLevel = value ?? '';
            });
            _fetchLeaderboard();
          },
        ),
      ),
    );
  }

  Widget _buildDepartmentFilter() {
    return Container(
      height: 48.h,
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedDepartment,
          isExpanded: true,
          dropdownColor: AppColors.primaryColor,
          icon: Icon(Icons.arrow_drop_down, color: Colors.white, size: 24.sp),
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 13.sp,
          ),
          items: _departments.map((dept) {
            return DropdownMenuItem<String>(
              value: dept,
              child: Text(
                dept.isEmpty ? 'All Departments' : dept,
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 13.sp,
                ),
              ),
            );
          }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedDepartment = value ?? '';
            });
            _fetchLeaderboard();
          },
        ),
      ),
    );
  }

  Widget _buildMainContent() {
    return BlocBuilder<LeaderboardCubit, LeaderboardState>(
      builder: (context, state) {
        if (state is LeaderboardLoading) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.primaryColor),
          );
        }

        if (state is LeaderboardError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  state.message,
                  style: TextStyle(color: Colors.grey, fontSize: 14.sp),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 16.h),
                ElevatedButton(
                  onPressed: _fetchLeaderboard,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryColor,
                  ),
                  child: const Text(
                    'Retry',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          );
        }

        if (state is LeaderboardSuccess) {
          final leaderboard = state.data.leaderboard;
          final userRank = state.data.userRank;

          if (leaderboard.isEmpty) {
            return Center(
              child: Text(
                "No students found",
                style: TextStyle(color: Colors.grey, fontSize: 14.sp),
              ),
            );
          }

          // Get current user ID from Constants
          final currentUserId = Constants.student?.studentId ?? '';

          return Column(
            children: [
              if (userRank != null) _buildUserRankCard(userRank),
              Expanded(
                child: ListView.builder(
                  padding: EdgeInsets.only(top: 20.h, bottom: 40.h),
                  physics: const BouncingScrollPhysics(),
                  itemCount: leaderboard.length,
                  itemBuilder: (context, index) {
                    final student = leaderboard[index];
                    return LeaderboardCard(
                      student: student,
                      primaryColor: AppColors.primaryColor,
                      isCurrentUser: student.studentId == currentUserId,
                    );
                  },
                ),
              ),
            ],
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildUserRankCard(UserRank userRank) {
    return Container(
      margin: EdgeInsets.fromLTRB(20.w, 20.h, 20.w, 0),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor,
            AppColors.primaryColor.withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildUserRankItem('Your Rank', '#${userRank.rank}'),
          _buildUserRankItem('Score', userRank.score.toStringAsFixed(2)),
          _buildUserRankItem(
            'Top',
            '${userRank.percentile.toStringAsFixed(1)}%',
          ),
        ],
      ),
    );
  }

  Widget _buildUserRankItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 18.sp,
          ),
        ),
        SizedBox(height: 4.h),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.8),
            fontSize: 12.sp,
          ),
        ),
      ],
    );
  }
}
