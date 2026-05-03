import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/utils/components.dart';
import 'package:college_project/core/widgets/widgets.dart';
import 'package:college_project/features/auth/login/cubit/auth_cubit.dart';
import 'package:college_project/features/auth/login/cubit/auth_states.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthCubit(),
      child: Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header: Icon and College Name
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.school,
                            color: AppColors.primaryColor,
                            size: 32,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Academia College',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w600,
                              color: AppColors.getTextColor(
                                context.watch<AppCubit>().isDarkMode,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Welcome Text
                      Text(
                        S.of(context).welcomeBack,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w700,
                          color: AppColors.getTextColor(
                            context.watch<AppCubit>().isDarkMode,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        S.of(context).signInToContinueToYourAccount,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.getSubtitleColor(
                            context.watch<AppCubit>().isDarkMode,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Login Form Card
                      Container(
                        padding: const EdgeInsets.all(24.0),
                        decoration: BoxDecoration(
                          color: AppColors.getCardBackground(
                            context.watch<AppCubit>().isDarkMode,
                          ),
                          borderRadius: BorderRadius.circular(24.0),
                          boxShadow: [
                            BoxShadow(
                              color: context.watch<AppCubit>().isDarkMode
                                  ? Colors.black.withValues(alpha: 0.3)
                                  : Colors.black.withValues(alpha: 0.05),
                              blurRadius: 15,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Email Field
                              Text(
                                S.of(context).emailAddress,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.getTextColor(
                                    context.watch<AppCubit>().isDarkMode,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),

                              Widgets.buildTextField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                icon: Icons.email_outlined,
                                hint: 'alex@example.com',
                                isDark: context.watch<AppCubit>().isDarkMode,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return S.of(context).pleaseEnterYourEmail;
                                  }
                                  if (!value.contains('@')) {
                                    return S.of(context).pleaseEnterAValidEmail;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 20),

                              // Password Field
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    S.of(context).password,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.getTextColor(
                                        context.watch<AppCubit>().isDarkMode,
                                      ),
                                    ),
                                  ),

                                  TextButton(
                                    onPressed: () {
                                      // Handle forgot password
                                    },
                                    child: Text(
                                      S.of(context).forgotPassword,
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: AppColors.primaryColor,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Widgets.buildTextField(
                                controller: _passwordController,
                                icon: Icons.lock_outlined,
                                textInputAction: TextInputAction.done,
                                isDark: context.watch<AppCubit>().isDarkMode,
                                hint: '*******',
                                keyboardType: TextInputType.visiblePassword,
                                obscureText: _obscurePassword,
                                onSuffixPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                                suffixIcon: _obscurePassword
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return S
                                        .of(context)
                                        .pleaseEnterYourPassword;
                                  }
                                  if (value.length < 6) {
                                    return S
                                        .of(context)
                                        .passwordMustBeAtLeastSixCharacters;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 24),

                              // Login Button with BlocConsumer
                              BlocConsumer<AuthCubit, AuthState>(
                                listener: (context, state) {
                                  if (state is AuthSuccess) {
                                    Components.showSnackBar(
                                      context,
                                      S.of(context).loginSuccessfully,
                                      SnackBarType.success,
                                    );
                                    context.pushReplacement(
                                      AppRoutes.homeScreen,
                                    );
                                  } else if (state is AuthError) {
                                    Components.showSnackBar(
                                      context,
                                      state.message,
                                      SnackBarType.error,
                                    );
                                  }
                                },
                                builder: (context, state) {
                                  final isLoading = state is AuthLoading;
                                  return ElevatedButton(
                                    onPressed: isLoading
                                        ? null
                                        : () {
                                            if (_formKey.currentState!
                                                .validate()) {
                                              FocusScope.of(context).unfocus();
                                              context.read<AuthCubit>().login(
                                                email: _emailController.text
                                                    .trim(),
                                                password:
                                                    _passwordController.text,
                                              );
                                            }
                                          },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primaryColor,
                                      foregroundColor: Colors.white,
                                      disabledBackgroundColor: AppColors
                                          .primaryColor
                                          .withValues(alpha: 0.6),
                                      minimumSize: const Size(
                                        double.infinity,
                                        50,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(
                                          12.0,
                                        ),
                                      ),
                                      textStyle: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    child: isLoading
                                        ? const SizedBox(
                                            height: 24,
                                            width: 24,
                                            child: CircularProgressIndicator(
                                              color: Colors.white,
                                              strokeWidth: 2,
                                            ),
                                          )
                                        : Text(S.of(context).login),
                                  );
                                },
                              ),
                              const SizedBox(height: 24),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
