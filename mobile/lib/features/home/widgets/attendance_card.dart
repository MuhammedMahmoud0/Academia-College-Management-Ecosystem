import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

class AttendanceCard extends StatelessWidget {
  final bool isDark;
  final VoidCallback onCardTap;
  final VoidCallback onScanQrTap;
  final bool isScanPressed;

  const AttendanceCard({
    super.key,
    required this.isDark,
    required this.onCardTap,
    required this.onScanQrTap,
    required this.isScanPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryColor,
            AppColors.primaryColor.withValues(alpha: 0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onCardTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.fact_check_outlined,
                    color: Colors.white,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        S.of(context).attendance,
                        style: AppTextStyles.heading3.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        S.of(context).viewAttendanceHistory,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: Colors.white.withValues(alpha: 0.85),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                _buildScanButton(context, isScanPressed),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScanButton(BuildContext context, bool isScanPressed) {
    return GestureDetector(
      onTap: onScanQrTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: isScanPressed
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: AppColors.primaryColor,
                  strokeWidth: 2.5,
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.qr_code_scanner_rounded,
                    color: AppColors.primaryColor,
                    size: 22,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    S.of(context).scanQr,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
