import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/core/widgets/widgets.dart';
import 'package:college_project/features/auth/login/cubit/auth_cubit.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = Constants.student!;
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Header with gradient
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primaryColor,
                      AppColors.primaryColor.withValues(alpha: 0.8),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(32),
                    bottomRight: Radius.circular(32),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          S.of(context).myProfile,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            context.push(AppRoutes.settingsScreen);
                          },
                          icon: const Icon(
                            Icons.settings_outlined,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    // Profile Picture
                    ClipOval(
                      child: Widgets.defaultImage(
                        student.avatarUrl!,
                        width: 100,
                        height: 100,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      student.name!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'ID: ${student.studentId!}',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.9),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Stats Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem(
                          S.of(context).gpa,
                          student.cgpa.toString(),
                        ),
                        Container(
                          width: 1,
                          height: 40,
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        _buildStatItem(
                          S.of(context).level,
                          student.yearLevel.toString(),
                        ),
                        Container(
                          width: 1,
                          height: 40,
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        _buildStatItem(
                          S.of(context).courses,
                          student.totalCredits.toString(),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Profile Information
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  Text(
                    S.of(context).personalInformation,
                    style: AppTextStyles.heading2.copyWith(
                      color: AppColors.getTextColor(
                        context.watch<AppCubit>().isDarkMode,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoCard(
                    icon: Icons.email_outlined,
                    label: S.of(context).email,
                    value: student.email!,
                    color: AppColors.primaryColor,
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.phone_outlined,
                    label: S.of(context).phone,
                    value: student.phone!,
                    color: AppColors.successColor,
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.school_outlined,
                    label: S.of(context).department,
                    value: student.departmentName!,
                    color: AppColors.infoColor,
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.calendar_today_outlined,
                    label: S.of(context).enrollmentDate,
                    value: 'September 2022',
                    color: AppColors.warningColor,
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 28),
                  Text(
                    S.of(context).academicInformation,
                    style: AppTextStyles.heading2.copyWith(
                      color: AppColors.getTextColor(
                        context.watch<AppCubit>().isDarkMode,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  _buildAcademicCard(
                    S.of(context).currentSemester,
                    'Spring 2025',
                    Icons.event_note_rounded,
                    AppColors.primaryColor,
                    context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildAcademicCard(
                    S.of(context).registeredCoursesCount,
                    '6 ${S.of(context).courses}',
                    Icons.menu_book_rounded,
                    AppColors.successColor,
                    context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildAcademicCard(
                    S.of(context).completedCredits,
                    '${student.totalCredits} ${S.of(context).creditHours}',
                    Icons.credit_card_rounded,
                    AppColors.warningColor,
                    context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 28),
                  Text(
                    S.of(context).quickActions,
                    style: AppTextStyles.heading2.copyWith(
                      color: AppColors.getTextColor(
                        context.watch<AppCubit>().isDarkMode,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildActionButton(
                    S.of(context).idCard,
                    Icons.badge_rounded,
                    () {
                      context.push(AppRoutes.studentIdScreen);
                    },
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    S.of(context).editProfile,
                    Icons.edit_outlined,
                    () {
                      context.push(AppRoutes.editProfileScreen);
                    },
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    S.of(context).changePassword,
                    Icons.lock_outline_rounded,
                    () {
                      context.push(AppRoutes.changePasswordScreen);
                    },
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    S.of(context).downloadTranscript,
                    Icons.download_outlined,
                    () {},
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    S.of(context).logout,
                    Icons.logout_rounded,
                    () {
                      final authCubit = context.read<AuthCubit>();
                      final isDark = context.read<AppCubit>().isDarkMode;
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: AppColors.getCardBackground(isDark),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          title: Text(
                            S.of(context).logout,
                            style: AppTextStyles.heading2.copyWith(
                              color: AppColors.getTextColor(isDark),
                            ),
                          ),
                          content: Text(
                            S.of(context).logoutConfirmation,
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.getSubtitleColor(isDark),
                            ),
                          ),
                          actions: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx),
                                  child: Text(
                                    S.of(context).cancel,
                                    style: AppTextStyles.bodyMedium.copyWith(
                                      color: AppColors.getSubtitleColor(isDark),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(ctx);
                                    authCubit.logout();
                                  },
                                  child: Text(
                                    S.of(context).logout,
                                    style: AppTextStyles.bodyMedium.copyWith(
                                      color: AppColors.errorColor,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                    isDestructive: true,
                    isDark: context.watch<AppCubit>().isDarkMode,
                  ),
                  const SizedBox(height: 100),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.8),
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.getSubtitleColor(isDark),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAcademicCard(
    String label,
    String value,
    IconData icon,
    Color color,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.getSubtitleColor(isDark),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: AppTextStyles.heading3.copyWith(
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    String label,
    IconData icon,
    VoidCallback onTap, {
    bool isDestructive = false,
    required bool isDark,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  icon,
                  color: isDestructive
                      ? AppColors.errorColor
                      : AppColors.getTextColor(isDark),
                  size: 24,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    label,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: isDestructive
                          ? AppColors.errorColor
                          : AppColors.getTextColor(isDark),
                    ),
                  ),
                ),
                Icon(
                  Icons.chevron_right_rounded,
                  color: isDestructive
                      ? AppColors.errorColor
                      : AppColors.getSubtitleColor(isDark),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
