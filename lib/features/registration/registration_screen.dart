import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:college_project/features/registration/models/course_model.dart';
import 'package:college_project/features/registration/widgets/registration_card.dart';
import 'package:college_project/features/registration/widgets/registered_courses_table.dart';

class CourseRegistrationScreen extends StatefulWidget {
  const CourseRegistrationScreen({super.key});

  @override
  State<CourseRegistrationScreen> createState() =>
      _CourseRegistrationScreenState();
}

class _CourseRegistrationScreenState extends State<CourseRegistrationScreen> {
  final TextEditingController _searchController = TextEditingController();

  // Logic: Tracking enrolled courses by their codes
  final Set<String> _enrolledCourseCodes = {'CS405'};

  // Mock Data (Ideally provided via a ViewModel or Repository)
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

  /// Handles adding/removing courses from the registration list
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
    // Derived state: Filter list to identify currently registered courses
    final registeredCourses = _allCourses
        .where((c) => _enrolledCourseCodes.contains(c.code))
        .toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: false,
        title: Text(
          'Registration',
          style: TextStyle(
            color: const Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 22.sp,
          ),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(),

          // Table Section: Displays registered courses using the external widget
          if (registeredCourses.isNotEmpty) ...[
            _buildSectionHeaderPadding('Registered Courses'),
            SizedBox(height: 12.h),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w),
              child: RegisteredCoursesTable(
                courses: registeredCourses,
                onRemove: _toggleEnrollment,
              ),
            ),
            SizedBox(height: 24.h),
          ],

          _buildSectionHeaderPadding('Available Courses'),

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
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: TextField(
        controller: _searchController,
        style: TextStyle(fontSize: 14.sp),
        decoration: InputDecoration(
          hintText: 'Search courses or codes...',
          hintStyle: TextStyle(fontSize: 14.sp, color: const Color(0xFF94A3B8)),
          prefixIcon: Icon(
            Icons.search,
            color: const Color(0xFF94A3B8),
            size: 20.w,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: EdgeInsets.symmetric(vertical: 12.h),
          border: _outlineBorder(),
          enabledBorder: _outlineBorder(),
          focusedBorder: _outlineBorder().copyWith(
            borderSide: const BorderSide(color: Color(0xFF4F46E5), width: 1.5),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeaderPadding(String title) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: _buildSectionHeader(title),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 16.sp,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1E293B),
          ),
        ),
        SizedBox(width: 8.w),
        const Expanded(child: Divider(color: Color(0xFFE2E8F0))),
      ],
    );
  }

  OutlineInputBorder _outlineBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16.r),
      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
    );
  }
}
