import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/exams/cubit/exams_cubit.dart';
import 'package:college_project/features/exams/cubit/exams_states.dart';
import 'package:college_project/features/exams/models/exams_response_model.dart';
import 'package:college_project/features/exams/widgets/exam_card.dart';
import 'package:college_project/features/exams/widgets/exam_filter_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ExamsScreen extends StatelessWidget {
  const ExamsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ExamsCubit()..getExams(),
      child: const _ExamsScreenView(),
    );
  }
}

class _ExamsScreenView extends StatefulWidget {
  const _ExamsScreenView();

  @override
  State<_ExamsScreenView> createState() => _ExamsScreenViewState();
}

class _ExamsScreenViewState extends State<_ExamsScreenView>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(isDark),
        centerTitle: false,
        title: Text(
          'Exam Schedule',
          style: TextStyle(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: BlocBuilder<ExamsCubit, ExamsStates>(
        builder: (context, state) {
          if (state is ExamsLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is ExamsErrorState) {
            return _buildErrorState(state.error, isDark);
          }

          if (state is ExamsLoadedState || state is ExamsRefreshingState) {
            return _buildExamsContent(isDark);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildErrorState(String error, bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Text(
            error,
            style: TextStyle(
              color: AppColors.getSubtitleColor(isDark),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.read<ExamsCubit>().getExams(),
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExamsContent(bool isDark) {
    return Column(
      children: [
        const SizedBox(height: 12),
        ExamFilterBar(controller: _tabController, isDark: isDark),
        const SizedBox(height: 8),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildExamList(
                context.read<ExamsCubit>().upcomingExams,
                'upcoming',
                isDark,
              ),
              _buildExamList(
                context.read<ExamsCubit>().completedExams,
                'completed',
                isDark,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildExamList(List<ExamModel> exams, String status, bool isDark) {
    if (exams.isEmpty) {
      return RefreshIndicator(
        onRefresh: () => context.read<ExamsCubit>().refreshExams(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 50),
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
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => context.read<ExamsCubit>().refreshExams(),
      color: AppColors.primaryColor,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: exams.length,
        itemBuilder: (context, index) {
          return ExamCard(exam: exams[index], isDark: isDark);
        },
      ),
    );
  }
}
