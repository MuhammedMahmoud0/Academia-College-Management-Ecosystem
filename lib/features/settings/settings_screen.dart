import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primaryColor,
        title: Text(
          S.of(context).settings,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              S.of(context).appearance,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.getTextColor(
                  context.watch<AppCubit>().isDarkMode,
                ),
              ),
            ),
            const SizedBox(height: 16),
            _buildThemeSection(context, context.watch<AppCubit>().isDarkMode),

            const SizedBox(height: 32),
            /*
            Text(
              S.of(context).language,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.getTextColor(
                  context.watch<AppCubit>().isDarkMode,
                ),
              ),
            ),
        
            const SizedBox(height: 16),
            _buildLanguageSection(
              context,
              context.watch<AppCubit>().isDarkMode,
            ),
            */
          ],
        ),
      ),
    );
  }

  Widget _buildThemeSection(BuildContext context, bool isDark) {
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
      child: Column(
        children: [
          _buildThemeOption(
            context,
            title: S.of(context).lightMode,
            icon: Icons.light_mode_rounded,
            isSelected: !isDark,
            onTap: () => context.read<AppCubit>().setTheme(false),
            isDark: isDark,
          ),
          Divider(height: 1, color: AppColors.getBorderColor(isDark)),
          _buildThemeOption(
            context,
            title: S.of(context).darkMode,
            icon: Icons.dark_mode_rounded,
            isSelected: isDark,
            onTap: () => context.read<AppCubit>().setTheme(true),
            isDark: isDark,
          ),
        ],
      ),
    );
  }

  Widget _buildThemeOption(
    BuildContext context, {
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryColor.withValues(alpha: 0.1)
                      : AppColors.getBackground(isDark),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: isSelected
                      ? AppColors.primaryColor
                      : AppColors.getSubtitleColor(isDark),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
              ),
              if (isSelected)
                Container(
                  width: 24,
                  height: 24,
                  decoration: const BoxDecoration(
                    color: AppColors.primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check, color: Colors.white, size: 16),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLanguageSection(BuildContext context, bool isDark) {
    final currentLang = context.watch<AppCubit>().languageCode;

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
      child: Column(
        children: [
          _buildLanguageOption(
            context,
            title: 'English',
            subtitle: S.of(context).english,
            langCode: 'en',
            isSelected: currentLang == 'en',
            onTap: () => context.read<AppCubit>().changeLanguage('en'),
            isDark: isDark,
          ),
          Divider(height: 1, color: AppColors.getBorderColor(isDark)),
          _buildLanguageOption(
            context,
            title: 'العربية',
            subtitle: S.of(context).arabic,
            langCode: 'ar',
            isSelected: currentLang == 'ar',
            onTap: () => context.read<AppCubit>().changeLanguage('ar'),
            isDark: isDark,
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageOption(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String langCode,
    required bool isSelected,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryColor.withValues(alpha: 0.1)
                      : AppColors.getBackground(isDark),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    langCode.toUpperCase(),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isSelected
                          ? AppColors.primaryColor
                          : AppColors.getSubtitleColor(isDark),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.getTextColor(isDark),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                    ),
                  ],
                ),
              ),
              if (isSelected)
                Container(
                  width: 24,
                  height: 24,
                  decoration: const BoxDecoration(
                    color: AppColors.primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check, color: Colors.white, size: 16),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
