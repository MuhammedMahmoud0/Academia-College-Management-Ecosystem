import 'dart:convert';
import 'dart:typed_data';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/models/community_response_model.dart';
import 'package:college_project/features/community/widgets/comment_widget.dart';
import 'package:flutter/material.dart';

class PostCard extends StatelessWidget {
  final PostModel post;
  final bool isDark;
  final VoidCallback? onLike;
  final VoidCallback? onComment;
  final VoidCallback? onShare;

  const PostCard({
    super.key,
    required this.post,
    this.isDark = false,
    this.onLike,
    this.onComment,
    this.onShare,
  });

  bool _isBase64(String url) => url.startsWith('data:image');

  Uint8List _decodeBase64(String url) {
    final base64String = url.split(',').last;
    return base64Decode(base64String);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.getBorderColor(isDark)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          _buildContent(),
          if (post.imageUrl != null && post.imageUrl!.isNotEmpty) _buildImage(),
          _buildActions(),
          if (post.recentComments.isNotEmpty) _buildComments(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _buildAvatar(post.authorAvatar, post.authorName, 44),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  post.authorName,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.getTextColor(isDark),
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    if (post.groupName != null) ...[
                      Icon(
                        Icons.group_rounded,
                        size: 14,
                        color: AppColors.primaryColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        post.groupName!,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppColors.primaryColor,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '•',
                        style: TextStyle(
                          color: AppColors.getSubtitleColor(isDark),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      post.timeAgo,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.getSubtitleColor(isDark),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: Icon(
              Icons.more_horiz_rounded,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Text(
        post.content ?? '',
        style: TextStyle(
          fontSize: 14,
          height: 1.5,
          color: AppColors.getTextColor(isDark),
        ),
      ),
    );
  }

  Widget _buildImage() {
    final imageUrl = post.imageUrl!;

    return Container(
      margin: const EdgeInsets.only(top: 12),
      constraints: const BoxConstraints(maxHeight: 300),
      width: double.infinity,
      child: ClipRRect(
        child: _isBase64(imageUrl)
            ? Image.memory(
                _decodeBase64(imageUrl),
                fit: BoxFit.cover,
                width: double.infinity,
                errorBuilder: (context, error, stackTrace) =>
                    _buildImageError(),
              )
            : CachedNetworkImage(
                imageUrl: imageUrl,
                fit: BoxFit.cover,
                placeholder: (context, url) => _buildImagePlaceholder(),
                errorWidget: (context, error, stackTrace) => _buildImageError(),
              ),
      ),
    );
  }

  Widget _buildImagePlaceholder() {
    return Container(
      height: 200,
      color: AppColors.getBorderColor(isDark),
      child: Center(
        child: CircularProgressIndicator(
          color: AppColors.primaryColor,
          strokeWidth: 2,
        ),
      ),
    );
  }

  Widget _buildImageError() {
    return Container(
      height: 200,
      color: AppColors.getBorderColor(isDark),
      child: Center(
        child: Icon(
          Icons.image_not_supported_rounded,
          color: AppColors.getSubtitleColor(isDark),
          size: 48,
        ),
      ),
    );
  }

  Widget _buildActions() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _buildLikeButton(),
          const SizedBox(width: 24),
          _buildActionButton(
            icon: Icons.chat_bubble_outline_rounded,
            label: post.commentsCount.toString(),
            onTap: onComment,
          ),
        ],
      ),
    );
  }

  Widget _buildLikeButton() {
    final isLiked = post.isLiked;
    return GestureDetector(
      onTap: onLike,
      child: Row(
        children: [
          Icon(
            isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
            size: 20,
            color: isLiked ? Colors.red : AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(width: 6),
          Text(
            post.likesCount.toString(),
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isLiked ? Colors.red : AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.getSubtitleColor(isDark)),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.getSubtitleColor(isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComments() {
    final commentsToShow = post.recentComments.take(2).toList();
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Divider(color: AppColors.getBorderColor(isDark)),
          const SizedBox(height: 8),
          ...commentsToShow.map(
            (comment) => CommentWidget(comment: comment, isDark: isDark),
          ),
          if (post.commentsCount > 2)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: GestureDetector(
                onTap: onComment,
                child: Text(
                  'View all ${post.commentsCount} comments',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primaryColor,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildAvatar(String? avatarUrl, String name, double size) {
    if (avatarUrl != null && avatarUrl.isNotEmpty) {
      if (_isBase64(avatarUrl)) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(size / 2),
          child: Image.memory(
            _decodeBase64(avatarUrl),
            width: size,
            height: size,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) =>
                _buildDefaultAvatar(name, size),
          ),
        );
      }
      return ClipRRect(
        borderRadius: BorderRadius.circular(size / 2),
        child: CachedNetworkImage(
          imageUrl: avatarUrl,
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorWidget: (context, error, stackTrace) =>
              _buildDefaultAvatar(name, size),
        ),
      );
    }
    return _buildDefaultAvatar(name, size);
  }

  Widget _buildDefaultAvatar(String name, double size) {
    final initial = name.isNotEmpty ? name[0].toUpperCase() : '?';
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.primaryColor.withValues(alpha: 0.1),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          initial,
          style: TextStyle(
            fontSize: size * 0.4,
            fontWeight: FontWeight.bold,
            color: AppColors.primaryColor,
          ),
        ),
      ),
    );
  }
}
