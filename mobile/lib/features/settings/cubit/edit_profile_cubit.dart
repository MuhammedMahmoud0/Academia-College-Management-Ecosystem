import 'dart:io';

import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/settings/cubit/edit_profile_states.dart';
import 'package:college_project/features/settings/repo/profile_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';

class EditProfileCubit extends Cubit<EditProfileState> {
  EditProfileCubit() : super(EditProfileInitial());

  final ProfileRepo _profileRepo = ProfileRepo();
  final ImagePicker _imagePicker = ImagePicker();

  File? selectedImage;

  Future<void> pickImage(ImageSource source) async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: source,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 75,
      );

      if (image != null) {
        selectedImage = File(image.path);
        emit(ImagePickedState(image.path));
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
      emit(EditProfileError('Failed to pick image'));
    }
  }

  Future<void> updateProfile({
    required String name,
    required String phone,
    required String address,
    required String nationalId,
  }) async {
    emit(EditProfileLoading());

    try {
      final response = await _profileRepo.updateProfile(
        name: name,
        phone: phone,
        address: address,
        nationalId: nationalId,
        image: selectedImage,
      );

      debugPrint(response.toString());
      // Update the local student data
      if (Constants.student != null) {
        Constants.student = Constants.student!.copyWith(
          name: response['updatedStudent']['full_name'],
          phone: response['updatedStudent']['phone'],
          address: response['updatedStudent']['address'],
          avatarUrl: response['updatedStudent']['avatar_url'],
        );
      }

      emit(
        EditProfileSuccess(
          response['message'] ?? 'Profile updated successfully',
        ),
      );
    } on ApiException catch (e) {
      debugPrint(e.toString());
      emit(EditProfileError(e.message));
    } catch (e) {
      debugPrint(e.toString());
      emit(EditProfileError('An unexpected error occurred'));
    }
  }
}
