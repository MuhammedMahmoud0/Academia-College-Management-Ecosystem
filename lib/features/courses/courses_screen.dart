import 'package:college_project/features/courses/widgets/course_card.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:flutter/material.dart';
import 'package:college_project/features/courses/widgets/gpa_summary_card.dart';

/// A comprehensive Courses and Grades screen featuring GPA tracking,
/// individual course performance, and grade breakdowns.
class CoursesGradesScreen extends StatefulWidget {
  const CoursesGradesScreen({super.key});

  @override
  State<CoursesGradesScreen> createState() => _CoursesGradesScreenState();
}

class _CoursesGradesScreenState extends State<CoursesGradesScreen> {
  // Local list of semesters using the Grade model
  // Note: In a real app, you might fetch this from a Service/Provider
  final List<Map<String, dynamic>> semesterData = [
    {'name': 'Fall 2024', 'grades': Grade.mockRecentGrades},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: false,
        title: const Text(
          'Courses & Grades',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const GPASummaryCard(
              gpa: '3.84',
              creditsEarned: '102',
              currentSemester: 'Fall 2024',
            ),
            const SizedBox(height: 24),
            // Build sections dynamically from the data
            ...semesterData.map(
              (data) => _buildSemesterSection(
                data['name'] as String,
                data['grades'] as List<Grade>,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSemesterSection(String semesterName, List<Grade> grades) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              Text(
                semesterName,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(width: 8),
              const Expanded(child: Divider(color: Color(0xFFE2E8F0))),
            ],
          ),
        ),
        const SizedBox(height: 8),
        // Use the updated CourseGradeCard that expects a Grade object
        ...grades.map((grade) => CourseGradeCard(grade: grade)).toList(),
        const SizedBox(height: 8),
      ],
    );
  }
}
