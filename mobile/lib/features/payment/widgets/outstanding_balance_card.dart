import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';
import 'package:flutter/material.dart';

class OutstandingBalanceCard extends StatelessWidget {
  final InvoicesSummary summary;
  final BillingPeriod paymentPeriod;
  final bool isCheckoutLoading;
  final VoidCallback onPayPressed;

  const OutstandingBalanceCard({
    super.key,
    required this.summary,
    required this.paymentPeriod,
    required this.isCheckoutLoading,
    required this.onPayPressed,
  });

  @override
  Widget build(BuildContext context) {
    final canPay =
        paymentPeriod.isOpen && summary.totalDue > 0 && !isCheckoutLoading;

    final hasBalance = summary.totalDue > 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: hasBalance
              ? [
                  AppColors.primaryColor,
                  AppColors.primaryColor.withValues(alpha: 0.85),
                ]
              : const [Color(0xFF0F9D58), Color(0xFF34D399)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color:
                (hasBalance ? AppColors.primaryColor : const Color(0xFF0F9D58))
                    .withValues(alpha: 0.35),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.account_balance_wallet_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Total Outstanding Balance',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: Colors.white.withValues(alpha: 0.9),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                _formatAmount(summary.totalDue),
                style: const TextStyle(
                  fontFamily: AppTextStyles.fontFamily,
                  color: Colors.white,
                  fontSize: 38,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(width: 6),
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(
                  'EGP',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _miniStat(
                icon: Icons.receipt_long_rounded,
                label: '${summary.totalInvoices} invoices',
              ),
              const SizedBox(width: 10),
              _miniStat(
                icon: Icons.pending_actions_rounded,
                label: '${summary.pendingInvoices} pending',
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: canPay ? onPayPressed : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                disabledBackgroundColor: Colors.white.withValues(alpha: 0.5),
                foregroundColor: hasBalance
                    ? AppColors.primaryColor
                    : const Color(0xFF0F9D58),
                disabledForegroundColor: hasBalance
                    ? AppColors.primaryColor.withValues(alpha: 0.6)
                    : const Color(0xFF0F9D58).withValues(alpha: 0.6),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: 0,
              ),
              child: isCheckoutLoading
                  ? SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: hasBalance
                            ? AppColors.primaryColor
                            : const Color(0xFF0F9D58),
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          hasBalance
                              ? Icons.payments_rounded
                              : Icons.check_circle_rounded,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          !hasBalance
                              ? 'All Paid'
                              : paymentPeriod.isOpen
                              ? 'Complete Your Payment'
                              : 'Payment Window Closed',
                          style: AppTextStyles.button.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          if (hasBalance && !paymentPeriod.isOpen) ...[
            const SizedBox(height: 10),
            Text(
              paymentPeriod.nextOpenDate != null
                  ? 'Opens again on ${paymentPeriod.nextOpenDate}'
                  : 'Payment period is currently closed',
              textAlign: TextAlign.center,
              style: AppTextStyles.caption.copyWith(
                color: Colors.white.withValues(alpha: 0.85),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _miniStat({required IconData icon, required String label}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 14),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatAmount(num value) {
    final str = value.toStringAsFixed(value is int || value % 1 == 0 ? 0 : 2);
    final parts = str.split('.');
    final intPart = parts[0];
    final buffer = StringBuffer();
    for (int i = 0; i < intPart.length; i++) {
      if (i != 0 && (intPart.length - i) % 3 == 0) buffer.write(',');
      buffer.write(intPart[i]);
    }
    return parts.length > 1
        ? '${buffer.toString()}.${parts[1]}'
        : buffer.toString();
  }
}
