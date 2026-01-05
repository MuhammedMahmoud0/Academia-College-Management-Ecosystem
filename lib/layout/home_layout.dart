import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/styles/app_colors.dart';
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
          final cubit = context.watch<HomeLayoutCubit>();

          return Scaffold(
            body: IndexedStack(
              index: cubit.currentIndex,
              children: Constants.screens,
            ),
            bottomNavigationBar: _buildBottomNavigationBar(context, cubit),
          );
        },
      ),
    );
  }

  Widget _buildBottomNavigationBar(
    BuildContext context,
    HomeLayoutCubit cubit,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
                'Home',
              ),
              _buildNavItem(
                cubit,
                1,
                Icons.menu_book_rounded,
                Icons.menu_book_outlined,
                'Courses',
              ),
              _buildNavItem(
                cubit,
                2,
                Icons.add_circle_rounded,
                Icons.add_circle_outline_rounded,
                'Register',
              ),
              _buildNavItem(
                cubit,
                3,
                Icons.event_note_rounded,
                Icons.event_note_outlined,
                'Exams',
              ),
              _buildNavItem(
                cubit,
                4,
                Icons.person_rounded,
                Icons.person_outline_rounded,
                'Profile',
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
          color: isSelected ? AppColors.primaryLight : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? activeIcon : inactiveIcon,
              color: isSelected
                  ? AppColors.primaryColor
                  : AppColors.subtitleColor,
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
