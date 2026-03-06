import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:college_project/features/leaderboard/models/leaderboard_response_model.dart';

class LeaderboardCard extends StatelessWidget {
  final LeaderboardStudent student;
  final Color primaryColor;
  final bool isCurrentUser;

  const LeaderboardCard({
    super.key,
    required this.student,
    required this.primaryColor,
    this.isCurrentUser = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
      padding: EdgeInsetsDirectional.only(end: 16.0, top: 14.h, bottom: 14.h),
      decoration: BoxDecoration(
        color: isCurrentUser
            ? primaryColor.withValues(alpha: 0.08)
            : Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: isCurrentUser
            ? Border.all(color: primaryColor.withValues(alpha: 0.3), width: 1.5)
            : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Rank Indicator
          SizedBox(width: 48.w, child: _buildRankIndicator()),

          // Avatar
          _buildAvatar(),
          SizedBox(width: 12.w),

          // Student Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name row with badge
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        student.name + (isCurrentUser ? " (You)" : ""),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14.sp,
                          color: isCurrentUser ? primaryColor : Colors.black87,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (student.badge.isNotEmpty) ...[
                      SizedBox(width: 6.w),
                      _buildBadge(),
                    ],
                  ],
                ),
                SizedBox(height: 2.h),
                // Student ID
                Text(
                  student.studentId,
                  style: TextStyle(
                    fontSize: 11.sp,
                    color: Colors.grey.shade600,
                  ),
                ),
                SizedBox(height: 4.h),
                // Department & Level
                Wrap(
                  spacing: 8.w, // مسافة أفقية
                  runSpacing: 4.h, // مسافة رأسية لو نزل سطر جديد
                  children: [
                    _buildInfoChip(
                      icon: Icons.school_outlined,
                      label: student.department,
                    ),
                    _buildInfoChip(
                      icon: Icons.layers_outlined,
                      label: 'Level ${student.level}',
                    ),
                  ],
                ),
              ],
            ),
          ),

          SizedBox(width: 8.w),

          // Score Display
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                student.score.toStringAsFixed(2),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16.sp,
                  color: primaryColor,
                ),
              ),
              Text(
                "Score",
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

  Widget _buildAvatar() {
    // Check if avatar is a URL
    final isUrl = student.avatar.startsWith('http');

    return CircleAvatar(
      radius: 22.r,
      backgroundColor: primaryColor.withValues(alpha: 0.1),
      backgroundImage: isUrl ? NetworkImage(student.avatar) : null,
      child: !isUrl
          ? Text(
              student.avatar.isNotEmpty
                  ? student.avatar[0].toUpperCase()
                  : student.name.isNotEmpty
                  ? student.name[0].toUpperCase()
                  : '?',
              style: TextStyle(
                color: primaryColor,
                fontWeight: FontWeight.bold,
                fontSize: 16.sp,
              ),
            )
          : null,
    );
  }

  Widget _buildBadge() {
    // Map badge names to icons and colors
    final badgeConfig = _getBadgeConfig(student.badge);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
      decoration: BoxDecoration(
        color: badgeConfig.color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(badgeConfig.icon, size: 12.sp, color: badgeConfig.color),
          SizedBox(width: 3.w),
          Text(
            student.badge,
            style: TextStyle(
              fontSize: 9.sp,
              fontWeight: FontWeight.w600,
              color: badgeConfig.color,
            ),
          ),
        ],
      ),
    );
  }

  _BadgeConfig _getBadgeConfig(String badge) {
    final lowerBadge = badge.toLowerCase();
    if (lowerBadge.contains('gold') || lowerBadge.contains('champion')) {
      return _BadgeConfig(Icons.workspace_premium, const Color(0xFFFFB020));
    } else if (lowerBadge.contains('silver')) {
      return _BadgeConfig(Icons.workspace_premium, const Color(0xFF9E9E9E));
    } else if (lowerBadge.contains('bronze')) {
      return _BadgeConfig(Icons.workspace_premium, const Color(0xFFCD7F32));
    } else if (lowerBadge.contains('star')) {
      return _BadgeConfig(Icons.star, const Color(0xFFFFB020));
    } else if (lowerBadge.contains('top')) {
      return _BadgeConfig(Icons.trending_up, const Color(0xFF4CAF50));
    }
    return _BadgeConfig(Icons.verified, primaryColor);
  }

  Widget _buildInfoChip({required IconData icon, required String label}) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 3.h),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(6.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11.sp, color: Colors.grey.shade600),
          SizedBox(width: 3.w),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.sp,
              color: Colors.grey.shade700,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRankIndicator() {
    Color? medalColor;
    IconData? medalIcon;

    if (student.rank == 1) {
      medalColor = const Color(0xFFFFD700);
      medalIcon = Icons.emoji_events;
    } else if (student.rank == 2) {
      medalColor = const Color(0xFFC0C0C0);
      medalIcon = Icons.emoji_events;
    } else if (student.rank == 3) {
      medalColor = const Color(0xFFCD7F32);
      medalIcon = Icons.emoji_events;
    }

    if (medalColor != null) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(medalIcon, color: medalColor, size: 22.sp),
          SizedBox(height: 2.h),
          Text(
            "#${student.rank}",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: medalColor,
              fontSize: 12.sp,
            ),
          ),
        ],
      );
    } else {
      return Container(
        width: 36.w,
        height: 36.h,
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: Text(
          "#${student.rank}",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade600,
            fontSize: 12.sp,
          ),
        ),
      );
    }
  }
}

class _BadgeConfig {
  final IconData icon;
  final Color color;

  _BadgeConfig(this.icon, this.color);
}
