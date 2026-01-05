import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = Student.mock;

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
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
                        const Text(
                          'My Profile',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            // Settings
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
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 48,
                        backgroundColor: Colors.white,
                        child: Text(
                          student.name.substring(0, 1).toUpperCase(),
                          style: TextStyle(
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryColor,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      student.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      student.id,
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
                        _buildStatItem('GPA', student.gpa.toString()),
                        Container(
                          width: 1,
                          height: 40,
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        _buildStatItem('Level', student.level.toString()),
                        Container(
                          width: 1,
                          height: 40,
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        _buildStatItem('Courses', '18'),
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
                  Text('Personal Information', style: AppTextStyles.heading2),
                  const SizedBox(height: 16),
                  _buildInfoCard(
                    icon: Icons.email_outlined,
                    label: 'Email',
                    value: student.email,
                    color: AppColors.primaryColor,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.phone_outlined,
                    label: 'Phone',
                    value: '+20 123 456 7890',
                    color: AppColors.successColor,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.school_outlined,
                    label: 'Department',
                    value: student.department,
                    color: AppColors.infoColor,
                  ),
                  const SizedBox(height: 12),
                  _buildInfoCard(
                    icon: Icons.calendar_today_outlined,
                    label: 'Enrollment Date',
                    value: 'September 2022',
                    color: AppColors.warningColor,
                  ),
                  const SizedBox(height: 28),
                  Text('Academic Information', style: AppTextStyles.heading2),
                  const SizedBox(height: 16),
                  _buildAcademicCard(
                    'Current Semester',
                    'Spring 2025',
                    Icons.event_note_rounded,
                    AppColors.primaryColor,
                  ),
                  const SizedBox(height: 12),
                  _buildAcademicCard(
                    'Registered Courses',
                    '6 Courses',
                    Icons.menu_book_rounded,
                    AppColors.successColor,
                  ),
                  const SizedBox(height: 12),
                  _buildAcademicCard(
                    'Completed Credits',
                    '96 Credits',
                    Icons.credit_card_rounded,
                    AppColors.warningColor,
                  ),
                  const SizedBox(height: 28),
                  Text('Quick Actions', style: AppTextStyles.heading2),
                  const SizedBox(height: 16),
                  _buildActionButton('Edit Profile', Icons.edit_outlined, () {
                    // Edit profile
                  }),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    'Change Password',
                    Icons.lock_outline_rounded,
                    () {
                      // Change password
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton(
                    'Download Transcript',
                    Icons.download_outlined,
                    () {
                      // Download transcript
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildActionButton('Logout', Icons.logout_rounded, () {
                    // Logout
                  }, isDestructive: true),
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
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackgroundColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
                    color: AppColors.subtitleColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
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
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackgroundColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
                    color: AppColors.subtitleColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(value, style: AppTextStyles.heading3),
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
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackgroundColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
                      : AppColors.textColor,
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
                          : AppColors.textColor,
                    ),
                  ),
                ),
                Icon(
                  Icons.chevron_right_rounded,
                  color: isDestructive
                      ? AppColors.errorColor
                      : AppColors.subtitleColor,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
