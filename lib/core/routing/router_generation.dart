import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/features/auth/login_screen.dart';
import 'package:college_project/features/splash/splash_screen.dart';
import 'package:college_project/features/student_id/student_id_screen.dart';
<<<<<<< HEAD
import 'package:college_project/layout/home_layout.dart';
=======
>>>>>>> f8d29fad350b9cd6f933c21164036dc581573381
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
    ],
  );
}
