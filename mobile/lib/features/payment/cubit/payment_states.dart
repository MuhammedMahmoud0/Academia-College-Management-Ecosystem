import 'package:college_project/features/payment/models/invoice_model.dart';

abstract class PaymentStates {}

class PaymentInitialState extends PaymentStates {}

class PaymentLoadingState extends PaymentStates {}

class PaymentLoadedState extends PaymentStates {
  final InvoicesResponseModel data;

  PaymentLoadedState({required this.data});
}

class PaymentRefreshingState extends PaymentStates {
  final InvoicesResponseModel data;

  PaymentRefreshingState({required this.data});
}

class PaymentErrorState extends PaymentStates {
  final String error;

  PaymentErrorState({required this.error});
}

class PaymentCheckoutLoadingState extends PaymentStates {
  final InvoicesResponseModel data;

  PaymentCheckoutLoadingState({required this.data});
}

class PaymentCheckoutSuccessState extends PaymentStates {
  final InvoicesResponseModel data;
  final String message;
  final String iframeUrl;

  PaymentCheckoutSuccessState({
    required this.data,
    required this.message,
    required this.iframeUrl,
  });
}

class PaymentCheckoutErrorState extends PaymentStates {
  final InvoicesResponseModel data;
  final String error;

  PaymentCheckoutErrorState({required this.data, required this.error});
}
