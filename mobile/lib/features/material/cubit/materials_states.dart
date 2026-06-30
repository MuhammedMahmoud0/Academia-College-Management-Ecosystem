import 'package:college_project/features/material/models/materials_response_model.dart';

abstract class MaterialsStates {}

class MaterialsInitialState extends MaterialsStates {}

class MaterialsLoadingState extends MaterialsStates {}

class MaterialsLoadedState extends MaterialsStates {
  final MaterialsResponseModel materials;

  MaterialsLoadedState({required this.materials});
}

class MaterialsErrorState extends MaterialsStates {
  final String error;

  MaterialsErrorState(this.error);
}

class MaterialsRefreshingState extends MaterialsStates {
  final MaterialsResponseModel materials;

  MaterialsRefreshingState({required this.materials});
}
