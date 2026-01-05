import 'package:college_project/features/exams/widgets/exam_card.dart';
import 'package:college_project/features/exams/widgets/exam_filter_bar.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:flutter/material.dart';

class ExamsScreen extends StatefulWidget {
  const ExamsScreen({super.key});

  @override
  State<ExamsScreen> createState() => _ExamsScreenState();
}

class _ExamsScreenState extends State<ExamsScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: false,
        title: const Text(
          'Exam Schedule',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 12),
          ExamFilterBar(controller: _tabController),
          const SizedBox(height: 8),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildFilteredExamList('upcoming'),
                _buildFilteredExamList('completed'),
                _buildFilteredExamList('missed'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilteredExamList(String status) {
    final now = DateTime.now();

    // Filtering logic now fully implements the 'missed' state
    final filteredExams = Exam.mockExams.where((exam) {
      final isPast = exam.dateTime.isBefore(now);

      if (status == 'upcoming') {
        return !isPast;
      }
      if (status == 'completed') {
        // In this mock, we assume exams are completed if they are in the past
        // and specifically tagged as completed in a real DB.
        // For the demo, we'll use the statusString helper.
        return exam.statusString == 'completed';
      }
      if (status == 'missed') {
        // An exam is missed if the date has passed but it wasn't 'completed'.
        // For this mock logic, we'll show exams that are past but not completed.
        return isPast && exam.statusString != 'completed';
      }
      return false;
    }).toList();

    if (filteredExams.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_busy_outlined, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'No $status exams found',
              style: TextStyle(
                color: Colors.grey[500],
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredExams.length,
      itemBuilder: (context, index) {
        return ExamCard(exam: filteredExams[index]);
      },
    );
  }
}
