import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/services/local_auth_service.dart';
import 'package:college_project/features/auth/login/cubit/auth_cubit.dart';
import 'package:college_project/features/auth/login/cubit/auth_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  static const Color _bgTop = Color(0xFF02061B);
  static const Color _bgMid = Color(0xFF15184A);
  static const Color _accent = Color(0xFF4B4EFC);

  final _secureStorage = const FlutterSecureStorage();

  late final AnimationController _controller;
  late final Animation<double> _fade;
  late final Animation<double> _scale;

  // True when the device prompt was shown but the user has not yet passed it,
  // so we can render an "unlock" button instead of an endless spinner.
  bool _locked = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    );
    _fade = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _scale = Tween<double>(
      begin: 0.7,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));
    _controller.forward();
    _checkTokenAndNavigate();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
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

    // Case 3: Valid session → require local authentication before restoring it.
    final authenticated = await _authenticate();
    if (!authenticated) return;

    if (mounted) {
      debugPrint('try login');
      context.read<AuthCubit>().tryAutoLogin();
    }
  }

  /// Prompts for biometrics / device credential. On failure we surface an
  /// "unlock" button (via [_locked]) so the user can retry instead of being
  /// stuck on the splash forever.
  Future<bool> _authenticate() async {
    final ok = await LocalAuthService.instance.authenticate(
      reason: 'Authenticate to access your account',
    );
    if (!ok && mounted) {
      setState(() => _locked = true);
    }
    return ok;
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
          debugPrint('Profile fetched successfully');
          _navigateToHome();
        } else if (state is AuthTokenExpired) {
          debugPrint('Token expiredd');
          _navigateToLogin();
        } else if (state is AuthError) {
          debugPrint('Other errors ${state.message}');
          _navigateToLogin();
        }
      },
      child: Scaffold(
        body: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [_bgTop, _bgMid, _accent],
              stops: [0.0, 0.55, 1.0],
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                const Spacer(flex: 3),
                FadeTransition(
                  opacity: _fade,
                  child: ScaleTransition(
                    scale: _scale,
                    child: _buildBranding(),
                  ),
                ),
                const Spacer(flex: 3),
                _buildFooter(),
                SizedBox(height: 48.h),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBranding() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: EdgeInsets.all(24.r),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.08),
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.15),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: _accent.withValues(alpha: 0.45),
                blurRadius: 40,
                spreadRadius: 4,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22.r),
            child: Image.asset(
              'assets/logo.png',
              width: 96.r,
              height: 96.r,
              fit: BoxFit.contain,
            ),
          ),
        ),
        SizedBox(height: 28.h),
        Text(
          'Academia',
          style: TextStyle(
            fontSize: 34.sp,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 1.2,
          ),
        ),
        SizedBox(height: 8.h),
        Text(
          'Your campus, in your pocket',
          style: TextStyle(
            fontSize: 14.sp,
            color: Colors.white.withValues(alpha: 0.65),
            letterSpacing: 0.4,
          ),
        ),
      ],
    );
  }

  Widget _buildFooter() {
    if (_locked) {
      return Padding(
        padding: EdgeInsets.symmetric(horizontal: 40.w),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.lock_outline_rounded,
              color: Colors.white.withValues(alpha: 0.8),
              size: 28.r,
            ),
            SizedBox(height: 12.h),
            Text(
              'App locked',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.85),
                fontSize: 15.sp,
                fontWeight: FontWeight.w600,
              ),
            ),
            SizedBox(height: 16.h),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  final cubit = context.read<AuthCubit>();
                  setState(() => _locked = false);
                  final ok = await _authenticate();
                  if (ok) cubit.tryAutoLogin();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: _accent,
                  padding: EdgeInsets.symmetric(vertical: 14.h),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                  elevation: 0,
                ),
                icon: const Icon(Icons.fingerprint_rounded),
                label: Text(
                  'Unlock',
                  style: TextStyle(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return SizedBox(
      width: 30.r,
      height: 30.r,
      child: CircularProgressIndicator(
        strokeWidth: 2.6,
        valueColor: AlwaysStoppedAnimation<Color>(
          Colors.white.withValues(alpha: 0.85),
        ),
      ),
    );
  }
}
