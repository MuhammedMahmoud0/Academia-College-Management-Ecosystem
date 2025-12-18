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

  const QuickActionsRow({super.key, required this.actions});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: actions.map((action) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: actions.indexOf(action) < actions.length - 1 ? 12 : 0,
            ),
            child: _QuickActionItem(action: action),
          ),
        );
      }).toList(),
    );
  }
}

class _QuickActionItem extends StatelessWidget {
  final QuickAction action;

  const _QuickActionItem({required this.action});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: action.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.cardBackgroundColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
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
                color: action.color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(action.icon, color: action.color, size: 24),
            ),
            const SizedBox(height: 10),
            Text(
              action.label,
              style: AppTextStyles.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textColor,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
