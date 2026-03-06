import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/courses_grades/cubit/courses_cubit.dart';
import 'package:college_project/features/courses_grades/models/course_grades_model.dart';
import 'package:college_project/features/courses_grades/models/courses_response_model.dart';
import 'package:flutter/material.dart';

class CourseDetailsSheet extends StatefulWidget {
  final CourseModel course;
  final CoursesCubit cubit;
  final bool isDark;

  const CourseDetailsSheet({
    super.key,
    required this.course,
    required this.cubit,
    required this.isDark,
  });

  static Future<void> show(
    BuildContext context,
    CourseModel course,
    CoursesCubit cubit,
    bool isDark,
  ) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          CourseDetailsSheet(course: course, cubit: cubit, isDark: isDark),
    );
  }

  @override
  State<CourseDetailsSheet> createState() => _CourseDetailsSheetState();
}

class _CourseDetailsSheetState extends State<CourseDetailsSheet> {
  bool _isLoading = true;
  CourseGradesModel? _courseGrades;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCourseGrades();
  }

  Future<void> _loadCourseGrades() async {
    final grades = await widget.cubit.getCourseGrades(widget.course.id);
    if (mounted) {
      setState(() {
        _isLoading = false;
        _courseGrades = grades;
        if (grades == null) {
          _error = 'Failed to load grade details';
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.getCardBackground(widget.isDark),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              _buildHandle(),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 24),
                      _buildCourseInfo(),
                      const SizedBox(height: 24),
                      _buildGradeSection(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHandle() {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: AppColors.getBorderColor(widget.isDark),
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildHeader() {
    final gradeColor = _getGradeColor(widget.course.grade ?? '');

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: gradeColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  widget.course.code,
                  style: TextStyle(
                    color: gradeColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                widget.course.name,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextColor(widget.isDark),
                ),
              ),
            ],
          ),
        ),
        if (!widget.course.isInProgress)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: gradeColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              widget.course.grade ?? '-',
              style: TextStyle(
                color: gradeColor,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildCourseInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getBackground(widget.isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(widget.isDark)),
      ),
      child: Column(
        children: [
          _buildInfoRow(
            Icons.person_outline,
            'Instructor',
            widget.course.instructor,
          ),
          const SizedBox(height: 12),
          _buildInfoRow(
            Icons.calendar_today_outlined,
            'Semester',
            widget.course.semesterYear,
          ),
          const SizedBox(height: 12),
          _buildInfoRow(
            Icons.school_outlined,
            'Credits',
            '${widget.course.credits} Credit Hours',
          ),
          const SizedBox(height: 12),
          _buildInfoRow(
            Icons.info_outline,
            'Status',
            widget.course.isInProgress ? 'In Progress' : 'Completed',
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.getSubtitleColor(widget.isDark)),
        const SizedBox(width: 12),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.getSubtitleColor(widget.isDark),
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.getTextColor(widget.isDark),
          ),
        ),
      ],
    );
  }

  Widget _buildGradeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Grade Breakdown',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.getTextColor(widget.isDark),
          ),
        ),
        const SizedBox(height: 16),
        if (_isLoading)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(32),
              child: CircularProgressIndicator(),
            ),
          )
        else if (_error != null)
          _buildErrorState()
        else if (_courseGrades != null)
          _buildGradeBreakdown()
        else
          _buildNoGradesState(),
      ],
    );
  }

  Widget _buildErrorState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.getBackground(widget.isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(widget.isDark)),
      ),
      child: Column(
        children: [
          Icon(
            Icons.error_outline,
            size: 48,
            color: AppColors.getSubtitleColor(widget.isDark),
          ),
          const SizedBox(height: 12),
          Text(
            _error!,
            style: TextStyle(
              color: AppColors.getSubtitleColor(widget.isDark),
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          TextButton.icon(
            onPressed: () {
              setState(() {
                _isLoading = true;
                _error = null;
              });
              _loadCourseGrades();
            },
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildNoGradesState() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.getBackground(widget.isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(widget.isDark)),
      ),
      child: Column(
        children: [
          Icon(
            Icons.assignment_outlined,
            size: 48,
            color: AppColors.getSubtitleColor(widget.isDark),
          ),
          const SizedBox(height: 12),
          Text(
            'No grade details available',
            style: TextStyle(
              color: AppColors.getSubtitleColor(widget.isDark),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGradeBreakdown() {
    final grades = _courseGrades!;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getBackground(widget.isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(widget.isDark)),
      ),
      child: Column(
        children: [
          ...grades.breakdown.map((item) => _buildBreakdownItem(item)),
          if (grades.breakdown.isNotEmpty) ...[
            const SizedBox(height: 16),
            Divider(color: AppColors.getBorderColor(widget.isDark)),
            const SizedBox(height: 16),
            _buildTotalRow(grades),
          ],
        ],
      ),
    );
  }

  Widget _buildBreakdownItem(GradeBreakdown item) {
    final percentage = item.percentage;
    final color = _getPercentageColor(percentage ?? 0);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                item.category,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.getTextColor(widget.isDark),
                ),
              ),
              Text(
                item.displayScore,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: (percentage ?? 0) / 100,
              minHeight: 8,

              backgroundColor: AppColors.getBorderColor(widget.isDark),
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalRow(CourseGradesModel grades) {
    final gradeColor = _getGradeColor(grades.letterGrade);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Total Grade',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.getTextColor(widget.isDark),
          ),
        ),
        Row(
          children: [
            Text(
              '${grades.totalScore?.toStringAsFixed(1)}%',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: gradeColor,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: gradeColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                grades.letterGrade,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: gradeColor,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Color _getGradeColor(String gradeStr) {
    if (gradeStr.startsWith('A')) return const Color(0xFF3B82F6);
    if (gradeStr.startsWith('B')) return const Color(0xFF10B981);
    if (gradeStr.startsWith('C')) return const Color(0xFFF59E0B);
    if (gradeStr.startsWith('D')) return const Color(0xFFF97316);
    return const Color(0xFF6366F1);
  }

  Color _getPercentageColor(double percentage) {
    if (percentage >= 90) return const Color(0xFF3B82F6);
    if (percentage >= 80) return const Color(0xFF10B981);
    if (percentage >= 70) return const Color(0xFFF59E0B);
    if (percentage >= 60) return const Color(0xFFF97316);
    return const Color(0xFFEF4444);
  }
}
