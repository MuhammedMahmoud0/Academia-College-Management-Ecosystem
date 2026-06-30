import 'package:college_project/features/notifications/cubit/notification_cubit.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/utils/notification_type_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';

class NotificationDetailScreen extends StatelessWidget {
  final NotificationModel notification;

  const NotificationDetailScreen({Key? key, required this.notification})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    final typeColor = NotificationTypeHelper.color(notification.type);
    final typeIcon = NotificationTypeHelper.icon(notification.type);
    final typeTitle = NotificationTypeHelper.title(notification.type);

    return Scaffold(
      backgroundColor: typeColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
            size: 20.sp,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Notification',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 18.sp,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            tooltip: 'Delete',
            icon: Icon(
              Icons.delete_outline_rounded,
              color: Colors.white,
              size: 22.sp,
            ),
            onPressed: () => _confirmDelete(context),
          ),
          SizedBox(width: 6.w),
        ],
      ),
      body: Column(
        children: [
          // ── Coloured header ──────────────────────────────────────────────
          Padding(
            padding: EdgeInsets.fromLTRB(24.w, 8.h, 24.w, 24.h),
            child: Row(
              children: [
                Container(
                  padding: EdgeInsets.all(14.w),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(typeIcon, color: Colors.white, size: 28.sp),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        typeTitle,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 17.sp,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4.h),
                      Text(
                        DateFormat(
                          'MMM d, yyyy • h:mm a',
                        ).format(notification.createdAt),
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.75),
                          fontSize: 12.sp,
                        ),
                      ),
                    ],
                  ),
                ),
                if (!notification.isRead)
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: 10.w,
                      vertical: 4.h,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20.r),
                    ),
                    child: Text(
                      'Unread',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11.sp,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // ── Body ────────────────────────────────────────────────────────
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(24.w, 28.h, 24.w, 32.h),
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'MESSAGE',
                      style: TextStyle(
                        fontSize: 11.sp,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(
                          context,
                        ).colorScheme.onSurface.withOpacity(0.45),
                        letterSpacing: 1.4,
                      ),
                    ),
                    SizedBox(height: 12.h),

                    Text(
                      notification.message,
                      style: TextStyle(
                        fontSize: 15.sp,
                        color: Theme.of(context).colorScheme.onSurface,
                        height: 1.75,
                      ),
                    ),

                    SizedBox(height: 32.h),
                    Divider(color: Theme.of(context).dividerColor),
                    SizedBox(height: 24.h),

                    _MetaRow(
                      icon: Icons.category_outlined,
                      label: 'Type',
                      value: typeTitle,
                      color: typeColor,
                    ),
                    SizedBox(height: 16.h),

                    _MetaRow(
                      icon: notification.isRead
                          ? Icons.mark_email_read_outlined
                          : Icons.mark_email_unread_outlined,
                      label: 'Status',
                      value: notification.isRead ? 'Read' : 'Unread',
                      color: typeColor,
                    ),

                    SizedBox(height: 40.h),

                    SizedBox(
                      width: double.infinity,
                      height: 52.h,
                      child: OutlinedButton.icon(
                        onPressed: () => _confirmDelete(context),
                        icon: Icon(
                          Icons.delete_outline_rounded,
                          color: Colors.red.shade400,
                          size: 20.sp,
                        ),
                        label: Text(
                          'Delete Notification',
                          style: TextStyle(
                            color: Colors.red.shade400,
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.red.shade200),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14.r),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.r)),
      ),
      builder: (sheetContext) => Padding(
        padding: EdgeInsets.fromLTRB(24.w, 20.h, 24.w, 36.h),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40.w,
              height: 4.h,
              decoration: BoxDecoration(
                color: Theme.of(context).dividerColor,
                borderRadius: BorderRadius.circular(2.r),
              ),
            ),
            SizedBox(height: 20.h),
            Icon(
              Icons.delete_outline_rounded,
              color: Colors.red.shade300,
              size: 44.sp,
            ),
            SizedBox(height: 12.h),
            Text(
              'Delete Notification?',
              style: TextStyle(
                fontSize: 17.sp,
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            SizedBox(height: 8.h),
            Text(
              'This action cannot be undone.',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
                fontSize: 13.sp,
              ),
            ),
            SizedBox(height: 28.h),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(sheetContext),
                    style: OutlinedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 14.h),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                    ),
                    child: Text('Cancel', style: TextStyle(fontSize: 14.sp)),
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(sheetContext);
                      context.read<NotificationsCubit>().deleteNotification(
                        notification.id,
                      );
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade400,
                      padding: EdgeInsets.symmetric(vertical: 14.h),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                    ),
                    child: Text(
                      'Delete',
                      style: TextStyle(
                        fontSize: 14.sp,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Reusable meta info row ───────────────────────────────────────────────────
class _MetaRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _MetaRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: EdgeInsets.all(8.w),
          decoration: BoxDecoration(
            color: color.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10.r),
          ),
          child: Icon(icon, color: color, size: 18.sp),
        ),
        SizedBox(width: 14.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11.sp,
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurface.withOpacity(0.45),
                ),
              ),
              SizedBox(height: 3.h),
              Text(
                value,
                style: TextStyle(
                  fontSize: 13.sp,
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
