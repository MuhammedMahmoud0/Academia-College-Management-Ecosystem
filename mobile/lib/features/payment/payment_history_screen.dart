import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/payment/cubit/payment_cubit.dart';
import 'package:college_project/features/payment/cubit/payment_states.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';
import 'package:college_project/features/payment/widgets/outstanding_balance_card.dart';
import 'package:college_project/features/payment/widgets/payment_webview_sheet.dart';
import 'package:college_project/features/payment/widgets/semester_invoices_section.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PaymentHistoryScreen extends StatelessWidget {
  const PaymentHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PaymentCubit()..getInvoices(),
      child: const _PaymentHistoryView(),
    );
  }
}

class _PaymentHistoryView extends StatelessWidget {
  const _PaymentHistoryView();

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      backgroundColor: AppColors.getBackground(isDark),
      appBar: AppBar(
        backgroundColor: AppColors.getBackground(isDark),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: AppColors.getTextColor(isDark),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Payment History',
          style: AppTextStyles.heading2.copyWith(
            color: AppColors.getTextColor(isDark),
          ),
        ),
      ),
      body: BlocConsumer<PaymentCubit, PaymentStates>(
        listener: (context, state) async {
          if (state is PaymentCheckoutSuccessState) {
            await _openCheckoutUrl(
              context,
              state.iframeUrl,
              state.message,
              isDark,
            );
            if (!context.mounted) return;
            await context.read<PaymentCubit>().refreshInvoices();
          } else if (state is PaymentCheckoutErrorState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.error),
                backgroundColor: AppColors.errorColor,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is PaymentLoadingState || state is PaymentInitialState) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primaryColor),
            );
          }

          if (state is PaymentErrorState) {
            return _errorState(context, state.error, isDark);
          }

          final data = _dataFromState(state);
          if (data == null) {
            return const SizedBox.shrink();
          }

          final isCheckoutLoading = state is PaymentCheckoutLoadingState;

          return RefreshIndicator(
            onRefresh: () => context.read<PaymentCubit>().refreshInvoices(),
            color: AppColors.primaryColor,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics(),
              ),
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
              children: [
                OutstandingBalanceCard(
                  summary: data.summary,
                  paymentPeriod: data.paymentPeriod,
                  isCheckoutLoading: isCheckoutLoading,
                  onPayPressed: () =>
                      context.read<PaymentCubit>().payOutstandingBalance(),
                ),
                const SizedBox(height: 24),
                if (data.groupedInvoices.isEmpty)
                  _emptyState(isDark)
                else ...[
                  _sectionHeader(data.groupedInvoices.length, isDark),
                  const SizedBox(height: 14),
                  ..._buildSemesterSections(data.groupedInvoices, isDark),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _sectionHeader(int total, bool isDark) {
    return Row(
      children: [
        Text(
          'Invoices by Semester',
          style: AppTextStyles.heading3.copyWith(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '$total',
            style: AppTextStyles.caption.copyWith(
              color: AppColors.primaryColor,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(child: Divider(color: AppColors.getBorderColor(isDark))),
      ],
    );
  }

  List<Widget> _buildSemesterSections(
    List<GroupedInvoiceModel> groups,
    bool isDark,
  ) {
    int? expandIndex;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].summary.pendingInvoices > 0) {
        expandIndex = i;
        break;
      }
    }
    expandIndex ??= 0;

    return [
      for (var i = 0; i < groups.length; i++)
        SemesterInvoicesSection(
          key: ValueKey('${groups[i].semester}-${groups[i].year}'),
          group: groups[i],
          isDark: isDark,
          initiallyExpanded: i == expandIndex,
        ),
    ];
  }

  Future<void> _openCheckoutUrl(
    BuildContext context,
    String iframeUrl,
    String message,
    bool isDark,
  ) async {
    if (iframeUrl.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Payment session created but checkout URL is unavailable.',
          ),
          backgroundColor: AppColors.warningColor,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    if (Uri.tryParse(iframeUrl) == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Invalid checkout URL.'),
          backgroundColor: AppColors.errorColor,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    final completed = await PaymentWebViewSheet.show(
      context,
      url: iframeUrl,
      isDark: isDark,
    );

    if (!context.mounted) return;

    if (completed == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: AppColors.successColor,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  InvoicesResponseModel? _dataFromState(PaymentStates state) {
    if (state is PaymentLoadedState) return state.data;
    if (state is PaymentRefreshingState) return state.data;
    if (state is PaymentCheckoutLoadingState) return state.data;
    if (state is PaymentCheckoutSuccessState) return state.data;
    if (state is PaymentCheckoutErrorState) return state.data;
    return null;
  }

  Widget _emptyState(bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 72,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Text(
            'No invoices yet',
            style: AppTextStyles.heading3.copyWith(
              color: AppColors.getTextColor(isDark),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Your invoices will appear here once available',
            textAlign: TextAlign.center,
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _errorState(BuildContext context, String error, bool isDark) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline_rounded,
              size: 64,
              color: AppColors.errorColor,
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load invoices',
              style: AppTextStyles.heading3.copyWith(
                color: AppColors.getTextColor(isDark),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              textAlign: TextAlign.center,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.getSubtitleColor(isDark),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.read<PaymentCubit>().getInvoices(),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
