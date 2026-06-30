import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/auth/change_password/cubit/change_password_state.dart';
import 'package:college_project/features/auth/change_password/repo/change_pass_repo.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChangePasswordCubit extends Cubit<ChangePasswordState> {
  final ChangePassRepo _repo;

  ChangePasswordCubit(this._repo) : super(ChangePasswordInitial());

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    emit(ChangePasswordLoading());
    try {
      await _repo.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
      emit(ChangePasswordSuccess());
    } on ApiException catch (e) {
      emit(ChangePasswordFailure(error: e.message));
    }
  }
}
