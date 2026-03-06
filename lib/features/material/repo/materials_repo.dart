import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/material/models/download_material.dart';
import 'package:college_project/features/material/models/materials_response_model.dart';

class MaterialsRepo {
  final api = ApiClient();

  Future<MaterialsResponseModel> getMaterials() async {
    try {
      final response = await api.get(Endpoints.materials);
      return MaterialsResponseModel.fromJson(response.data as List<dynamic>);
    } on ApiException {
      rethrow;
    }
  }

  Future<DownloadMaterialModel> getDownloadMaterial({
    required int materialId,
  }) async {
    try {
      final response = await api.get(Endpoints.downloadMaterial(materialId));
      return DownloadMaterialModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
