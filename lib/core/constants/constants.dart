import 'package:college_project/features/course_regestration/registration_screen.dart';
import 'package:college_project/features/courses_grades/courses_screen.dart';
import 'package:college_project/features/exams/exams_dashboard_screen.dart';
import 'package:college_project/features/home/home_screen.dart';
import 'package:college_project/features/settings/settings_screen.dart';
import 'package:flutter/material.dart';

class Constants {
  static const List<Widget> screens = [
    HomeScreen(),
    CoursesGradesScreen(),
    CourseRegistrationScreen(),
    ExamsScreen(),
    SettingsScreen(),
  ];
}
