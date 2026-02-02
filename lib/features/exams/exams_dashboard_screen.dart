import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/exams/widgets/exam_card.dart';
import 'package:college_project/features/exams/widgets/exam_filter_bar.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(
          context.watch<AppCubit>().isDarkMode,
        ),
        centerTitle: false,
        title: Text(
          'Exam Schedule',
          style: TextStyle(
            color: AppColors.getTextColor(context.watch<AppCubit>().isDarkMode),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 12),
          ExamFilterBar(
            controller: _tabController,
            isDark: context.watch<AppCubit>().isDarkMode,
          ),
          const SizedBox(height: 8),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildFilteredExamList(
                  'upcoming',
                  context.watch<AppCubit>().isDarkMode,
                ),
                _buildFilteredExamList(
                  'completed',
                  context.watch<AppCubit>().isDarkMode,
                ),
                _buildFilteredExamList(
                  'missed',
                  context.watch<AppCubit>().isDarkMode,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilteredExamList(String status, bool isDark) {
    final now = DateTime.now();

    final filteredExams = Exam.mockExams.where((exam) {
      final isPast = exam.dateTime.isBefore(now);

      if (status == 'upcoming') {
        return !isPast;
      }
      if (status == 'completed') {
        return exam.statusString == 'completed';
      }
      if (status == 'missed') {
        return isPast && exam.statusString != 'completed';
      }
      return false;
    }).toList();

    if (filteredExams.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.event_busy_outlined,
              size: 64,
              color: AppColors.getSubtitleColor(isDark),
            ),
            const SizedBox(height: 16),
            Text(
              'No $status exams found',
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
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
        return ExamCard(exam: filteredExams[index], isDark: isDark);
      },
    );
  }
}
