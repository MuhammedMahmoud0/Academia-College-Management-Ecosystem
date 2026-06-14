import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/features/attendance/attendance_history_screen.dart';
import 'package:college_project/features/attendance/widget/qr_scanner_screen.dart';
import 'package:college_project/features/auth/change_password/change_password_screen.dart';
import 'package:college_project/features/auth/login/login_screen.dart';
import 'package:college_project/features/community/community_screen.dart';
import 'package:college_project/features/community/groups/groups_screen.dart';
import 'package:college_project/features/leaderboard/leaderboard_screen.dart';
import 'package:college_project/features/material/material_screen.dart';
import 'package:college_project/features/material/widgets/pdf_screen.dart';
import 'package:college_project/features/notifications/notification_screen.dart';
import 'package:college_project/features/payment/payment_history_screen.dart';
import 'package:college_project/features/settings/edit_profile_screen.dart';
import 'package:college_project/features/settings/settings_screen.dart';
import 'package:college_project/features/splash/splash_screen.dart';
import 'package:college_project/features/student_id/cubit/student_id_cubit.dart';
import 'package:college_project/features/student_id/repo/student_id_repo.dart';
import 'package:college_project/features/student_id/student_id_screen.dart';
import 'package:college_project/features/student_schedule/student_schedule_screen.dart';
import 'package:college_project/features/tasks/cubit/tasks_cubit.dart';
import 'package:college_project/features/tasks/tasks_screen.dart';
import 'package:college_project/features/attendance/cubit/attendance_cubit.dart';
import 'package:college_project/layout/home_layout.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class RouterGenerationConfig {
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static GoRouter goRouter = GoRouter(
    navigatorKey: navigatorKey,
    initialLocation: AppRoutes.splashScreen,
    routes: [
      GoRoute(
        path: AppRoutes.splashScreen,
        name: AppRoutes.splashScreen,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.loginScreen,
        name: AppRoutes.loginScreen,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.homeScreen,
        name: AppRoutes.homeScreen,
        builder: (context, state) => const HomeLayout(),
      ),
      GoRoute(
        path: AppRoutes.studentIdScreen,
        name: AppRoutes.studentIdScreen,
        builder: (context, state) => BlocProvider(
          create: (context) => StudentIdCubit(StudentIdRepo(ApiClient())),
          child: const StudentIdScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.leaderboard,
        name: AppRoutes.leaderboard,
        builder: (context, state) => const LeaderboardScreen(),
      ),
      GoRoute(
        path: AppRoutes.studentSchedule,
        name: AppRoutes.studentSchedule,
        builder: (context, state) => const StudentScheduleScreen(),
      ),
      GoRoute(
        path: AppRoutes.materialsScreen,
        name: AppRoutes.materialsScreen,
        builder: (context, state) => const MaterialsScreen(),
      ),
      GoRoute(
        path: AppRoutes.notificationScreen,
        name: AppRoutes.notificationScreen,
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.settingsScreen,
        name: AppRoutes.settingsScreen,
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: AppRoutes.editProfileScreen,
        name: AppRoutes.editProfileScreen,
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.communityScreen,
        name: AppRoutes.communityScreen,
        builder: (context, state) => const CommunityScreen(),
      ),
      GoRoute(
        path: AppRoutes.groupsScreen,
        name: AppRoutes.groupsScreen,
        builder: (context, state) => const GroupsScreen(),
      ),
      GoRoute(
        path: AppRoutes.attendanceScreen,
        name: AppRoutes.attendanceScreen,
        builder: (context, state) => BlocProvider(
          create: (_) => AttendanceCubit(),
          child: const AttendanceHistoryScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.qrScannerScreen,
        name: AppRoutes.qrScannerScreen,
        builder: (context, state) => const QrScannerScreen(),
      ),
      GoRoute(
        path: AppRoutes.pdfScreenRoute,
        name: AppRoutes.pdfScreenRoute,
        builder: (context, state) =>
            PdfScreen(pdfUrl: state.extra as String? ?? ''),
      ),
      GoRoute(
        path: AppRoutes.paymentHistoryScreen,
        name: AppRoutes.paymentHistoryScreen,
        builder: (context, state) => const PaymentHistoryScreen(),
      ),
      GoRoute(
        path: AppRoutes.changePasswordScreen,
        name: AppRoutes.changePasswordScreen,
        builder: (context, state) => const ChangePasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.tasksScreen,
        name: AppRoutes.tasksScreen,
        builder: (context, state) => BlocProvider(
          create: (context) => TasksCubit(),
          child: const TasksScreen(),
        ),
      ),
    ],
  );
}
