import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';

class PaymentRepo {
  final _api = ApiClient();

  Future<InvoicesResponseModel> getInvoices() async {
    try {
      final response = await _api.get(Endpoints.getInvoices);
      return InvoicesResponseModel.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on ApiException {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> createPaymobOrder() async {
    try {
      final response = await _api.post(
        Endpoints.createPaymobPayment,
        data: {'payAll': true},
      );
      return Map<String, dynamic>.from(response.data as Map);
    } on ApiException {
      rethrow;
    }
  }
}
