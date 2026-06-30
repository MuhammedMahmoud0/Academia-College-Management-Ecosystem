class EditProfileState {}

class EditProfileInitial extends EditProfileState {}

class EditProfileLoading extends EditProfileState {}

class EditProfileSuccess extends EditProfileState {
  final String message;

  EditProfileSuccess(this.message);
}

class EditProfileError extends EditProfileState {
  final String message;

  EditProfileError(this.message);
}

class ImagePickedState extends EditProfileState {
  final String imagePath;

  ImagePickedState(this.imagePath);
}
