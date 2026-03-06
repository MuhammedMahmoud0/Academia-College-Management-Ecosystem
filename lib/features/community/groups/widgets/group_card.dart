import 'package:cached_network_image/cached_network_image.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/groups/cubit/groups_cubit.dart';
import 'package:college_project/features/community/groups/models/groups_response_model.dart';
import 'package:college_project/features/community/groups/widgets/group_details_sheet.dart';
import 'package:flutter/material.dart';

class GroupCard extends StatelessWidget {
  final GroupModel group;
  final bool isDark;
  final bool isLoading;
  final VoidCallback onJoinOrLeave;
  final GroupsCubit cubit;

  const GroupCard({
    super.key,
    required this.group,
    required this.isDark,
    this.isLoading = false,
    required this.onJoinOrLeave,
    required this.cubit,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            GroupDetailsSheet.show(
              context,
              group,
              cubit,
              isDark,
              isLoading: isLoading,
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                _buildGroupAvatar(),
                const SizedBox(width: 14),
                Expanded(child: _buildGroupInfo()),
                const SizedBox(width: 12),
                _buildActionButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGroupAvatar() {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
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
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: group.avatarUrl != null
          ? ClipRRect(
              borderRadius: BorderRadius.circular(14),
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
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildGroupInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          group.name,
          style: TextStyle(
            color: AppColors.getTextColor(isDark),
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        if (group.description != null && group.description!.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            group.description!,

            style: TextStyle(
              color: AppColors.getSubtitleColor(isDark),
              fontSize: 13,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
        const SizedBox(height: 8),
        _buildStatChip(
          Icons.people_outline_rounded,
          '${group.formattedMembersCount} members',
        ),
      ],
    );
  }

  Widget _buildStatChip(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: AppColors.getSubtitleColor(isDark)),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: AppColors.getSubtitleColor(isDark),
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton() {
    if (isLoading) {
      return Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.primaryColor.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppColors.primaryColor,
            ),
          ),
        ),
      );
    }

    if (group.isJoined) {
      return OutlinedButton(
        onPressed: onJoinOrLeave,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.errorColor,
          side: const BorderSide(color: AppColors.errorColor, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: const Text(
          'Leave',
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
        ),
      );
    }

    return ElevatedButton(
      onPressed: onJoinOrLeave,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: const Text(
        'Join',
        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
      ),
    );
  }
}
