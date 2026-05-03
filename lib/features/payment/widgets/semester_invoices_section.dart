import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/payment/models/invoice_model.dart';
import 'package:college_project/features/payment/widgets/invoice_card.dart';
import 'package:flutter/material.dart';

class SemesterInvoicesSection extends StatefulWidget {
  final GroupedInvoiceModel group;
  final bool isDark;
  final bool initiallyExpanded;

  const SemesterInvoicesSection({
    super.key,
    required this.group,
    required this.isDark,
    this.initiallyExpanded = false,
  });

  @override
  State<SemesterInvoicesSection> createState() =>
      _SemesterInvoicesSectionState();
}

class _SemesterInvoicesSectionState extends State<SemesterInvoicesSection>
    with SingleTickerProviderStateMixin {
  late bool _expanded = widget.initiallyExpanded;

  void _toggle() => setState(() => _expanded = !_expanded);

  @override
  Widget build(BuildContext context) {
    final isDark = widget.isDark;
    final group = widget.group;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.getBorderColor(isDark), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: _toggle,
              borderRadius: BorderRadius.circular(22),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 12, 16),
                child: _header(isDark, group),
              ),
            ),
            AnimatedCrossFade(
              firstChild: const SizedBox.shrink(),
              secondChild: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _summaryRow(isDark, group),
                    const SizedBox(height: 16),
                    ...group.invoices.map(
                      (invoice) =>
                          InvoiceCard(invoice: invoice, isDark: isDark),
                    ),
                  ],
                ),
              ),
              crossFadeState: _expanded
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 220),
              sizeCurve: Curves.easeInOut,
            ),
          ],
        ),
      ),
    );
  }

  Widget _header(bool isDark, GroupedInvoiceModel group) {
    final hasPending = group.summary.pendingInvoices > 0;

    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            Icons.calendar_month_rounded,
            color: AppColors.primaryColor,
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Flexible(
                    child: Text(
                      group.title,
                      style: AppTextStyles.heading3.copyWith(
                        color: AppColors.getTextColor(isDark),
                        fontWeight: FontWeight.w800,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (hasPending) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.warningColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${group.summary.pendingInvoices} pending',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.warningColor,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 4),
              Text(
                '${group.invoices.length} course${group.invoices.length == 1 ? '' : 's'} · ${_format(group.summary.totalDue)} EGP due',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.getSubtitleColor(isDark),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
        AnimatedRotation(
          turns: _expanded ? 0.5 : 0,
          duration: const Duration(milliseconds: 200),
          child: Icon(
            Icons.keyboard_arrow_down_rounded,
            color: AppColors.getSubtitleColor(isDark),
          ),
        ),
      ],
    );
  }

  Widget _summaryRow(bool isDark, GroupedInvoiceModel group) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.getBackground(isDark),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(
            child: _statColumn(
              isDark: isDark,
              label: 'Invoices',
              value: '${group.summary.totalInvoices}',
              icon: Icons.receipt_long_outlined,
              color: AppColors.infoColor,
            ),
          ),
          _divider(isDark),
          Expanded(
            child: _statColumn(
              isDark: isDark,
              label: 'Pending',
              value: '${group.summary.pendingInvoices}',
              icon: Icons.pending_actions_rounded,
              color: AppColors.warningColor,
            ),
          ),
          _divider(isDark),
          Expanded(
            child: _statColumn(
              isDark: isDark,
              label: 'Total Due',
              value: '${_format(group.summary.totalDue)} EGP',
              icon: Icons.payments_outlined,
              color: AppColors.primaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _divider(bool isDark) {
    return Container(
      width: 1,
      height: 32,
      color: AppColors.getBorderColor(isDark),
      margin: const EdgeInsets.symmetric(horizontal: 8),
    );
  }

  Widget _statColumn({
    required bool isDark,
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(height: 6),
        Text(
          value,
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.getTextColor(isDark),
            fontWeight: FontWeight.w800,
          ),
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: AppTextStyles.caption.copyWith(
            color: AppColors.getSubtitleColor(isDark),
          ),
        ),
      ],
    );
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
    return parts.length > 1
        ? '${buffer.toString()}.${parts[1]}'
        : buffer.toString();
  }
}
