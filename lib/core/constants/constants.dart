import 'package:college_project/features/course_regestration/registration_screen.dart';
import 'package:college_project/features/courses_grades/courses_screen.dart';
import 'package:college_project/features/exams/exams_dashboard_screen.dart';
import 'package:college_project/features/home/home_screen.dart';
import 'package:college_project/features/home/models/student_model.dart';
import 'package:college_project/features/settings/profile_screen.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

class Constants {
  static const List<Widget> screens = [
    HomeScreen(),
    CoursesGradesScreen(),
    CourseRegistrationScreen(),
    ExamsScreen(),
    ProfileScreen(),
  ];

  static StudentModel? student;
  // Keys for SharedPreferences
  static const String themeKey = 'isDarkMode';
  static const String languageKey = 'languageCode';

  static var userImg =
      'https://pbnfvqohslrvyblgqzaz.supabase.co/storage/v1/object/public/avatars/general/user_img.jpg';

  static int availableMeters = 10;
}
