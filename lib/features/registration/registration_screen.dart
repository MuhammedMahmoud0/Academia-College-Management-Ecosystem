import 'package:college_project/features/registration/models/course_model.dart';
import 'package:college_project/features/registration/widgets/registration_card.dart';
import 'package:flutter/material.dart';

class CourseRegistrationScreen extends StatefulWidget {
  const CourseRegistrationScreen({super.key});

  @override
  State<CourseRegistrationScreen> createState() =>
      _CourseRegistrationScreenState();
}

class _CourseRegistrationScreenState extends State<CourseRegistrationScreen> {
  final TextEditingController _searchController = TextEditingController();
  final Set<String> _enrolledCourseCodes = {'CS405'};

  // This would typically come from a Repository in MVVM
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
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: const Text(
          'Registration',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
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
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search courses or codes...',
          prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8)),
          filled: true,
          fillColor: Colors.white,
          contentPadding: EdgeInsets.zero,
          border: _outlineBorder(),
          enabledBorder: _outlineBorder(),
        ),
      ),
    );
  }

  OutlineInputBorder _outlineBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
    );
  }
}
