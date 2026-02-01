import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/appCubit/app_states.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/models/course_model.dart';
import 'package:college_project/features/course_regestration/widgets/registered_courses_table.dart';
import 'package:college_project/features/course_regestration/widgets/registration_card.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CourseRegistrationScreen extends StatefulWidget {
  const CourseRegistrationScreen({super.key});

  @override
  State<CourseRegistrationScreen> createState() =>
      _CourseRegistrationScreenState();
}

class _CourseRegistrationScreenState extends State<CourseRegistrationScreen> {
  final TextEditingController _searchController = TextEditingController();
  final Set<String> _enrolledCourseCodes = {'CS405'};

  final List<Course> _allCourses = [
    Course(
      title: 'Artificial Intelligence',
      code: 'CS405',
      credits: '4 Credits',
      instructor: 'Dr. Alan Turing',
      seats: '15/40',
      time: 'Mon, Wed • 10:00 AM',
    ),
    Course(
      title: 'Quantum Physics',
      code: 'PHYS302',
      credits: '3 Credits',
      instructor: 'Dr. Richard Feynman',
      seats: '5/30',
      time: 'Tue, Thu • 02:00 PM',
    ),
    Course(
      title: 'Global Economics',
      code: 'ECON201',
      credits: '3 Credits',
      instructor: 'Dr. Janet Yellen',
      seats: 'Full',
      time: 'Fri • 09:00 AM',
    ),
  ];

  void _toggleEnrollment(String code) {
    setState(() {
      final cleanCode = code.trim();
      if (_enrolledCourseCodes.contains(cleanCode)) {
        _enrolledCourseCodes.remove(cleanCode);
      } else {
        _enrolledCourseCodes.add(cleanCode);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final registeredCourses = _allCourses
        .where((c) => _enrolledCourseCodes.contains(c.code))
        .toList();

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(
          context.watch<AppCubit>().isDarkMode,
        ),
        centerTitle: false,
        title: Text(
          S.of(context).registration,
          style: TextStyle(
            color: AppColors.getTextColor(context.watch<AppCubit>().isDarkMode),
            fontWeight: FontWeight.w800,
            fontSize: 22.sp,
          ),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(context.watch<AppCubit>().isDarkMode),
          if (registeredCourses.isNotEmpty) ...[
            _buildSectionHeaderPadding(
              S.of(context).registeredCourses,
              context.watch<AppCubit>().isDarkMode,
            ),
            SizedBox(height: 12.h),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w),
              child: RegisteredCoursesTable(
                courses: registeredCourses,
                onRemove: _toggleEnrollment,
                isDark: context.watch<AppCubit>().isDarkMode,
              ),
            ),
            SizedBox(height: 24.h),
          ],
          _buildSectionHeaderPadding(
            S.of(context).availableCourses,
            context.watch<AppCubit>().isDarkMode,
          ),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
              itemCount: _allCourses.length,
              itemBuilder: (context, index) {
                final course = _allCourses[index];
                return RegistrationCard(
                  course: course,
                  isEnrolled: _enrolledCourseCodes.contains(course.code),
                  onToggleEnrollment: () => _toggleEnrollment(course.code),
                  isDark: context.watch<AppCubit>().isDarkMode,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(bool isDark) {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: TextField(
        controller: _searchController,
        style: TextStyle(
          fontSize: 14.sp,
          color: AppColors.getTextColor(isDark),
        ),
        decoration: InputDecoration(
          hintText: S.of(context).searchCoursesOrCodes,
          hintStyle: TextStyle(
            fontSize: 14.sp,
            color: AppColors.getSubtitleColor(isDark),
          ),
          prefixIcon: Icon(
            Icons.search,
            color: AppColors.getSubtitleColor(isDark),
            size: 20.w,
          ),
          filled: true,
          fillColor: AppColors.getCardBackground(isDark),
          contentPadding: EdgeInsets.symmetric(vertical: 12.h),
          border: _outlineBorder(isDark),
          enabledBorder: _outlineBorder(isDark),
          focusedBorder: _outlineBorder(isDark).copyWith(
            borderSide: const BorderSide(
              color: AppColors.primaryColor,
              width: 1.5,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeaderPadding(String title, bool isDark) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: _buildSectionHeader(title, isDark),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Row(
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 16.sp,
            fontWeight: FontWeight.bold,
            color: AppColors.getTextColor(isDark),
          ),
        ),
        SizedBox(width: 8.w),
        Expanded(child: Divider(color: AppColors.getBorderColor(isDark))),
      ],
    );
  }

  OutlineInputBorder _outlineBorder(bool isDark) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16.r),
      borderSide: BorderSide(color: AppColors.getBorderColor(isDark)),
    );
  }
}
