import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/course_regestration/cubit/registration_cubit.dart';
import 'package:college_project/features/course_regestration/cubit/registration_states.dart';
import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:college_project/features/course_regestration/widgets/group_selection_sheet.dart';
import 'package:college_project/features/course_regestration/widgets/registered_courses_table.dart';
import 'package:college_project/features/course_regestration/widgets/registration_card.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CourseRegistrationScreen extends StatelessWidget {
  const CourseRegistrationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => RegistrationCubit()..getAvailableOfferings(),
      child: const _CourseRegistrationScreenView(),
    );
  }
}

class _CourseRegistrationScreenView extends StatefulWidget {
  const _CourseRegistrationScreenView();

  @override
  State<_CourseRegistrationScreenView> createState() =>
      _CourseRegistrationScreenViewState();
}

class _CourseRegistrationScreenViewState
    extends State<_CourseRegistrationScreenView> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showGroupSelectionSheet(CourseOffering offering, bool isLoading) {
    final isDark = context.read<AppCubit>().isDarkMode;
    final cubit = context.read<RegistrationCubit>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (bottomSheetContext) => BlocProvider.value(
        value: cubit,
        child: BlocBuilder<RegistrationCubit, RegistrationStates>(
          builder: (context, state) {
            final loading = state is CourseActionLoadingState;

            return GroupSelectionSheet(
              offering: offering,
              isDark: isDark,
              isLoading: loading,
              onRegister: (lectureId, labId) {
                cubit.registerSingleCourse(lectureId: lectureId, labId: labId);
              },
              onDrop: (lectureId) {
                cubit.dropCourse(lectureId: lectureId);
              },
              onChangeLab: (lectureId, labId, oldLabId) {
                cubit.reregisterLab(
                  lectureId: lectureId,
                  labId: labId,
                  oldLabId: oldLabId,
                );
              },
            );
          },
        ),
      ),
    );
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError
            ? AppColors.errorColor
            : AppColors.successColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.r),
        ),
      ),
    );
  }

  void _showErrorDialog(RegistrationError error) {
    final isDark = context.read<AppCubit>().isDarkMode;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.getCardBackground(isDark),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.r),
        ),
        title: Row(
          children: [
            Container(
              padding: EdgeInsets.all(8.w),
              decoration: BoxDecoration(
                color: error.color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Icon(error.icon, color: error.color, size: 24.w),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Text(
                error.title,
                style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.getTextColor(isDark),
                ),
              ),
            ),
          ],
        ),
        content: Text(
          error.message,
          style: TextStyle(
            fontSize: 14.sp,
            color: AppColors.getSubtitleColor(isDark),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              'OK',
              style: TextStyle(
                color: AppColors.primaryColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.getCardBackground(isDark),
        centerTitle: false,
        title: Text(
          S.of(context).registration,
          style: TextStyle(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
            fontSize: 22.sp,
          ),
        ),
      ),
      body: BlocConsumer<RegistrationCubit, RegistrationStates>(
        listener: (context, state) {
          if (state is CourseRegisteredState) {
            Navigator.of(context).pop(); // Close bottom sheet
            _showSnackBar(state.message);
          } else if (state is CourseDroppedState) {
            Navigator.of(context).pop();
            _showSnackBar(state.message);
          } else if (state is LabReregisteredState) {
            Navigator.of(context).pop();
            _showSnackBar(state.message);
          } else if (state is CourseActionErrorState) {
            debugPrint(state.error.message);
            _showErrorDialog(state.error);
          }
        },
        builder: (context, state) {
          if (state is RegistrationLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is RegistrationErrorState) {
            return _buildErrorState(state.error, isDark);
          }

          final cubit = context.read<RegistrationCubit>();
          final registeredCourses = cubit.registeredCourses;
          final availableCourses = cubit.availableCourses;
          final isActionLoading = state is CourseActionLoadingState;

          return RefreshIndicator(
            onRefresh: () => cubit.refreshOfferings(),
            child: Column(
              children: [
                _buildSearchBar(isDark, cubit),
                if (registeredCourses.isNotEmpty) ...[
                  _buildSectionHeaderPadding(
                    '${S.of(context).registeredCourses} (${cubit.totalRegisteredCredits} CR)',
                    isDark,
                  ),
                  SizedBox(height: 12.h),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.w),
                    child: RegisteredCoursesTable(
                      courses: registeredCourses,
                      onRemove: (course) =>
                          _showGroupSelectionSheet(course, isActionLoading),
                      isDark: isDark,
                    ),
                  ),
                  SizedBox(height: 24.h),
                ],
                _buildSectionHeaderPadding(
                  S.of(context).availableCourses,
                  isDark,
                ),
                Expanded(
                  child: availableCourses.isEmpty
                      ? _buildEmptyState(isDark)
                      : ListView.builder(
                          padding: EdgeInsets.symmetric(
                            horizontal: 16.w,
                            vertical: 8.h,
                          ),
                          itemCount: availableCourses.length,
                          itemBuilder: (context, index) {
                            final offering = availableCourses[index];
                            return RegistrationCard(
                              offering: offering,
                              onTap: () => _showGroupSelectionSheet(
                                offering,
                                isActionLoading,
                              ),
                              isDark: isDark,
                              isLoading: isActionLoading,
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSearchBar(bool isDark, RegistrationCubit cubit) {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: TextField(
        controller: _searchController,
        onChanged: (value) => cubit.updateSearchQuery(value),
        style: TextStyle(
          fontSize: 14.sp,
          color: AppColors.getTextColor(isDark),
        ),
        decoration: InputDecoration(
          hintText: S.of(context).searchCoursesOrCodes,
          hintStyle: TextStyle(
            fontSize: 14.sp,
            color: AppColors.getSubtitleColor(isDark),
          ),
          prefixIcon: Icon(
            Icons.search,
            color: AppColors.getSubtitleColor(isDark),
            size: 20.w,
          ),
          filled: true,
          fillColor: AppColors.getCardBackground(isDark),
          contentPadding: EdgeInsets.symmetric(vertical: 12.h),
          border: _outlineBorder(isDark),
          enabledBorder: _outlineBorder(isDark),
          focusedBorder: _outlineBorder(isDark).copyWith(
            borderSide: const BorderSide(
              color: AppColors.primaryColor,
              width: 1.5,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeaderPadding(String title, bool isDark) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: _buildSectionHeader(title, isDark),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Row(
      children: [
        Flexible(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.getTextColor(isDark),
            ),
          ),
        ),
        SizedBox(width: 8.w),
        Expanded(child: Divider(color: AppColors.getBorderColor(isDark))),
      ],
    );
  }

  Widget _buildErrorState(String error, bool isDark) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64.w, color: AppColors.errorColor),
            SizedBox(height: 16.h),
            Text(
              S.of(context).somethingWentWrong,
              style: TextStyle(
                fontSize: 18.sp,
                fontWeight: FontWeight.w600,
                color: AppColors.getTextColor(isDark),
              ),
            ),
            SizedBox(height: 8.h),
            Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14.sp,
                color: AppColors.getSubtitleColor(isDark),
              ),
            ),
            SizedBox(height: 24.h),
            ElevatedButton.icon(
              onPressed: () =>
                  context.read<RegistrationCubit>().getAvailableOfferings(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryColor,
                padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 12.h),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
              icon: const Icon(Icons.refresh, color: Colors.white),
              label: Text(
                S.of(context).retry,
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.school_outlined,
            size: 64.w,
            color: AppColors.getSubtitleColor(isDark),
          ),
          SizedBox(height: 16.h),
          Text(
            'No courses available',
            style: TextStyle(
              fontSize: 16.sp,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  OutlineInputBorder _outlineBorder(bool isDark) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16.r),
      borderSide: BorderSide(color: AppColors.getBorderColor(isDark)),
    );
  }
}
