import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';
import 'package:flutter/material.dart';

class InvoiceCard extends StatelessWidget {
  final InvoiceModel invoice;
  final bool isDark;

  const InvoiceCard({super.key, required this.invoice, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(invoice.status);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.getBorderColor(isDark), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    invoice.courseCode,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.primaryColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const Spacer(),
                _statusBadge(invoice.status, statusColor),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: _kvRow(
                    icon: Icons.school_outlined,
                    label: 'Credit hours',
                    value: '${invoice.creditHours}',
                    isDark: isDark,
                  ),
                ),
                Expanded(
                  child: _kvRow(
                    icon: Icons.attach_money_rounded,
                    label: 'Per credit',
                    value: '${_format(invoice.creditPrice)} EGP',
                    isDark: isDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 12,
              ),
              decoration: BoxDecoration(
                color: AppColors.primaryColor.withValues(alpha: 0.06),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.receipt_long_rounded,
                    color: AppColors.primaryColor,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Total',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.getSubtitleColor(isDark),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '${_format(invoice.totalAmount)} EGP',
                    style: AppTextStyles.heading3.copyWith(
                      color: AppColors.getTextColor(isDark),
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            if (invoice.isPaid && invoice.paymentDate != null) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.successColor,
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Paid on ${_formatDate(invoice.paymentDate!)}',
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.successColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ] else if (invoice.createdAt != null) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  Icon(
                    Icons.calendar_today_rounded,
                    color: AppColors.getSubtitleColor(isDark),
                    size: 14,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Issued ${_formatDate(invoice.createdAt!)}',
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.getSubtitleColor(isDark),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _kvRow({
    required IconData icon,
    required String label,
    required String value,
    required bool isDark,
  }) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.getSubtitleColor(isDark)),
        const SizedBox(width: 6),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.getSubtitleColor(isDark),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.getTextColor(isDark),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _statusBadge(String status, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            status[0].toUpperCase() + status.substring(1).toLowerCase(),
            style: AppTextStyles.caption.copyWith(
              color: color,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'paid':
        return AppColors.successColor;
      case 'pending':
        return AppColors.warningColor;
      case 'failed':
      case 'cancelled':
        return AppColors.errorColor;
      default:
        return AppColors.infoColor;
    }
  }

  String _format(num value) {
    final str = value.toStringAsFixed(value % 1 == 0 ? 0 : 2);
    final parts = str.split('.');
    final intPart = parts[0];
    final buffer = StringBuffer();
    for (int i = 0; i < intPart.length; i++) {
      if (i != 0 && (intPart.length - i) % 3 == 0) buffer.write(',');
      buffer.write(intPart[i]);
    }
    return parts.length > 1 ? '${buffer.toString()}.${parts[1]}' : buffer.toString();
  }

  String _formatDate(DateTime date) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}
