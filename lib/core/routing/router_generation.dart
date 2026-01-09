import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/features/auth/login_screen.dart';
import 'package:college_project/features/leaderboard/leaderboard_screen.dart';
import 'package:college_project/features/material/material_screen.dart';
import 'package:college_project/features/notifications/notification_screen.dart';
import 'package:college_project/features/splash/splash_screen.dart';
import 'package:college_project/features/student_id/student_id_screen.dart';
import 'package:college_project/layout/home_layout.dart';
import 'package:go_router/go_router.dart';

class RouterGenerationConfig {
  static GoRouter goRouter = GoRouter(
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
        builder: (context, state) => const StudentIdScreen(),
      ),
      GoRoute(
        path: AppRoutes.leaderboard,
        name: AppRoutes.leaderboard,
        builder: (context, state) => const LeaderboardScreen(),
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
    ],
  );
}
