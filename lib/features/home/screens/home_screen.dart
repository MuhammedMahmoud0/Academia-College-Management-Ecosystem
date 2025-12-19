import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:college_project/features/home/models/notification_model.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:college_project/features/home/widgets/notifications_preview.dart';
import 'package:college_project/features/home/widgets/profile_card.dart';
import 'package:college_project/features/home/widgets/quick_actions_row.dart';
import 'package:college_project/features/home/widgets/recent_grades.dart';
import 'package:college_project/features/home/widgets/upcoming_exam_card.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data - replace with real data from your backend
    final student = Student.mock;
    final upcomingExams = Exam.mockExams;
    final recentGrades = Grade.mockRecentGrades;
    final notifications = AppNotification.mockNotifications;

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _getGreeting(),
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.subtitleColor,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          student.name.split(' ').first,
                          style: AppTextStyles.heading1,
                        ),
                      ],
                    ),
                    // Notification Bell
                    GestureDetector(
                      onTap: () {
                        // Navigate to notifications
                      },
                      child: Stack(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.cardBackgroundColor,
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.05),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.notifications_outlined,
                              color: AppColors.textColor,
                            ),
                          ),
                          if (AppNotification.unreadCount > 0)
                            Positioned(
                              right: 8,
                              top: 8,
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  color: AppColors.errorColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Profile Card
                  ProfileCard(
                    student: student,
                    onTap: () {
                      // Navigate to full profile
                    },
                  ),
                  const SizedBox(height: 24),

                  // Quick Actions
                  QuickActionsRow(
                    actions: [
                      QuickAction(
                        label: 'Courses',
                        icon: Icons.menu_book_rounded,
                        color: AppColors.primaryColor,
                        onTap: () {
                          // Navigate to courses
                        },
                      ),
                      QuickAction(
                        label: 'Register',
                        icon: Icons.add_circle_outline_rounded,
                        color: AppColors.successColor,
                        onTap: () {
                          // Navigate to registration
                        },
                      ),
                      QuickAction(
                        label: 'Schedule',
                        icon: Icons.calendar_month_rounded,
                        color: AppColors.warningColor,
                        onTap: () {
                          // Navigate to schedule
                        },
                      ),
                      QuickAction(
                        label: 'ID Card',
                        icon: Icons.badge_rounded,
                        color: AppColors.infoColor,
                        onTap: () {
                          GoRouter.of(
                            context,
                          ).pushNamed(AppRoutes.studentIdScreen);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Notifications Preview
                  NotificationsPreview(
                    notifications: notifications,
                    onTap: () {
                      // Navigate to notifications
                    },
                  ),
                  const SizedBox(height: 28),

                  // Upcoming Exams
                  UpcomingExamsCard(
                    exams: upcomingExams,
                    onSeeAllTap: () {
                      // Navigate to exams
                    },
                  ),
                  const SizedBox(height: 28),

                  // Recent Grades
                  RecentGradesCard(
                    grades: recentGrades,
                    onSeeAllTap: () {
                      // Navigate to courses & grades
                    },
                  ),
                  const SizedBox(height: 100), // Bottom padding for nav bar
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 17) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  }
}
