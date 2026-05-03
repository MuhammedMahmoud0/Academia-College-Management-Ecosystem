import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/features/auth/login/cubit/auth_cubit.dart';
import 'package:college_project/features/auth/login/cubit/auth_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final _secureStorage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    _checkTokenAndNavigate();
  }

  Future<void> _checkTokenAndNavigate() async {
    // Small delay for splash screen visibility
    await Future.delayed(const Duration(seconds: 2));

    final token = await _secureStorage.read(key: 'token');
    final expirationTimeStr = await _secureStorage.read(key: 'expirationTime');

    // Case 1: Token is null or expiration time not set → go to login
    if (token == null || token.isEmpty || expirationTimeStr == null) {
      debugPrint('Token is null or expiration time not set');
      _navigateToLogin();
      return;
    }

    // Case 2: Token expired → go to login
    try {
      final expirationTime = DateTime.parse(expirationTimeStr);
      if (DateTime.now().isAfter(expirationTime)) {
        debugPrint('Token expired');
        _navigateToLogin();
        return;
      }
    } catch (e) {
      debugPrint('Invalid date format');
      // Invalid date format → go to login
      _navigateToLogin();
      return;
    }

    // Case 3: Token exists and not expired → try to get profile data
    if (mounted) {
      debugPrint('try login');
      context.read<AuthCubit>().tryAutoLogin();
    }
  }

  void _navigateToLogin() {
    if (mounted) {
      context.pushReplacement(AppRoutes.loginScreen);
    }
  }

  void _navigateToHome() {
    if (mounted) {
      context.pushReplacement(AppRoutes.homeScreen);
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state is AuthSuccess) {
          // Profile fetched successfully → go to home
          debugPrint('Profile fetched successfully');
          _navigateToHome();
        } else if (state is AuthTokenExpired) {
          // Token invalid and couldn't refresh → go to login
          debugPrint('Token expired');
          _navigateToLogin();
        } else if (state is AuthError) {
          // Other errors → go to login
          debugPrint('Other errors ${state.message}');
          _navigateToLogin();
        }
      },
      child: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Welcome to Graduation Project',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              Container(color: Colors.red),
              const SizedBox(height: 20),
              const CircularProgressIndicator(),
            ],
          ),
        ),
      ),
    );
  }
}
