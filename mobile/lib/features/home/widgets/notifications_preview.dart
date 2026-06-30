import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:college_project/features/home/models/notification_model.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';

class NotificationsPreview extends StatelessWidget {
  final List<AppNotification> notifications;
  final VoidCallback? onTap;
  final bool isDark;

  const NotificationsPreview({
    super.key,
    required this.notifications,
    this.onTap,
    this.isDark = false,
  });

  IconData _getIcon(NotificationType type) {
    switch (type) {
      case NotificationType.grade:
        return Icons.school_rounded;
      case NotificationType.exam:
        return Icons.event_note_rounded;
      case NotificationType.registration:
        return Icons.app_registration_rounded;
      case NotificationType.announcement:
        return Icons.campaign_rounded;
      case NotificationType.payment:
        return Icons.payment_rounded;
    }
  }

  Color _getIconColor(NotificationType type) {
    switch (type) {
      case NotificationType.grade:
        return AppColors.successColor;
      case NotificationType.exam:
        return AppColors.warningColor;
      case NotificationType.registration:
        return AppColors.primaryColor;
      case NotificationType.announcement:
        return AppColors.infoColor;
      case NotificationType.payment:
        return const Color(0xFF8B5CF6);
    }
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = notifications.where((n) => !n.isRead).length;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.getCardBackground(isDark),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.getBorderColor(isDark).withValues(alpha: 0.5),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Stack(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppColors.primaryColor.withValues(alpha: 0.2)
                        : AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.notifications_rounded,
                    color: AppColors.primaryColor,
                    size: 24,
                  ),
                ),
                if (unreadCount > 0)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: AppColors.errorColor,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
                      ),
                      child: Text(
                        unreadCount.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    unreadCount > 0
                        ? S.of(context).youHaveNewNotifications(unreadCount)
                        : S.of(context).noNewNotifications,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.getTextColor(isDark),
                    ),
                  ),
                  if (notifications.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          _getIcon(notifications.first.type),
                          size: 14,
                          color: _getIconColor(notifications.first.type),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            notifications.first.title,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.getSubtitleColor(isDark),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ],
        ),
      ),
    );
  }
}
