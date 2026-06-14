// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(_current != null,
        'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.');
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(instance != null,
        'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?');
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `Academia`
  String get appTitle {
    return Intl.message(
      'Academia',
      name: 'appTitle',
      desc: '',
      args: [],
    );
  }

  /// `Home`
  String get home {
    return Intl.message(
      'Home',
      name: 'home',
      desc: '',
      args: [],
    );
  }

  /// `Courses`
  String get courses {
    return Intl.message(
      'Courses',
      name: 'courses',
      desc: '',
      args: [],
    );
  }

  /// `Register`
  String get register {
    return Intl.message(
      'Register',
      name: 'register',
      desc: '',
      args: [],
    );
  }

  /// `Exams`
  String get exams {
    return Intl.message(
      'Exams',
      name: 'exams',
      desc: '',
      args: [],
    );
  }

  /// `Profile`
  String get profile {
    return Intl.message(
      'Profile',
      name: 'profile',
      desc: '',
      args: [],
    );
  }

  /// `Good Morning`
  String get goodMorning {
    return Intl.message(
      'Good Morning',
      name: 'goodMorning',
      desc: '',
      args: [],
    );
  }

  /// `Good Afternoon`
  String get goodAfternoon {
    return Intl.message(
      'Good Afternoon',
      name: 'goodAfternoon',
      desc: '',
      args: [],
    );
  }

  /// `Good Evening`
  String get goodEvening {
    return Intl.message(
      'Good Evening',
      name: 'goodEvening',
      desc: '',
      args: [],
    );
  }

  /// `Leaderboard`
  String get leaderboard {
    return Intl.message(
      'Leaderboard',
      name: 'leaderboard',
      desc: '',
      args: [],
    );
  }

  /// `Materials`
  String get materials {
    return Intl.message(
      'Materials',
      name: 'materials',
      desc: '',
      args: [],
    );
  }

  /// `Schedule`
  String get schedule {
    return Intl.message(
      'Schedule',
      name: 'schedule',
      desc: '',
      args: [],
    );
  }

  /// `Community`
  String get community {
    return Intl.message(
      'Community',
      name: 'community',
      desc: '',
      args: [],
    );
  }

  /// `ID Card`
  String get idCard {
    return Intl.message(
      'ID Card',
      name: 'idCard',
      desc: '',
      args: [],
    );
  }

  /// `Notifications`
  String get notifications {
    return Intl.message(
      'Notifications',
      name: 'notifications',
      desc: '',
      args: [],
    );
  }

  /// `No new notifications`
  String get noNewNotifications {
    return Intl.message(
      'No new notifications',
      name: 'noNewNotifications',
      desc: '',
      args: [],
    );
  }

  /// `You have {count} new notification(s)`
  String youHaveNewNotifications(int count) {
    return Intl.message(
      'You have $count new notification(s)',
      name: 'youHaveNewNotifications',
      desc: '',
      args: [count],
    );
  }

  /// `Upcoming Exams`
  String get upcomingExams {
    return Intl.message(
      'Upcoming Exams',
      name: 'upcomingExams',
      desc: '',
      args: [],
    );
  }

  /// `Recent Grades`
  String get recentGrades {
    return Intl.message(
      'Recent Grades',
      name: 'recentGrades',
      desc: '',
      args: [],
    );
  }

  /// `See All`
  String get seeAll {
    return Intl.message(
      'See All',
      name: 'seeAll',
      desc: '',
      args: [],
    );
  }

  /// `Courses & Grades`
  String get coursesAndGrades {
    return Intl.message(
      'Courses & Grades',
      name: 'coursesAndGrades',
      desc: '',
      args: [],
    );
  }

  /// `Cumulative GPA`
  String get cumulativeGpa {
    return Intl.message(
      'Cumulative GPA',
      name: 'cumulativeGpa',
      desc: '',
      args: [],
    );
  }

  /// `Credits Earned`
  String get creditsEarned {
    return Intl.message(
      'Credits Earned',
      name: 'creditsEarned',
      desc: '',
      args: [],
    );
  }

  /// `Current Semester`
  String get currentSemester {
    return Intl.message(
      'Current Semester',
      name: 'currentSemester',
      desc: '',
      args: [],
    );
  }

  /// `Grade Points`
  String get gradePoints {
    return Intl.message(
      'Grade Points',
      name: 'gradePoints',
      desc: '',
      args: [],
    );
  }

  /// `Credit Hours`
  String get creditHours {
    return Intl.message(
      'Credit Hours',
      name: 'creditHours',
      desc: '',
      args: [],
    );
  }

  /// `IN PROGRESS`
  String get inProgress {
    return Intl.message(
      'IN PROGRESS',
      name: 'inProgress',
      desc: '',
      args: [],
    );
  }

  /// `Registration`
  String get registration {
    return Intl.message(
      'Registration',
      name: 'registration',
      desc: '',
      args: [],
    );
  }

  /// `Registered Courses`
  String get registeredCourses {
    return Intl.message(
      'Registered Courses',
      name: 'registeredCourses',
      desc: '',
      args: [],
    );
  }

  /// `Available Courses`
  String get availableCourses {
    return Intl.message(
      'Available Courses',
      name: 'availableCourses',
      desc: '',
      args: [],
    );
  }

  /// `Search courses or codes...`
  String get searchCoursesOrCodes {
    return Intl.message(
      'Search courses or codes...',
      name: 'searchCoursesOrCodes',
      desc: '',
      args: [],
    );
  }

  /// `Add Course`
  String get addCourse {
    return Intl.message(
      'Add Course',
      name: 'addCourse',
      desc: '',
      args: [],
    );
  }

  /// `Remove Course`
  String get removeCourse {
    return Intl.message(
      'Remove Course',
      name: 'removeCourse',
      desc: '',
      args: [],
    );
  }

  /// `Seats`
  String get seats {
    return Intl.message(
      'Seats',
      name: 'seats',
      desc: '',
      args: [],
    );
  }

  /// `Full`
  String get full {
    return Intl.message(
      'Full',
      name: 'full',
      desc: '',
      args: [],
    );
  }

  /// `Exam Schedule`
  String get examSchedule {
    return Intl.message(
      'Exam Schedule',
      name: 'examSchedule',
      desc: '',
      args: [],
    );
  }

  /// `Upcoming`
  String get upcoming {
    return Intl.message(
      'Upcoming',
      name: 'upcoming',
      desc: '',
      args: [],
    );
  }

  /// `Completed`
  String get completed {
    return Intl.message(
      'Completed',
      name: 'completed',
      desc: '',
      args: [],
    );
  }

  /// `Missed`
  String get missed {
    return Intl.message(
      'Missed',
      name: 'missed',
      desc: '',
      args: [],
    );
  }

  /// `No {status} exams found`
  String noExamsFound(String status) {
    return Intl.message(
      'No $status exams found',
      name: 'noExamsFound',
      desc: '',
      args: [status],
    );
  }

  /// `Today`
  String get today {
    return Intl.message(
      'Today',
      name: 'today',
      desc: '',
      args: [],
    );
  }

  /// `day`
  String get day {
    return Intl.message(
      'day',
      name: 'day',
      desc: '',
      args: [],
    );
  }

  /// `days`
  String get days {
    return Intl.message(
      'days',
      name: 'days',
      desc: '',
      args: [],
    );
  }

  /// `My Profile`
  String get myProfile {
    return Intl.message(
      'My Profile',
      name: 'myProfile',
      desc: '',
      args: [],
    );
  }

  /// `Personal Information`
  String get personalInformation {
    return Intl.message(
      'Personal Information',
      name: 'personalInformation',
      desc: '',
      args: [],
    );
  }

  /// `Academic Information`
  String get academicInformation {
    return Intl.message(
      'Academic Information',
      name: 'academicInformation',
      desc: '',
      args: [],
    );
  }

  /// `Quick Actions`
  String get quickActions {
    return Intl.message(
      'Quick Actions',
      name: 'quickActions',
      desc: '',
      args: [],
    );
  }

  /// `Email`
  String get email {
    return Intl.message(
      'Email',
      name: 'email',
      desc: '',
      args: [],
    );
  }

  /// `Phone`
  String get phone {
    return Intl.message(
      'Phone',
      name: 'phone',
      desc: '',
      args: [],
    );
  }

  /// `Department`
  String get department {
    return Intl.message(
      'Department',
      name: 'department',
      desc: '',
      args: [],
    );
  }

  /// `Enrollment Date`
  String get enrollmentDate {
    return Intl.message(
      'Enrollment Date',
      name: 'enrollmentDate',
      desc: '',
      args: [],
    );
  }

  /// `Registered Courses`
  String get registeredCoursesCount {
    return Intl.message(
      'Registered Courses',
      name: 'registeredCoursesCount',
      desc: '',
      args: [],
    );
  }

  /// `Completed Credits`
  String get completedCredits {
    return Intl.message(
      'Completed Credits',
      name: 'completedCredits',
      desc: '',
      args: [],
    );
  }

  /// `Edit Profile`
  String get editProfile {
    return Intl.message(
      'Edit Profile',
      name: 'editProfile',
      desc: '',
      args: [],
    );
  }

  /// `Change Password`
  String get changePassword {
    return Intl.message(
      'Change Password',
      name: 'changePassword',
      desc: '',
      args: [],
    );
  }

  /// `Download Transcript`
  String get downloadTranscript {
    return Intl.message(
      'Download Transcript',
      name: 'downloadTranscript',
      desc: '',
      args: [],
    );
  }

  /// `Logout`
  String get logout {
    return Intl.message(
      'Logout',
      name: 'logout',
      desc: '',
      args: [],
    );
  }

  /// `GPA`
  String get gpa {
    return Intl.message(
      'GPA',
      name: 'gpa',
      desc: '',
      args: [],
    );
  }

  /// `Level`
  String get level {
    return Intl.message(
      'Level',
      name: 'level',
      desc: '',
      args: [],
    );
  }

  /// `Status`
  String get status {
    return Intl.message(
      'Status',
      name: 'status',
      desc: '',
      args: [],
    );
  }

  /// `Good`
  String get good {
    return Intl.message(
      'Good',
      name: 'good',
      desc: '',
      args: [],
    );
  }

  /// `Settings`
  String get settings {
    return Intl.message(
      'Settings',
      name: 'settings',
      desc: '',
      args: [],
    );
  }

  /// `Appearance`
  String get appearance {
    return Intl.message(
      'Appearance',
      name: 'appearance',
      desc: '',
      args: [],
    );
  }

  /// `Language`
  String get language {
    return Intl.message(
      'Language',
      name: 'language',
      desc: '',
      args: [],
    );
  }

  /// `Light Mode`
  String get lightMode {
    return Intl.message(
      'Light Mode',
      name: 'lightMode',
      desc: '',
      args: [],
    );
  }

  /// `Dark Mode`
  String get darkMode {
    return Intl.message(
      'Dark Mode',
      name: 'darkMode',
      desc: '',
      args: [],
    );
  }

  /// `English`
  String get english {
    return Intl.message(
      'English',
      name: 'english',
      desc: '',
      args: [],
    );
  }

  /// `Arabic`
  String get arabic {
    return Intl.message(
      'Arabic',
      name: 'arabic',
      desc: '',
      args: [],
    );
  }

  /// `Error`
  String get error {
    return Intl.message(
      'Error',
      name: 'error',
      desc: '',
      args: [],
    );
  }

  /// `Retry`
  String get retry {
    return Intl.message(
      'Retry',
      name: 'retry',
      desc: '',
      args: [],
    );
  }

  /// `Oops! Something went wrong`
  String get somethingWentWrong {
    return Intl.message(
      'Oops! Something went wrong',
      name: 'somethingWentWrong',
      desc: '',
      args: [],
    );
  }

  /// `COURSE & ID`
  String get courseId {
    return Intl.message(
      'COURSE & ID',
      name: 'courseId',
      desc: '',
      args: [],
    );
  }

  /// `CR`
  String get cr {
    return Intl.message(
      'CR',
      name: 'cr',
      desc: '',
      args: [],
    );
  }

  /// `INSTRUCTOR`
  String get instructor {
    return Intl.message(
      'INSTRUCTOR',
      name: 'instructor',
      desc: '',
      args: [],
    );
  }

  /// `SCHEDULE`
  String get scheduleHeader {
    return Intl.message(
      'SCHEDULE',
      name: 'scheduleHeader',
      desc: '',
      args: [],
    );
  }

  /// `Choose Image Source`
  String get chooseImageSource {
    return Intl.message(
      'Choose Image Source',
      name: 'chooseImageSource',
      desc: '',
      args: [],
    );
  }

  /// `Camera`
  String get camera {
    return Intl.message(
      'Camera',
      name: 'camera',
      desc: '',
      args: [],
    );
  }

  /// `Gallery`
  String get gallery {
    return Intl.message(
      'Gallery',
      name: 'gallery',
      desc: '',
      args: [],
    );
  }

  /// `Full Name`
  String get fullName {
    return Intl.message(
      'Full Name',
      name: 'fullName',
      desc: '',
      args: [],
    );
  }

  /// `Address`
  String get address {
    return Intl.message(
      'Address',
      name: 'address',
      desc: '',
      args: [],
    );
  }

  /// `National ID`
  String get nationalId {
    return Intl.message(
      'National ID',
      name: 'nationalId',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your name`
  String get pleaseEnterName {
    return Intl.message(
      'Please enter your name',
      name: 'pleaseEnterName',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your phone number`
  String get pleaseEnterPhone {
    return Intl.message(
      'Please enter your phone number',
      name: 'pleaseEnterPhone',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your address`
  String get pleaseEnterAddress {
    return Intl.message(
      'Please enter your address',
      name: 'pleaseEnterAddress',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your national ID`
  String get pleaseEnterNationalId {
    return Intl.message(
      'Please enter your national ID',
      name: 'pleaseEnterNationalId',
      desc: '',
      args: [],
    );
  }

  /// `Save Changes`
  String get saveChanges {
    return Intl.message(
      'Save Changes',
      name: 'saveChanges',
      desc: '',
      args: [],
    );
  }

  /// `Welcome Back!`
  String get welcomeBack {
    return Intl.message(
      'Welcome Back!',
      name: 'welcomeBack',
      desc: '',
      args: [],
    );
  }

  /// `Sign in to continue to your account.`
  String get signInToContinueToYourAccount {
    return Intl.message(
      'Sign in to continue to your account.',
      name: 'signInToContinueToYourAccount',
      desc: '',
      args: [],
    );
  }

  /// `Forgot password?`
  String get forgotPassword {
    return Intl.message(
      'Forgot password?',
      name: 'forgotPassword',
      desc: '',
      args: [],
    );
  }

  /// `Login successfully`
  String get loginSuccessfully {
    return Intl.message(
      'Login successfully',
      name: 'loginSuccessfully',
      desc: '',
      args: [],
    );
  }

  /// `Login`
  String get login {
    return Intl.message(
      'Login',
      name: 'login',
      desc: '',
      args: [],
    );
  }

  /// `Are you sure you want to logout?`
  String get logoutConfirmation {
    return Intl.message(
      'Are you sure you want to logout?',
      name: 'logoutConfirmation',
      desc: '',
      args: [],
    );
  }

  /// `Cancel`
  String get cancel {
    return Intl.message(
      'Cancel',
      name: 'cancel',
      desc: '',
      args: [],
    );
  }

  /// `Email Address`
  String get emailAddress {
    return Intl.message(
      'Email Address',
      name: 'emailAddress',
      desc: '',
      args: [],
    );
  }

  /// `Password`
  String get password {
    return Intl.message(
      'Password',
      name: 'password',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your email`
  String get pleaseEnterYourEmail {
    return Intl.message(
      'Please enter your email',
      name: 'pleaseEnterYourEmail',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your password`
  String get pleaseEnterYourPassword {
    return Intl.message(
      'Please enter your password',
      name: 'pleaseEnterYourPassword',
      desc: '',
      args: [],
    );
  }

  /// `Password must be at least 6 characters`
  String get passwordMustBeAtLeastSixCharacters {
    return Intl.message(
      'Password must be at least 6 characters',
      name: 'passwordMustBeAtLeastSixCharacters',
      desc: '',
      args: [],
    );
  }

  /// `Please enter a valid email`
  String get pleaseEnterAValidEmail {
    return Intl.message(
      'Please enter a valid email',
      name: 'pleaseEnterAValidEmail',
      desc: '',
      args: [],
    );
  }

  /// `Attendance`
  String get attendance {
    return Intl.message(
      'Attendance',
      name: 'attendance',
      desc: '',
      args: [],
    );
  }

  /// `View your attendance history`
  String get viewAttendanceHistory {
    return Intl.message(
      'View your attendance history',
      name: 'viewAttendanceHistory',
      desc: '',
      args: [],
    );
  }

  /// `Scan QR`
  String get scanQr {
    return Intl.message(
      'Scan QR',
      name: 'scanQr',
      desc: '',
      args: [],
    );
  }

  /// `Attendance History`
  String get attendanceHistory {
    return Intl.message(
      'Attendance History',
      name: 'attendanceHistory',
      desc: '',
      args: [],
    );
  }

  /// `Scan Attendance`
  String get scanAttendance {
    return Intl.message(
      'Scan Attendance',
      name: 'scanAttendance',
      desc: '',
      args: [],
    );
  }

  /// `Present`
  String get present {
    return Intl.message(
      'Present',
      name: 'present',
      desc: '',
      args: [],
    );
  }

  /// `Absent`
  String get absent {
    return Intl.message(
      'Absent',
      name: 'absent',
      desc: '',
      args: [],
    );
  }

  /// `Late`
  String get late {
    return Intl.message(
      'Late',
      name: 'late',
      desc: '',
      args: [],
    );
  }

  /// `Excused`
  String get excused {
    return Intl.message(
      'Excused',
      name: 'excused',
      desc: '',
      args: [],
    );
  }

  /// `No attendance records found`
  String get noAttendanceRecords {
    return Intl.message(
      'No attendance records found',
      name: 'noAttendanceRecords',
      desc: '',
      args: [],
    );
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'ar'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
