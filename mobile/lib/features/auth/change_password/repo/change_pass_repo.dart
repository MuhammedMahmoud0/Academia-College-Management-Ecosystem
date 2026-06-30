import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';

class ChangePassRepo {
  final api = ApiClient();

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      await api.put(
        Endpoints.changePassword,
        data: {'currentPassword': currentPassword, 'newPassword': newPassword},
      );
    } on ApiException {
      rethrow;
    }
  }
}
