import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/leaderboard/models/leaderboard_model.dart';
import 'package:college_project/features/leaderboard/widgets/Leaderboard_Card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  // State for year filtering
  // 0: All Years, 1: Year 1, 2: Year 2, 3: Year 3, 4: Year 4
  int _selectedYearIndex = 0;
  late List<Student> _allStudents;
  List<Student> _filteredStudents = [];

  @override
  void initState() {
    super.initState();
    // Getting sample data from the Student model
    _allStudents = StudentData.getSampleStudents();
    _filterByYear();
  }

  void _filterByYear() {
    setState(() {
      if (_selectedYearIndex == 0) {
        // Show all students across all years
        _filteredStudents = List.from(_allStudents);
      } else {
        // Filter by the specific year (index 1 maps to Year 1, etc.)
        _filteredStudents = _allStudents
            .where((student) => student.year == _selectedYearIndex)
            .toList();
      }

      // Sort by GPA descending to determine rank within the filtered view
      _filteredStudents.sort((a, b) => b.gpa.compareTo(a.gpa));
    });
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
          _buildYearFilter(),
          SizedBox(height: 24.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.backgroundColor,
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

  Widget _buildYearFilter() {
    return Container(
      height: 48.h,
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: [
            _buildYearToggleItem("All", 0),
            _buildYearToggleItem("Year 1", 1),
            _buildYearToggleItem("Year 2", 2),
            _buildYearToggleItem("Year 3", 3),
            _buildYearToggleItem("Year 4", 4),
          ],
        ),
      ),
    );
  }

  Widget _buildYearToggleItem(String title, int index) {
    bool isSelected = _selectedYearIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() => _selectedYearIndex = index);
        _filterByYear();
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(20.r),
        ),
        alignment: Alignment.center,
        child: Text(
          title,
          style: TextStyle(
            color: isSelected ? AppColors.primaryColor : Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 13.sp,
          ),
        ),
      ),
    );
  }

  Widget _buildMainContent() {
    if (_filteredStudents.isEmpty) {
      return Center(
        child: Text(
          "No students found",
          style: TextStyle(color: Colors.grey, fontSize: 14.sp),
        ),
      );
    }

    // Mocking current user ID (e.g., student F5)
    const currentUserId = 'AC-123461';

    return ListView.builder(
      padding: EdgeInsets.only(top: 20.h, bottom: 40.h),
      physics: const BouncingScrollPhysics(),
      itemCount: _filteredStudents.length,
      itemBuilder: (context, index) {
        final student = _filteredStudents[index];

        return LeaderboardCard(
          student: student,
          primaryColor: AppColors.primaryColor,
          isCurrentUser: student.id == currentUserId,
          // Rank is based on the index in the current filtered/sorted list
          rank: index + 1,
        );
      },
    );
  }
}
