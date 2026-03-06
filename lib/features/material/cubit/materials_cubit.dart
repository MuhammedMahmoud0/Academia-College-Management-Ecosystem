import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/material/cubit/materials_states.dart';
import 'package:college_project/features/material/models/materials_response_model.dart';
import 'package:college_project/features/material/repo/materials_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MaterialsCubit extends Cubit<MaterialsStates> {
  MaterialsCubit() : super(MaterialsInitialState());

  static MaterialsCubit get(BuildContext context) => BlocProvider.of(context);

  final MaterialsRepo _materialsRepo = MaterialsRepo();

  MaterialsResponseModel? materialsData;

  Future<void> getMaterials() async {
    emit(MaterialsLoadingState());
    try {
      materialsData = await _materialsRepo.getMaterials();
      emit(MaterialsLoadedState(materials: materialsData!));
    } on ApiException catch (e) {
      debugPrint('Get materials failed: $e');
      emit(MaterialsErrorState(e.message));
    } catch (e) {
      debugPrint('Get materials failed: $e');
      emit(MaterialsErrorState('Failed to load materials'));
    }
  }

  Future<void> refreshMaterials() async {
    if (materialsData == null) {
      return getMaterials();
    }

    emit(MaterialsRefreshingState(materials: materialsData!));
    try {
      materialsData = await _materialsRepo.getMaterials();
      emit(MaterialsLoadedState(materials: materialsData!));
    } on ApiException catch (e) {
      debugPrint('Refresh materials failed: $e');
      emit(MaterialsErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh materials failed: $e');
      emit(MaterialsErrorState('Failed to refresh materials'));
    }
  }

  Future<String> getDownloadMaterial({required int materialId}) async {
    var downloadMaterialModel = await _materialsRepo.getDownloadMaterial(
      materialId: materialId,
    );
    return downloadMaterialModel.downloadUrl ?? '';
  }

  /// Get all materials
  List<MaterialModel> get allMaterials {
    return materialsData?.data ?? [];
  }

  /// Get materials grouped by lecture_id
  Map<int, List<MaterialModel>> get groupedByLecture {
    return materialsData?.groupedByLecture ?? {};
  }

  /// Get file materials (PDFs)
  List<MaterialModel> get fileMaterials {
    return materialsData?.fileMaterials ?? [];
  }

  /// Get link materials
  List<MaterialModel> get linkMaterials {
    return materialsData?.linkMaterials ?? [];
  }
}
