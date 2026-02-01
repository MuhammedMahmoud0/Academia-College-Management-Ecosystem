import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:college_project/layout/cubit/home_layout_cubit.dart';
import 'package:college_project/layout/cubit/home_layout_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeLayout extends StatelessWidget {
  const HomeLayout({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => HomeLayoutCubit(),
      child: BlocBuilder<HomeLayoutCubit, HomeLayoutStates>(
        builder: (context, state) {
          final cubit = HomeLayoutCubit.get(context);

          return Scaffold(
            body: IndexedStack(
              index: cubit.currentIndex,
              children: Constants.screens,
            ),
            bottomNavigationBar: _buildBottomNavigationBar(
              context,
              cubit,
              context.watch<AppCubit>().isDarkMode,
            ),
          );
        },
      ),
    );
  }

  Widget _buildBottomNavigationBar(
    BuildContext context,
    HomeLayoutCubit cubit,
    bool isDark,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                cubit,
                0,
                Icons.home_rounded,
                Icons.home_outlined,
                S.of(context).home,
                isDark,
              ),
              _buildNavItem(
                cubit,
                1,
                Icons.menu_book_rounded,
                Icons.menu_book_outlined,
                S.of(context).courses,
                isDark,
              ),
              _buildNavItem(
                cubit,
                2,
                Icons.add_circle_rounded,
                Icons.add_circle_outline_rounded,
                S.of(context).register,
                isDark,
              ),
              _buildNavItem(
                cubit,
                3,
                Icons.event_note_rounded,
                Icons.event_note_outlined,
                S.of(context).exams,
                isDark,
              ),
              _buildNavItem(
                cubit,
                4,
                Icons.person_rounded,
                Icons.person_outline_rounded,
                S.of(context).profile,
                isDark,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    HomeLayoutCubit cubit,
    int index,
    IconData activeIcon,
    IconData inactiveIcon,
    String label,
    bool isDark,
  ) {
    final isSelected = cubit.currentIndex == index;

    return GestureDetector(
      onTap: () => cubit.changeBottomNavBarIdx(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 16 : 12,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark
                    ? AppColors.primaryColor.withValues(alpha: 0.2)
                    : AppColors.primaryLight)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? activeIcon : inactiveIcon,
              color: isSelected
                  ? AppColors.primaryColor
                  : AppColors.getSubtitleColor(isDark),
              size: 24,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Poppins',
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
