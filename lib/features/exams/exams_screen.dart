import 'package:college_project/features/exams/widgets/exam_card.dart';
import 'package:college_project/features/exams/widgets/exam_filter_bar.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:flutter/material.dart';

class ExamDashboardScreen extends StatefulWidget {
  const ExamDashboardScreen({super.key});

  @override
  State<ExamDashboardScreen> createState() => _ExamDashboardScreenState();
}

class _ExamDashboardScreenState extends State<ExamDashboardScreen>
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
    // In a real MVVM app, this filtering logic would be in a ViewModel
    final filteredExams = Exam.mockExams.where((exam) {
      if (status == 'upcoming') return exam.statusString == 'upcoming';
      if (status == 'completed') return exam.statusString == 'completed';
      // Basic missed logic for demo: upcoming but time has passed
      return false;
    }).toList();

    if (filteredExams.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_note_outlined, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'No $status exams found',
              style: TextStyle(color: Colors.grey[500], fontSize: 16),
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
