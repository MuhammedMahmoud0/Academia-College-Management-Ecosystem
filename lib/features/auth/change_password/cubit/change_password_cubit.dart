import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/auth/change_password/cubit/change_password_state.dart';
import 'package:college_project/features/auth/change_password/repo/change_pass_repo.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ChangePasswordCubit extends Cubit<ChangePasswordState> {
  final ChangePassRepo repo = ChangePassRepo();
  final secureStorage = FlutterSecureStorage();

  ChangePasswordCubit() : super(ChangePasswordInitial());

  Future<void> changePassword({required String newPassword}) async {
    emit(ChangePasswordLoading());
    try {
      String password = await secureStorage.read(key: 'password') ?? '';
      await repo.changePassword(password, newPassword);
      emit(ChangePasswordSuccess());
    } on ApiException catch (e) {
      emit(ChangePasswordFailure(error: e.message));
    }
  }
}
