import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/home/cubit/home_cubit.dart';
import 'package:college_project/features/home/cubit/home_states.dart';
import 'package:college_project/features/home/widgets/notifications_preview.dart';
import 'package:college_project/features/home/widgets/profile_card.dart';
import 'package:college_project/features/home/widgets/quick_actions_row.dart';
import 'package:college_project/features/home/widgets/recent_grades.dart';
import 'package:college_project/features/home/widgets/upcoming_exam_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(create: (_) => HomeCubit(), child: const HomeView());
  }
}

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  @override
  void initState() {
    super.initState();
    // Load home data when screen initializes
    context.read<HomeCubit>().loadHomeData();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeCubit, HomeStates>(
      builder: (context, state) {
        return _buildContent(context, state);
      },
    );
  }

  Widget _buildContent(BuildContext context, HomeStates state) {
    if (state is HomeLoadingState) {
      return _buildLoadingState();
    }

    if (state is HomeErrorState) {
      return _buildErrorState(context, state.error);
    }

    if (state is HomeLoadedState || state is HomeRefreshingState) {
      final student = state is HomeLoadedState
          ? state.student
          : (state as HomeRefreshingState).student;
      final upcomingExams = state is HomeLoadedState
          ? state.upcomingExams
          : (state as HomeRefreshingState).upcomingExams;
      final recentGrades = state is HomeLoadedState
          ? state.recentGrades
          : (state as HomeRefreshingState).recentGrades;
      final notifications = state is HomeLoadedState
          ? state.notifications
          : (state as HomeRefreshingState).notifications;

      return _buildHomeContent(
        context,
        student: student,
        upcomingExams: upcomingExams,
        recentGrades: recentGrades,
        notifications: notifications,
        isRefreshing: state is HomeRefreshingState,
      );
    }

    return _buildLoadingState();
  }

  Widget _buildLoadingState() {
    return const Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Center(
        child: CircularProgressIndicator(color: AppColors.primaryColor),
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, String error) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: AppColors.errorColor,
            ),
            const SizedBox(height: 16),
            Text('Oops! Something went wrong', style: AppTextStyles.heading2),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                error,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.subtitleColor,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                context.read<HomeCubit>().loadHomeData();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 12,
                ),
              ),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHomeContent(
    BuildContext context, {
    required student,
    required upcomingExams,
    required recentGrades,
    required notifications,
    required bool isRefreshing,
  }) {
    final cubit = context.read<HomeCubit>();

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: RefreshIndicator(
        onRefresh: () => cubit.refreshHomeData(),
        color: AppColors.primaryColor,
        child: SafeArea(
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
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
                            cubit.getGreeting(),
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
                          GoRouter.of(
                            context,
                          ).pushNamed(AppRoutes.notificationScreen);
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
                                    color: Colors.black.withValues(alpha: 0.05),
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
                            if (cubit.unreadNotificationCount > 0)
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
                          label: 'leaderboard',
                          icon: Icons.leaderboard_rounded,
                          color: AppColors.primaryColor,
                          onTap: () {
                            GoRouter.of(
                              context,
                            ).pushNamed(AppRoutes.leaderboard);
                          },
                        ),
                        QuickAction(
                          label: 'Materials',
                          icon: Icons.menu_book_rounded,
                          color: AppColors.successColor,
                          onTap: () {
                            GoRouter.of(
                              context,
                            ).pushNamed(AppRoutes.materialsScreen);
                          },
                        ),
                        QuickAction(
                          label: 'Schedule',
                          icon: Icons.calendar_month_rounded,
                          color: AppColors.warningColor,
                          onTap: () {
                            // Navigate to schedule
                            GoRouter.of(
                              context,
                            ).pushNamed(AppRoutes.studentSchedule);
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
                        GoRouter.of(
                          context,
                        ).pushNamed(AppRoutes.notificationScreen);
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
      ),
    );
  }
}
