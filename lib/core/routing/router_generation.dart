import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/features/auth/login_screen.dart';
import 'package:college_project/features/home/layout/home_layout.dart';
import 'package:college_project/features/splash/splash_screen.dart';
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
    ],
  );
}
