import 'package:college_project/features/auth/change_password/cubit/change_password_cubit.dart';
import 'package:college_project/features/auth/change_password/cubit/change_password_state.dart';
import 'package:college_project/features/auth/change_password/repo/change_pass_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ChangePasswordScreen extends StatelessWidget {
  const ChangePasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ChangePasswordCubit(ChangePassRepo()),
      child: const _ChangePasswordScreenView(),
    );
  }
}

class _ChangePasswordScreenView extends StatefulWidget {
  const _ChangePasswordScreenView();

  @override
  State<_ChangePasswordScreenView> createState() =>
      _ChangePasswordScreenViewState();
}

class _ChangePasswordScreenViewState extends State<_ChangePasswordScreenView> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscureCurrent = true;
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _submit(BuildContext context) {
    if (!_formKey.currentState!.validate()) return;
    context.read<ChangePasswordCubit>().changePassword(
      currentPassword: _currentPasswordController.text.trim(),
      newPassword: _newPasswordController.text.trim(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return BlocConsumer<ChangePasswordCubit, ChangePasswordState>(
      listener: (context, state) {
        if (state is ChangePasswordSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Password changed successfully'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context);
        } else if (state is ChangePasswordFailure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.error), backgroundColor: Colors.red),
          );
        }
      },
      builder: (context, state) {
        final isLoading = state is ChangePasswordLoading;

        return Scaffold(
          appBar: AppBar(
            title: Text(
              'Change Password',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            elevation: 0,
            backgroundColor: Colors.transparent,
            foregroundColor: colorScheme.onSurface,
          ),
          body: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 32.h),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Update your password',
                    style: TextStyle(
                      fontSize: 22.sp,
                      fontWeight: FontWeight.w800,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    'Enter your current password, then choose a new one.',
                    style: TextStyle(
                      fontSize: 14.sp,
                      color: colorScheme.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                  SizedBox(height: 40.h),

                  _PasswordField(
                    controller: _currentPasswordController,
                    label: 'Current Password',
                    obscure: _obscureCurrent,
                    onToggle: () =>
                        setState(() => _obscureCurrent = !_obscureCurrent),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your current password';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 20.h),

                  _PasswordField(
                    controller: _newPasswordController,
                    label: 'New Password',
                    obscure: _obscureNew,
                    onToggle: () => setState(() => _obscureNew = !_obscureNew),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a new password';
                      }
                      if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }
                      if (value == _currentPasswordController.text) {
                        return 'New password must differ from current password';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 20.h),

                  _PasswordField(
                    controller: _confirmPasswordController,
                    label: 'Confirm New Password',
                    obscure: _obscureConfirm,
                    onToggle: () =>
                        setState(() => _obscureConfirm = !_obscureConfirm),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please confirm your new password';
                      }
                      if (value != _newPasswordController.text) {
                        return 'Passwords do not match';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 40.h),

                  SizedBox(
                    width: double.infinity,
                    height: 52.h,
                    child: ElevatedButton(
                      onPressed: isLoading ? null : () => _submit(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4338CA),
                        disabledBackgroundColor: const Color(
                          0xFF4338CA,
                        ).withValues(alpha: 0.6),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14.r),
                        ),
                      ),
                      child: isLoading
                          ? SizedBox(
                              width: 22.w,
                              height: 22.h,
                              child: const CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2.5,
                              ),
                            )
                          : Text(
                              'Change Password',
                              style: TextStyle(
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _PasswordField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final bool obscure;
  final VoidCallback onToggle;
  final String? Function(String?) validator;

  const _PasswordField({
    required this.controller,
    required this.label,
    required this.obscure,
    required this.onToggle,
    required this.validator,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return TextFormField(
      controller: controller,
      obscureText: obscure,
      validator: validator,
      style: TextStyle(fontSize: 15.sp, color: colorScheme.onSurface),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(
          fontSize: 14.sp,
          color: colorScheme.onSurface.withValues(alpha: 0.6),
        ),
        suffixIcon: IconButton(
          icon: Icon(
            obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
            color: colorScheme.onSurface.withValues(alpha: 0.4),
            size: 20.w,
          ),
          onPressed: onToggle,
        ),
        filled: true,
        fillColor: Theme.of(context).brightness == Brightness.dark
            ? colorScheme.surfaceContainerHighest
            : Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: BorderSide(color: colorScheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: BorderSide(color: colorScheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: const BorderSide(color: Color(0xFF4338CA), width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: const BorderSide(color: Colors.red),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: const BorderSide(color: Colors.red, width: 1.5),
        ),
        contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
      ),
    );
  }
}
