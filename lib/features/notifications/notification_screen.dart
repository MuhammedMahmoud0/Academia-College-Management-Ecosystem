import 'package:college_project/features/notifications/cubit/notification_cubit.dart';
import 'package:college_project/features/notifications/cubit/notification_states.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/notification_detail_screen.dart';
import 'package:college_project/features/notifications/widgets/notification_Item_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const _NotificationsView();
  }
}

class _NotificationsView extends StatefulWidget {
  const _NotificationsView();

  @override
  State<_NotificationsView> createState() => _NotificationsViewState();
}

class _NotificationsViewState extends State<_NotificationsView> {
  final Color primaryColor = const Color(0xFF6C63FF);

  final List<String> _categories = [
    "All",
    "Unread",
    "new_grade",
    "exam_deadline",
    "community_activity",
    "campus_announcement",
  ];

  final List<String> _categoryLabels = [
    "All",
    "Unread",
    "Grades",
    "Deadlines",
    "Community",
    "Announcements",
  ];

  int _selectedCategoryIndex = 0;
  late ScrollController _scrollController;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController()..addListener(_onScroll);
    context.read<NotificationsCubit>().fetchNotifications();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<NotificationsCubit>().loadMore();
    }
  }

  List<NotificationModel> _applyFilter(List<NotificationModel> all) {
    final cat = _categories[_selectedCategoryIndex];
    if (cat == 'All') return all;
    if (cat == 'Unread') return all.where((n) => !n.isRead).toList();
    return all.where((n) => n.type == cat).toList();
  }

  Map<String, List<NotificationModel>> _group(List<NotificationModel> items) {
    final Map<String, List<NotificationModel>> groups = {};
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final startOfWeek = today.subtract(Duration(days: now.weekday - 1));

    for (final n in items) {
      final date = DateTime(
        n.createdAt.year,
        n.createdAt.month,
        n.createdAt.day,
      );
      String key;
      if (date == today) {
        key = 'Today';
      } else if (date == yesterday) {
        key = 'Yesterday';
      } else if (date.isAfter(startOfWeek)) {
        key = 'This Week';
      } else {
        key = 'Older';
      }
      groups.putIfAbsent(key, () => []).add(n);
    }
    return groups;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryColor,
      appBar: _buildAppBar(context),
      body: Column(
        children: [
          SizedBox(height: 8.h),
          _buildCategoryFilter(),
          SizedBox(height: 20.h),
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
              child: BlocConsumer<NotificationsCubit, NotificationsState>(
                listener: (context, state) {
                  if (state is NotificationsMarkAllReadError) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(state.message),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                },
                builder: (context, state) {
                  if (state is NotificationsLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (state is NotificationsError) {
                    return _buildError(context, state.message);
                  }

                  List<NotificationModel> notifications = [];
                  bool isLoadingMore = false;
                  bool isMarkingAll = false;

                  if (state is NotificationsLoaded) {
                    notifications = state.notifications;
                  } else if (state is NotificationsLoadingMore) {
                    notifications = state.currentNotifications;
                    isLoadingMore = true;
                  } else if (state is NotificationsMarkAllReadLoading) {
                    notifications = state.currentNotifications;
                    isMarkingAll = true;
                  } else if (state is NotificationsMarkAllReadError) {
                    notifications = state.notifications;
                  }

                  final filtered = _applyFilter(notifications);

                  if (filtered.isEmpty) return _buildEmptyState(context);

                  final groups = _group(filtered);
                  const groupKeys = [
                    'Today',
                    'Yesterday',
                    'This Week',
                    'Older',
                  ];

                  return ClipRRect(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(32.r),
                      topRight: Radius.circular(32.r),
                    ),
                    child: Stack(
                      children: [
                        ListView.builder(
                          controller: _scrollController,
                          padding: EdgeInsets.only(top: 10.h, bottom: 24.h),
                          physics: const BouncingScrollPhysics(),
                          itemCount: groupKeys.length + 1,
                          itemBuilder: (context, index) {
                            if (index == groupKeys.length) {
                              return isLoadingMore
                                  ? Padding(
                                      padding: EdgeInsets.all(16.h),
                                      child: const Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                    )
                                  : const SizedBox.shrink();
                            }

                            final key = groupKeys[index];
                            final group = groups[key];
                            if (group == null || group.isEmpty) {
                              return const SizedBox.shrink();
                            }

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: EdgeInsets.only(
                                    left: 20.w,
                                    top: 16.h,
                                    bottom: 8.h,
                                  ),
                                  child: Text(
                                    key,
                                    style: TextStyle(
                                      fontSize: 14.sp,
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurface.withOpacity(0.85),
                                    ),
                                  ),
                                ),
                                ...group.map((n) => _buildItem(context, n)),
                              ],
                            );
                          },
                        ),

                        if (isMarkingAll)
                          Positioned.fill(
                            child: ColoredBox(
                              color: Theme.of(
                                context,
                              ).colorScheme.surface.withOpacity(0.6),
                              child: const Center(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      leading: IconButton(
        icon: Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20.sp),
        onPressed: () => Navigator.pop(context),
      ),
      title: Text(
        'Notifications',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 18.sp,
        ),
      ),
      actions: [
        BlocBuilder<NotificationsCubit, NotificationsState>(
          builder: (context, state) {
            final isLoading = state is NotificationsMarkAllReadLoading;
            return TextButton(
              onPressed: isLoading
                  ? null
                  : () => context.read<NotificationsCubit>().markAllAsRead(),
              child: isLoading
                  ? SizedBox(
                      width: 16.w,
                      height: 16.h,
                      child: const CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      'Mark all as read',
                      style: TextStyle(color: Colors.white, fontSize: 12.sp),
                    ),
            );
          },
        ),
        SizedBox(width: 8.w),
      ],
    );
  }

  Widget _buildCategoryFilter() {
    return SizedBox(
      height: 38.h,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        physics: const BouncingScrollPhysics(),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final isSelected = _selectedCategoryIndex == index;
          return GestureDetector(
            onTap: () => setState(() => _selectedCategoryIndex = index),
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 4.w),
              padding: EdgeInsets.symmetric(horizontal: 18.w),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20.r),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.1),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                _categoryLabels[index],
                style: TextStyle(
                  color: isSelected ? primaryColor : Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12.sp,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildItem(BuildContext context, NotificationModel notification) {
    return NotificationItem(
      notification: notification,
      onTap: () {
        final cubit = context.read<NotificationsCubit>();
        cubit.markAsRead(notification.id);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => BlocProvider.value(
              value: cubit,
              child: NotificationDetailScreen(notification: notification),
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 70.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.2),
          ),
          SizedBox(height: 16.h),
          Text(
            'Nothing here',
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
          SizedBox(height: 4.h),
          Text(
            'No notifications for this category.',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: 13.sp,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError(BuildContext context, String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 60.sp, color: Colors.red.shade200),
          SizedBox(height: 12.h),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: 14.sp,
            ),
          ),
          SizedBox(height: 16.h),
          ElevatedButton(
            onPressed: () =>
                context.read<NotificationsCubit>().fetchNotifications(),
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }
}
