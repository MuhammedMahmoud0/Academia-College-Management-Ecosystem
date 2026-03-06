import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/attendance/cubit/attendance_cubit.dart';
import 'package:college_project/features/attendance/cubit/attendance_states.dart';
import 'package:college_project/features/home/cubit/home_cubit.dart';
import 'package:college_project/features/home/cubit/home_states.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:college_project/features/home/widgets/notifications_preview.dart';
import 'package:college_project/features/home/widgets/profile_card.dart';
import 'package:college_project/features/home/widgets/quick_actions_row.dart';
import 'package:college_project/features/home/widgets/recent_grades.dart';
import 'package:college_project/features/home/widgets/attendance_card.dart';
import 'package:college_project/features/home/widgets/upcoming_exam_card.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => HomeCubit()..loadHomeData()),
        BlocProvider(create: (_) => AttendanceCubit()),
      ],
      child: const HomeView(),
    );
  }
}

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  @override
  Widget build(BuildContext context) {
    return BlocListener<AttendanceCubit, AttendanceStates>(
      listener: (context, state) {
        if (state is AttendanceLoadedState) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.attendance.msg!),
              backgroundColor: AppColors.successColor,
            ),
          );
        }
        if (state is AttendanceErrorState) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.error),
              backgroundColor: AppColors.errorColor,
            ),
          );
        }
      },
      child: BlocBuilder<HomeCubit, HomeStates>(
        builder: (context, state) {
          return _buildContent(
            context,
            state,
            context.watch<AppCubit>().isDarkMode,
          );
        },
      ),
    );
  }
}

Widget _buildContent(BuildContext context, HomeStates state, bool isDark) {
  if (state is HomeLoadingState) {
    return _buildLoadingState(isDark);
  }

  if (state is HomeErrorState) {
    return _buildErrorState(context, state.error, isDark);
  }

  if (state is HomeLoadedState || state is HomeRefreshingState) {
    StudentModel student = state is HomeLoadedState
        ? Constants.student!
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
      isDark: isDark,
    );
  }

  return _buildLoadingState(isDark);
}

Widget _buildLoadingState(bool isDark) {
  return Scaffold(
    body: const Center(
      child: CircularProgressIndicator(color: AppColors.primaryColor),
    ),
  );
}

Widget _buildErrorState(BuildContext context, String error, bool isDark) {
  return Scaffold(
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
          Text(
            S.of(context).somethingWentWrong,
            style: AppTextStyles.heading2.copyWith(
              color: AppColors.getTextColor(isDark),
            ),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.getSubtitleColor(isDark),
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.read<HomeCubit>().loadHomeData(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
            ),
            child: Text(S.of(context).retry),
          ),
        ],
      ),
    ),
  );
}

Widget _buildHomeContent(
  BuildContext context, {
  required StudentModel student,
  required upcomingExams,
  required recentGrades,
  required notifications,
  required bool isRefreshing,
  required bool isDark,
}) {
  final cubit = context.read<HomeCubit>();

  return Scaffold(
    body: RefreshIndicator(
      onRefresh: () => cubit.refreshHomeData(),
      color: AppColors.primaryColor,
      child: SafeArea(
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics(),
          ),
          slivers: [
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
                          _getLocalizedGreeting(
                            context,
                            cubit.getGreetingType(),
                          ),
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.getSubtitleColor(isDark),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          student.name!.split(' ').first,
                          style: AppTextStyles.heading1.copyWith(
                            color: AppColors.getTextColor(isDark),
                          ),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () => GoRouter.of(
                        context,
                      ).pushNamed(AppRoutes.notificationScreen),
                      child: Stack(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.getCardBackground(isDark),
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(
                                    alpha: isDark ? 0.3 : 0.05,
                                  ),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Icon(
                              Icons.notifications_outlined,
                              color: AppColors.getTextColor(isDark),
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
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  ProfileCard(student: student, onTap: () {}),
                  const SizedBox(height: 24),
                  QuickActionsRow(
                    isDark: isDark,
                    actions: [
                      QuickAction(
                        label: S.of(context).leaderboard,
                        icon: Icons.leaderboard_outlined,
                        color: AppColors.primaryColor,
                        onTap: () => GoRouter.of(
                          context,
                        ).pushNamed(AppRoutes.leaderboard),
                      ),
                      QuickAction(
                        label: S.of(context).materials,
                        icon: Icons.menu_book_outlined,
                        color: AppColors.successColor,
                        onTap: () => GoRouter.of(
                          context,
                        ).pushNamed(AppRoutes.materialsScreen),
                      ),
                      QuickAction(
                        label: S.of(context).schedule,
                        icon: Icons.calendar_month_outlined,
                        color: AppColors.warningColor,
                        onTap: () => GoRouter.of(
                          context,
                        ).pushNamed(AppRoutes.studentSchedule),
                      ),
                      QuickAction(
                        label: S.of(context).community,
                        icon: Icons.chat_bubble_outline,
                        color: AppColors.infoColor,
                        onTap: () => GoRouter.of(
                          context,
                        ).pushNamed(AppRoutes.communityScreen),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  AttendanceCard(
                    isDark: isDark,
                    onCardTap: () => GoRouter.of(
                      context,
                    ).pushNamed(AppRoutes.attendanceScreen),
                    onScanQrTap: () async {
                      String? code = await GoRouter.of(
                        context,
                      ).pushNamed(AppRoutes.qrScannerScreen);

                      if (code != null) {
                        debugPrint("Code is: $code");
                        context.read<AttendanceCubit>().scanAttendance(code);
                      }
                    },
                  ),
                  const SizedBox(height: 28),
                  NotificationsPreview(
                    notifications: notifications,
                    isDark: isDark,
                    onTap: () => GoRouter.of(
                      context,
                    ).pushNamed(AppRoutes.notificationScreen),
                  ),
                  const SizedBox(height: 28),
                  UpcomingExamsCard(
                    exams: upcomingExams,
                    isDark: isDark,
                    onSeeAllTap: () {},
                  ),
                  const SizedBox(height: 28),
                  RecentGradesCard(
                    grades: recentGrades,
                    isDark: isDark,
                    onSeeAllTap: () {},
                  ),
                  const SizedBox(height: 100),
                ]),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

String _getLocalizedGreeting(BuildContext context, String greetingType) {
  switch (greetingType) {
    case 'morning':
      return S.of(context).goodMorning;
    case 'afternoon':
      return S.of(context).goodAfternoon;
    case 'evening':
      return S.of(context).goodEvening;
    default:
      return S.of(context).goodMorning;
  }
}
