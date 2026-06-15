import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';
import '../models/notification_model.dart';

class NotificationItem extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback onTap;

  const NotificationItem({
    Key? key,
    required this.notification,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 16.h),
        decoration: BoxDecoration(
          color: notification.isRead
              ? Colors.transparent
              : const Color(0xFF6C63FF).withOpacity(0.05),
          border: Border(
            bottom: BorderSide(color: Colors.grey.shade200, width: 1),
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLeadingIcon(),
            SizedBox(width: 16.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _buildTitle(),
                    style: TextStyle(
                      fontSize: 15.sp,
                      fontWeight: notification.isRead
                          ? FontWeight.w500
                          : FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    notification.message,
                    style: TextStyle(
                      fontSize: 13.sp,
                      color: Colors.grey.shade600,
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            SizedBox(width: 8.w),
            // Right-side column: time + unread dot
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  _formatTimestamp(notification.createdAt),
                  style: TextStyle(
                    fontSize: 11.sp,
                    color: Colors.grey.shade500,
                  ),
                ),
                if (!notification.isRead) ...[
                  SizedBox(height: 12.h),
                  Container(
                    width: 8.w,
                    height: 8.w,
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ─── Derive a display title from the type string ──────────────────────────
  String _buildTitle() {
    switch (notification.type) {
      case 'new_grade':
        return 'Grade Posted';
      case 'reminder':
      case 'deadline':
        return 'Upcoming Deadline';
      case 'community':
        return 'Community Update';
      case 'announcement':
        return 'Announcement';
      default:
        // Fallback: capitalise and replace underscores
        return notification.type
            .replaceAll('_', ' ')
            .split(' ')
            .map(
              (w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}',
            )
            .join(' ');
    }
  }

  // ─── Leading icon based on type string ───────────────────────────────────
  Widget _buildLeadingIcon() {
    IconData icon;
    Color color;

    switch (notification.type) {
      case 'new_grade':
        icon = Icons.stars_rounded;
        color = Colors.green;
        break;
      case 'reminder':
      case 'deadline':
        icon = Icons.assignment_rounded;
        color = const Color(0xFF6C63FF);
        break;
      case 'announcement':
        icon = Icons.campaign_rounded;
        color = Colors.orange;
        break;
      case 'community':
        icon = Icons.people_rounded;
        color = Colors.teal;
        break;
      default:
        icon = Icons.notifications_active_rounded;
        color = Colors.blue;
    }

    return Container(
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 22.sp),
    );
  }

  // ─── Relative time formatter ──────────────────────────────────────────────
  String _formatTimestamp(DateTime dateTime) {
    final diff = DateTime.now().difference(dateTime);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m';
    if (diff.inHours < 24) return '${diff.inHours}h';
    return DateFormat('MMM d').format(dateTime);
  }
}
