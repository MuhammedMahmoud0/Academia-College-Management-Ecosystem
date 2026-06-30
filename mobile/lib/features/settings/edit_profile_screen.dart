import 'dart:io';

import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/utils/components.dart';
import 'package:college_project/core/widgets/widgets.dart';
import 'package:college_project/features/settings/cubit/edit_profile_cubit.dart';
import 'package:college_project/features/settings/cubit/edit_profile_states.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _addressController;
  late final TextEditingController _nationalIdController;

  @override
  void initState() {
    super.initState();
    final student = Constants.student;
    _nameController = TextEditingController(text: student?.name ?? '');
    _phoneController = TextEditingController(text: student?.phone ?? '');
    _addressController = TextEditingController(text: student?.address ?? '');
    _nationalIdController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _nationalIdController.dispose();
    super.dispose();
  }

  void _showImageSourceDialog(BuildContext context, EditProfileCubit cubit) {
    final isDark = context.read<AppCubit>().isDarkMode;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.getCardBackground(isDark),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                S.of(context).chooseImageSource,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextColor(isDark),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildImageSourceOption(
                    context: context,
                    icon: Icons.camera_alt_rounded,
                    label: S.of(context).camera,
                    onTap: () {
                      Navigator.pop(context);
                      cubit.pickImage(ImageSource.camera);
                    },
                    isDark: isDark,
                  ),
                  _buildImageSourceOption(
                    context: context,
                    icon: Icons.photo_library_rounded,
                    label: S.of(context).gallery,
                    onTap: () {
                      Navigator.pop(context);
                      cubit.pickImage(ImageSource.gallery);
                    },
                    isDark: isDark,
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImageSourceOption({
    required BuildContext context,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        decoration: BoxDecoration(
          color: AppColors.primaryColor.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, size: 40, color: AppColors.primaryColor),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.getTextColor(isDark),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;
    final student = Constants.student;

    return BlocProvider(
      create: (context) => EditProfileCubit(),
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: AppColors.primaryColor,
          foregroundColor: Colors.white,
          title: Text(S.of(context).editProfile),
          centerTitle: true,
          elevation: 0,
        ),
        body: BlocConsumer<EditProfileCubit, EditProfileState>(
          listener: (context, state) {
            if (state is EditProfileSuccess) {
              Components.showSnackBar(
                context,
                state.message,
                SnackBarType.success,
              );
              // Notify AppCubit to trigger profile screen rebuild
              context.read<AppCubit>().notifyProfileUpdated();
              context.pop();
            } else if (state is EditProfileError) {
              Components.showSnackBar(
                context,
                state.message,
                SnackBarType.error,
              );
            }
          },
          builder: (context, state) {
            final cubit = context.read<EditProfileCubit>();
            final isLoading = state is EditProfileLoading;

            return SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Profile Image Section
                    Center(
                      child: Stack(
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.primaryColor,
                                width: 3,
                              ),
                            ),
                            child: ClipOval(
                              child: state is ImagePickedState
                                  ? Image.file(
                                      File(state.imagePath),
                                      fit: BoxFit.cover,
                                      width: 120,
                                      height: 120,
                                    )
                                  : cubit.selectedImage != null
                                  ? Image.file(
                                      cubit.selectedImage!,
                                      fit: BoxFit.cover,
                                      width: 120,
                                      height: 120,
                                    )
                                  : Widgets.defaultImage(
                                      student?.avatarUrl ?? '',
                                      width: 120,
                                      height: 120,
                                    ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: GestureDetector(
                              onTap: () =>
                                  _showImageSourceDialog(context, cubit),
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.primaryColor,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.getCardBackground(isDark),
                                    width: 3,
                                  ),
                                ),
                                child: const Icon(
                                  Icons.camera_alt_rounded,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Form Fields
                    Widgets.buildTextField(
                      controller: _nameController,
                      label: S.of(context).fullName,
                      icon: Icons.person_outline_rounded,
                      isDark: isDark,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return S.of(context).pleaseEnterName;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    Widgets.buildTextField(
                      controller: _phoneController,
                      label: S.of(context).phone,
                      icon: Icons.phone_outlined,
                      isDark: isDark,
                      keyboardType: TextInputType.phone,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return S.of(context).pleaseEnterPhone;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    Widgets.buildTextField(
                      controller: _addressController,
                      label: S.of(context).address,
                      icon: Icons.location_on_outlined,
                      isDark: isDark,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return S.of(context).pleaseEnterAddress;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    Widgets.buildTextField(
                      controller: _nationalIdController,
                      textInputAction: TextInputAction.done,
                      label: S.of(context).nationalId,
                      icon: Icons.badge_outlined,
                      isDark: isDark,
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return S.of(context).pleaseEnterNationalId;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 32),

                    // Save Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: isLoading
                            ? null
                            : () {
                                if (_formKey.currentState!.validate()) {
                                  FocusScope.of(context).unfocus();
                                  cubit.updateProfile(
                                    name: _nameController.text.trim(),
                                    phone: _phoneController.text.trim(),
                                    address: _addressController.text.trim(),
                                    nationalId: _nationalIdController.text
                                        .trim(),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryColor,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: AppColors.primaryColor
                              .withValues(alpha: 0.6),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: isLoading
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : Text(
                                S.of(context).saveChanges,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
