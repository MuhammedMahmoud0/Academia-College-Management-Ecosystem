import 'package:college_project/features/home/models/exam_model.dart';
import 'package:college_project/features/home/models/grade_model.dart';
import 'package:college_project/features/home/models/notification_model.dart';
import 'package:college_project/features/home/models/student_model.dart';

abstract class HomeStates {}

class HomeInitialState extends HomeStates {}

class HomeLoadingState extends HomeStates {}

class HomeLoadedState extends HomeStates {
  final StudentModel student;
  final List<Exam> upcomingExams;
  final List<Grade> recentGrades;
  // final List<AppNotification> notifications;

  HomeLoadedState({
    required this.student,
    required this.upcomingExams,
    required this.recentGrades,
    // required this.notifications,
  });
}

class HomeErrorState extends HomeStates {
  final String error;

  HomeErrorState(this.error);
}

class HomeRefreshingState extends HomeStates {
  final StudentModel student;
  final List<Exam> upcomingExams;
  final List<Grade> recentGrades;
  // final List<AppNotification> notifications;

  HomeRefreshingState({
    required this.student,
    required this.upcomingExams,
    required this.recentGrades,
    // required this.notifications,
  });
}
