import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            // Allows scrolling on smaller screens
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: 400,
              ), // Max width for the content
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
                            color: AppColors.textColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Welcome Text
                    Text(
                      'Welcome Back!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Sign in to continue to your account.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.subtitleColor,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Login Form Card
                    Container(
                      padding: const EdgeInsets.all(24.0),
                      decoration: BoxDecoration(
                        color: AppColors.cardBackgroundColor,
                        borderRadius: BorderRadius.circular(24.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Email Field
                          Text(
                            'Email Address',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textColor,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextFormField(
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              hintText: 'you@example.com',
                              prefixIcon: const Icon(
                                Icons.email_outlined,
                                color: AppColors.subtitleColor,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.borderColor,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.borderColor,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.primaryColor,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Password Field
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Password',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textColor,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // Handle forgot password
                                },
                                child: Text(
                                  'Forgot password?',
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
                          TextFormField(
                            obscureText: true,
                            decoration: InputDecoration(
                              hintText: '••••••••',
                              prefixIcon: const Icon(
                                Icons.lock_outline,
                                color: AppColors.subtitleColor,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.borderColor,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.borderColor,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: AppColors.primaryColor,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Login Button
                          ElevatedButton(
                            onPressed: () {
                              // Handle login
                              context.pushReplacement(AppRoutes.homeScreen);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryColor,
                              foregroundColor: Colors.white,
                              minimumSize: const Size(
                                double.infinity,
                                50,
                              ), // Full width
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              textStyle: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            child: const Text('Login'),
                          ),
                          const SizedBox(height: 24),
                          /*
                          // "OR" Divider
                          Row(
                            children: [
                              const Expanded(child: Divider(color: borderColor)),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                                child: Text(
                                  'OR',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: subtitleColor,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              const Expanded(child: Divider(color: borderColor)),
                            ],
                          ),
                        
                          const SizedBox(height: 24),

                          // Continue with Google Button
                          OutlinedButton.icon(
                            onPressed: () {
                              // Handle Google sign-in
                            },
                            icon: Image.network(
                              'https://img.icons8.com/color/48/000000/google-logo.png', // Simple Google logo PNG
                              height: 24.0,
                              width: 24.0,
                            ),
                            label: Text(
                              'Continue with Google',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: textColor,
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              minimumSize: const Size(double.infinity, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              side: const BorderSide(color: borderColor),
                            ),
                          ),
                      */
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    /*
                    // Back to Home Link
                    TextButton.icon(
                      onPressed: () {
                        // Handle back to home
                      },
                      icon: const Icon(Icons.arrow_back, size: 16, color: subtitleColor),
                      label: Text(
                        'Back to Home',
                        style: TextStyle(
                          fontSize: 14,
                          color: subtitleColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                 */
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
