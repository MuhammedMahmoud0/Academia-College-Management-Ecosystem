import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:flutter/material.dart';

class QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  const QuickAction({
    required this.label,
    required this.icon,
    required this.color,
    this.onTap,
  });
}

class QuickActionsRow extends StatelessWidget {
  final List<QuickAction> actions;
  final bool isDark;

  const QuickActionsRow({
    super.key,
    required this.actions,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: actions.map((action) {
        return Expanded(
          child: Padding(
            padding: EdgeInsetsDirectional.only(
              end: actions.indexOf(action) < actions.length - 1 ? 8 : 0,
            ),
            child: _QuickActionItem(action: action, isDark: isDark),
          ),
        );
      }).toList(),
    );
  }
}

class _QuickActionItem extends StatelessWidget {
  final QuickAction action;
  final bool isDark;

  const _QuickActionItem({required this.action, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: action.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.getCardBackground(isDark),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: action.color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(action.icon, color: action.color, size: 24),
            ),
            const SizedBox(height: 10),
            Text(
              action.label,
              style: AppTextStyles.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.getTextColor(isDark),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
