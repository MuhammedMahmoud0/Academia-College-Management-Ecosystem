import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/widgets/notification_Item_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final Color primaryColor = const Color(0xFF6C63FF);
  final Color backgroundColor = const Color(0xFFF8F9FE);

  final List<String> _categories = [
    "All",
    "Unread",
    "Grade",
    "Deadline",
    "Community",
    "Announcement",
  ];

  int _selectedCategoryIndex = 0;
  late List<NotificationModel> _allNotifications;
  List<NotificationModel> _filteredNotifications = [];

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    _applyFilters();
  }

  void _loadInitialData() {
    final now = DateTime.now();
    _allNotifications = [
      NotificationModel(
        id: '1',
        title: 'Final Grade Posted',
        message:
            'Your grade for Data Structures has been published. Great job!',
        timestamp: now.subtract(const Duration(hours: 1)),
        type: NotificationType.grade,
        isRead: false,
      ),
      NotificationModel(
        id: '2',
        title: 'Upcoming Deadline',
        message:
            'The Mobile Dev project submission closes in 5 hours. This message is long and will now respect the spacing for the blue circle.',
        timestamp: now.subtract(const Duration(hours: 3)),
        type: NotificationType.reminder,
        isRead: false,
      ),
      NotificationModel(
        id: '3',
        title: 'New Community Post',
        message: 'Sarah posted a new question in the Algorithm Study Group.',
        timestamp: now.subtract(const Duration(days: 1, hours: 2)),
        type: NotificationType.announcement,
        isRead: true,
      ),
      NotificationModel(
        id: '4',
        title: 'Campus Announcement',
        message: 'The library will be open 24/7 during the finals week.',
        timestamp: now.subtract(const Duration(days: 3)),
        type: NotificationType.announcement,
        isRead: true,
      ),
      NotificationModel(
        id: '5',
        title: 'Math Quiz Grade',
        message: 'Check your feedback for the Linear Algebra quiz.',
        timestamp: now.subtract(const Duration(days: 1, hours: 5)),
        type: NotificationType.grade,
        isRead: false,
      ),
      NotificationModel(
        id: '6',
        title: 'Assignment Due',
        message: 'Discrete Math HW 4 is due tomorrow at 11:59 PM.',
        timestamp: now.subtract(const Duration(days: 10)),
        type: NotificationType.reminder,
        isRead: true,
      ),
    ];
  }

  void _applyFilters() {
    setState(() {
      String selectedCategory = _categories[_selectedCategoryIndex];

      if (selectedCategory == "All") {
        _filteredNotifications = _allNotifications;
      } else if (selectedCategory == "Unread") {
        _filteredNotifications = _allNotifications
            .where((n) => !n.isRead)
            .toList();
      } else {
        _filteredNotifications = _allNotifications.where((n) {
          switch (selectedCategory) {
            case "Grade":
              return n.type == NotificationType.grade;
            case "Deadline":
              return n.type == NotificationType.reminder;
            case "Community":
              return n.title.contains("Community") ||
                  n.message.contains("Study Group");
            case "Announcement":
              return n.type == NotificationType.announcement &&
                  !n.title.contains("Community");
            default:
              return true;
          }
        }).toList();
      }
      _filteredNotifications.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    });
  }

  Map<String, List<NotificationModel>> _groupNotificationsByDate() {
    final Map<String, List<NotificationModel>> groups = {};
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final startOfWeek = today.subtract(Duration(days: now.weekday - 1));

    for (var notification in _filteredNotifications) {
      final date = DateTime(
        notification.timestamp.year,
        notification.timestamp.month,
        notification.timestamp.day,
      );
      String groupKey;

      if (date == today) {
        groupKey = "Today";
      } else if (date == yesterday) {
        groupKey = "Yesterday";
      } else if (date.isAfter(startOfWeek)) {
        groupKey = "This Week";
      } else {
        groupKey = "Older";
      }

      if (!groups.containsKey(groupKey)) {
        groups[groupKey] = [];
      }
      groups[groupKey]!.add(notification);
    }
    return groups;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
            size: 20.sp,
          ),
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
          TextButton(
            onPressed: () {
              setState(() {
                _allNotifications = _allNotifications
                    .map(
                      (n) => NotificationModel(
                        id: n.id,
                        title: n.title,
                        message: n.message,
                        timestamp: n.timestamp,
                        type: n.type,
                        isRead: true,
                      ),
                    )
                    .toList();
                _applyFilters();
              });
            },
            child: Text(
              'Mark all as read',
              style: TextStyle(color: Colors.white, fontSize: 12.sp),
            ),
          ),
          SizedBox(width: 8.w),
        ],
      ),
      body: Column(
        children: [
          SizedBox(height: 8.h),
          _buildHorizontalCategoryFilter(),
          SizedBox(height: 20.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: _filteredNotifications.isEmpty
                  ? _buildEmptyState()
                  : _buildNotificationList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalCategoryFilter() {
    return SizedBox(
      height: 38.h,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        physics: const BouncingScrollPhysics(),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          bool isSelected = _selectedCategoryIndex == index;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategoryIndex = index;
                _applyFilters();
              });
            },
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
                _categories[index],
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

  Widget _buildNotificationList() {
    final groups = _groupNotificationsByDate();
    final groupKeys = ["Today", "Yesterday", "This Week", "Older"];

    return ClipRRect(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(32.r),
        topRight: Radius.circular(32.r),
      ),
      child: ListView.builder(
        itemCount: groupKeys.length,
        padding: EdgeInsets.only(top: 10.h, bottom: 20.h),
        physics: const BouncingScrollPhysics(),
        itemBuilder: (context, groupIndex) {
          final key = groupKeys[groupIndex];
          if (!groups.containsKey(key) || groups[key]!.isEmpty)
            return const SizedBox.shrink();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.only(left: 20.w, top: 16.h, bottom: 8.h),
                child: Text(
                  key,
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey.shade400,
                  ),
                ),
              ),
              ...groups[key]!
                  .map((notification) => _buildNotificationItem(notification))
                  .toList(),
            ],
          );
        },
      ),
    );
  }

  Widget _buildNotificationItem(NotificationModel notification) {
    // We removed the Stack and external padding here.
    // The NotificationItem itself should now handle the blue circle internally
    // so the grey background can span the full width correctly.
    return NotificationItem(
      notification: notification,
      onTap: () {
        setState(() {
          int mainIndex = _allNotifications.indexWhere(
            (n) => n.id == notification.id,
          );
          if (mainIndex != -1) {
            _allNotifications[mainIndex] = NotificationModel(
              id: notification.id,
              title: notification.title,
              message: notification.message,
              timestamp: notification.timestamp,
              type: notification.type,
              isRead: true,
            );
            _applyFilters();
          }
        });
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 70.sp,
            color: Colors.grey.shade300,
          ),
          SizedBox(height: 16.h),
          Text(
            "Nothing here",
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: Colors.black54,
            ),
          ),
          SizedBox(height: 4.h),
          Text(
            "No notifications for this category.",
            style: TextStyle(color: Colors.grey, fontSize: 13.sp),
          ),
        ],
      ),
    );
  }
}
