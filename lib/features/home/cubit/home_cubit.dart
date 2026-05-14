import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/features/home/cubit/home_states.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:college_project/features/home/models/notification_model.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeCubit extends Cubit<HomeStates> {
  HomeCubit() : super(HomeInitialState());

  static HomeCubit get(BuildContext context) => BlocProvider.of(context);

  StudentModel? student;
  List<Exam> upcomingExams = [];
  List<Grade> recentGrades = [];
  // List<AppNotification> notifications = [];

  /// Load all home screen data
  Future<void> loadHomeData() async {
    emit(HomeLoadingState());

    try {
      // Simulate API call delay
      await Future.delayed(const Duration(milliseconds: 500));

      // TODO: Replace with actual API calls
      student = Constants.student!;
      upcomingExams = Exam.mockExams;
      recentGrades = Grade.mockRecentGrades;
      //  notifications = AppNotification.mockNotifications;

      emit(
        HomeLoadedState(
          student: student!,
          upcomingExams: upcomingExams,
          recentGrades: recentGrades,
          //  notifications: notifications,
        ),
      );
    } catch (error) {
      emit(HomeErrorState(error.toString()));
    }
  }

  /// Refresh home screen data
  Future<void> refreshHomeData() async {
    if (student == null) {
      // If no data loaded yet, use regular load
      return loadHomeData();
    }

    emit(
      HomeRefreshingState(
        student: student!,
        upcomingExams: upcomingExams,
        recentGrades: recentGrades,
        //    notifications: notifications,
      ),
    );

    try {
      // Simulate API call delay
      await Future.delayed(const Duration(seconds: 1));

      // TODO: Replace with actual API calls
      student = Constants.student!;
      upcomingExams = Exam.mockExams;
      recentGrades = Grade.mockRecentGrades;
      //  notifications = AppNotification.mockNotifications;

      emit(
        HomeLoadedState(
          student: student!,
          upcomingExams: upcomingExams,
          recentGrades: recentGrades,
          //    notifications: notifications,
        ),
      );
    } catch (error) {
      emit(HomeErrorState(error.toString()));
    }
  }

  /*
  /// Mark notification as read
  void markNotificationAsRead(String notificationId) {
    final index = notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      // TODO: Call API to mark notification as read
      notifications[index] = AppNotification(
        id: notifications[index].id,
        title: notifications[index].title,
        message: notifications[index].message,
        createdAt: notifications[index].createdAt,
        isRead: true,
        type: notifications[index].type,
      );

      if (student != null) {
        emit(
          HomeLoadedState(
            student: student!,
            upcomingExams: upcomingExams,
            recentGrades: recentGrades,
            notifications: notifications,
          ),
        );
      }
    }
  }

  /// Get unread notification count
  int get unreadNotificationCount {
    return notifications.where((n) => !n.isRead).length;
  }
*/
  /// Get upcoming exams count
  int get upcomingExamsCount {
    return upcomingExams.length;
  }

  /// Get greeting type based on time of day
  /// Returns: 'morning', 'afternoon', or 'evening'
  String getGreetingType() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}
