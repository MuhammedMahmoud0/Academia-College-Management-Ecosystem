import 'package:college_project/features/student_id/cubit/student_id_states.dart';
import 'package:college_project/features/student_id/models/student_id_back_model.dart';
import 'package:college_project/features/student_id/models/student_id_front_model.dart';
import 'package:college_project/features/student_id/repo/student_id_repo.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class StudentIdCubit extends Cubit<StudentIdStates> {
  final StudentIdRepo _repo;

  StudentIdCubit(this._repo) : super(StudentIdInitial());

  Future<void> fetchStudentId() async {
    emit(StudentIdLoading());
    try {
      final List<dynamic> results = await Future.wait([
        _repo.getStudentIdFront(),
        _repo.getStudentIdBack(),
      ]);
      emit(
        StudentIdLoaded(
          front: results[0] as StudentIdFrontModel,
          back: results[1] as StudentIdBackModel,
        ),
      );
    } catch (e) {
      emit(StudentIdError(e.toString()));
    }
  }
}
