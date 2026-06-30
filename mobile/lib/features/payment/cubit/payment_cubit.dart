import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/payment/cubit/payment_states.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';
import 'package:college_project/features/payment/repo/payment_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PaymentCubit extends Cubit<PaymentStates> {
  PaymentCubit() : super(PaymentInitialState());

  static PaymentCubit get(BuildContext context) => BlocProvider.of(context);

  final PaymentRepo _repo = PaymentRepo();
  InvoicesResponseModel? _data;

  InvoicesResponseModel? get data => _data;

  Future<void> getInvoices() async {
    emit(PaymentLoadingState());
    try {
      _data = await _repo.getInvoices();
      emit(PaymentLoadedState(data: _data!));
    } on ApiException catch (e) {
      debugPrint('Get invoices failed: $e');
      emit(PaymentErrorState(error: e.message));
    } catch (e) {
      debugPrint('Get invoices failed: $e');
      emit(PaymentErrorState(error: 'Failed to load invoices'));
    }
  }

  Future<void> refreshInvoices() async {
    if (_data == null) return getInvoices();

    emit(PaymentRefreshingState(data: _data!));
    try {
      _data = await _repo.getInvoices();
      emit(PaymentLoadedState(data: _data!));
    } on ApiException catch (e) {
      debugPrint('Refresh invoices failed: $e');
      emit(PaymentErrorState(error: e.message));
    } catch (e) {
      debugPrint('Refresh invoices failed: $e');
      emit(PaymentErrorState(error: 'Failed to refresh invoices'));
    }
  }

  Future<void> payOutstandingBalance() async {
    if (_data == null) return;

    emit(PaymentCheckoutLoadingState(data: _data!));
    try {
      final result = await _repo.createPaymobOrder();
      debugPrint('Paymob order: $result');
      final iframeUrl = result['iframeUrl']?.toString() ?? '';
      final message =
          result['message']?.toString() ?? 'Payment session created';
      emit(
        PaymentCheckoutSuccessState(
          data: _data!,
          message: message,
          iframeUrl: iframeUrl,
        ),
      );
    } on ApiException catch (e) {
      debugPrint('Create paymob order failed: $e');
      emit(PaymentCheckoutErrorState(data: _data!, error: e.message));
    } catch (e) {
      debugPrint('Create paymob order failed: $e');
      emit(
        PaymentCheckoutErrorState(
          data: _data!,
          error: 'Failed to start payment',
        ),
      );
    }
  }
}
