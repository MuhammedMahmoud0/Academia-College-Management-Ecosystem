import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:college_project/features/leaderboard/models/leaderboard_model.dart';

class LeaderboardCard extends StatelessWidget {
  final Student student;
  final Color primaryColor;
  final bool isSticky;
  final bool isCurrentUser;
  final int rank;

  const LeaderboardCard({
    Key? key,
    required this.student,
    required this.primaryColor,
    required this.rank,
    this.isSticky = false,
    this.isCurrentUser = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: isSticky
          ? EdgeInsets.zero
          : EdgeInsets.symmetric(horizontal: 20.w, vertical: 8.h),
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
      decoration: BoxDecoration(
        color: isCurrentUser && !isSticky
            ? primaryColor.withOpacity(0.05)
            : Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: isSticky
            ? []
            : [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
      ),
      child: Row(
        children: [
          // Medal and Rank Indicator
          SizedBox(width: 45.w, child: _buildRankIndicator()),

          // Avatar
          CircleAvatar(
            radius: 18.r,
            backgroundColor: primaryColor.withOpacity(0.1),
            child: Text(
              student.avatar,
              style: TextStyle(
                color: primaryColor,
                fontWeight: FontWeight.bold,
                fontSize: 14.sp,
              ),
            ),
          ),
          SizedBox(width: 12.w),

          // Name and ID
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  student.name + (isCurrentUser ? " (You)" : ""),
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14.sp,
                    color: isCurrentUser ? primaryColor : Colors.black87,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  student.id,
                  style: TextStyle(
                    fontSize: 11.sp,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),

          // GPA Display
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                student.gpa.toStringAsFixed(2),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15.sp,
                  color: primaryColor,
                ),
              ),
              Text(
                "GPA",
                style: TextStyle(
                  fontSize: 10.sp,
                  color: Colors.grey.shade400,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRankIndicator() {
    Color? medalColor;
    if (rank == 1) {
      medalColor = const Color(0xFFFFD700);
    } else if (rank == 2) {
      medalColor = const Color(0xFFC0C0C0);
    } else if (rank == 3) {
      medalColor = const Color(0xFFCD7F32);
    }

    if (medalColor != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            "$rank",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: medalColor,
              fontSize: 14.sp,
            ),
          ),
          SizedBox(width: 2.w),
          Icon(Icons.emoji_events, color: medalColor, size: 18.sp),
        ],
      );
    } else {
      return Text(
        "$rank",
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.grey.shade400,
          fontSize: 14.sp,
        ),
      );
    }
  }
}
