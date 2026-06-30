import 'package:cached_network_image/cached_network_image.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/groups/cubit/groups_cubit.dart';
import 'package:college_project/features/community/groups/models/groups_response_model.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class GroupDetailsSheet extends StatelessWidget {
  final GroupModel group;
  final GroupsCubit cubit;
  final bool isDark;
  final bool isLoading;

  const GroupDetailsSheet({
    super.key,
    required this.group,
    required this.cubit,
    required this.isDark,
    this.isLoading = false,
  });

  static Future<void> show(
    BuildContext context,
    GroupModel group,
    GroupsCubit cubit,
    bool isDark, {
    bool isLoading = false,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => GroupDetailsSheet(
        group: group,
        cubit: cubit,
        isDark: isDark,
        isLoading: isLoading,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.4,
      maxChildSize: 0.85,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.getCardBackground(isDark),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              _buildHandle(),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 24),
                      if (group.description != null &&
                          group.description!.isNotEmpty)
                        _buildDescription(),
                      const SizedBox(height: 20),
                      _buildGroupInfo(),
                      const SizedBox(height: 24),
                      _buildActionButton(context),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHandle() {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: AppColors.getBorderColor(isDark),
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        _buildGroupAvatar(),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                group.name,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextColor(isDark),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(
                    Icons.people_rounded,
                    size: 16,
                    color: AppColors.getSubtitleColor(isDark),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${group.formattedMembersCount} members',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.getSubtitleColor(isDark),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGroupAvatar() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: group.avatarUrl == null
            ? LinearGradient(
                colors: [
                  AppColors.primaryColor,
                  AppColors.primaryColor.withValues(alpha: 0.7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : null,
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryColor.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: group.avatarUrl != null
          ? ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: CachedNetworkImage(
                imageUrl: group.avatarUrl!,
                fit: BoxFit.cover,
                errorWidget: (context, error, stackTrace) =>
                    _buildAvatarPlaceholder(),
              ),
            )
          : _buildAvatarPlaceholder(),
    );
  }

  Widget _buildAvatarPlaceholder() {
    return Center(
      child: Text(
        group.name.isNotEmpty ? group.name[0].toUpperCase() : 'G',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 32,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildDescription() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'About',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.getTextColor(isDark),
          ),
        ),
        const SizedBox(height: 10),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.getBackground(isDark),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.getBorderColor(isDark)),
          ),
          child: Text(
            group.description!,
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGroupInfo() {
    final dateFormat = DateFormat('MMMM d, yyyy');

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.getBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
      ),
      child: Column(
        children: [
          _buildInfoRow(
            Icons.people_outline_rounded,
            'Members',
            '${group.membersCount}',
          ),
          const SizedBox(height: 14),
          _buildInfoRow(
            Icons.calendar_today_outlined,
            'Created',
            dateFormat.format(group.createdAt),
          ),
          const SizedBox(height: 14),
          _buildInfoRow(
            Icons.check_circle_outline_rounded,
            'Status',
            group.isJoined ? 'Joined' : 'Not Joined',
            valueColor: group.isJoined ? AppColors.successColor : null,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    IconData icon,
    String label,
    String value, {
    Color? valueColor,
  }) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: AppColors.primaryColor),
        ),
        const SizedBox(width: 12),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.getSubtitleColor(isDark),
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: valueColor ?? AppColors.getTextColor(isDark),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(BuildContext context) {
    if (isLoading) {
      return Container(
        width: double.infinity,
        height: 52,
        decoration: BoxDecoration(
          color: AppColors.primaryColor.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(14),
        ),
        child: const Center(
          child: SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              color: AppColors.primaryColor,
            ),
          ),
        ),
      );
    }

    if (group.isJoined) {
      return SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          onPressed: () {
            Navigator.pop(context);
            _showRemoveConfirmation(context);
          },
          icon: const Icon(Icons.group_remove_rounded),
          label: const Text('Leave This Group?'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.errorColor,
            side: const BorderSide(color: AppColors.errorColor, width: 1.5),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
          ),
        ),
      );
    }

    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          Navigator.pop(context);
          cubit.joinGroup(group.id);
        },
        icon: const Icon(Icons.group_add_rounded),
        label: const Text('Join Group'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryColor,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }

  void _showRemoveConfirmation(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.getCardBackground(isDark),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.getBorderColor(isDark),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.errorColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.group_remove_rounded,
                color: AppColors.errorColor,
                size: 32,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Leave Group?',
              style: TextStyle(
                color: AppColors.getTextColor(isDark),
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Are you sure you want to remove "${group.name}" from your groups?',
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.getTextColor(isDark),
                      side: BorderSide(color: AppColors.getBorderColor(isDark)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Cancel',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      cubit.leaveGroup(group.id);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.errorColor,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Leave',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
