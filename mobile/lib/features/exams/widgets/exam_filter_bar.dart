import 'package:college_project/core/styles/app_colors.dart';
import 'package:flutter/material.dart';

class ExamFilterBar extends StatelessWidget {
  final TabController controller;
  final bool isDark;

  const ExamFilterBar({
    super.key,
    required this.controller,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCardBackground : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(14),
      ),
      child: TabBar(
        controller: controller,
        overlayColor: WidgetStateProperty.all(Colors.transparent),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        indicator: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: AppColors.getCardBackground(isDark),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.08),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        labelColor: AppColors.primaryColor,
        unselectedLabelColor: AppColors.getSubtitleColor(isDark),
        labelStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
          letterSpacing: 0.3,
        ),
        unselectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 14,
        ),
        tabs: const [
          Tab(text: 'Upcoming'),
          Tab(text: 'Completed'),
        ],
      ),
    );
  }
}
