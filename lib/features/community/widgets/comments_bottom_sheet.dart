import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/cubit/community_cubit.dart';
import 'package:college_project/features/community/models/community_response_model.dart';
import 'package:college_project/features/community/widgets/comment_widget.dart';
import 'package:flutter/material.dart';

class CommentsBottomSheet extends StatefulWidget {
  final PostModel post;
  final CommunityCubit cubit;
  final bool isDark;

  const CommentsBottomSheet({
    super.key,
    required this.post,
    required this.cubit,
    required this.isDark,
  });

  static Future<void> show(
    BuildContext context,
    PostModel post,
    CommunityCubit cubit,
    bool isDark,
  ) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          CommentsBottomSheet(post: post, cubit: cubit, isDark: isDark),
    );
  }

  @override
  State<CommentsBottomSheet> createState() => _CommentsBottomSheetState();
}

class _CommentsBottomSheetState extends State<CommentsBottomSheet> {
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  late List<CommentModel> _comments;
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    _comments = widget.cubit.getComments(widget.post.id);
  }

  @override
  void dispose() {
    _commentController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  Future<void> _sendComment() async {
    final content = _commentController.text.trim();
    if (content.isEmpty || _isSending) return;
    FocusScope.of(context).unfocus();
    setState(() => _isSending = true);

    final newComment = await widget.cubit.addComment(widget.post.id, content);

    if (newComment != null) {
      setState(() {
        _comments.insert(0, newComment);
        _commentController.clear();
      });
    }

    setState(() => _isSending = false);
  }

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(widget.isDark),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(child: _buildCommentsList()),
          _buildCommentInput(bottomPadding),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.getBorderColor(widget.isDark)),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: AppColors.getBorderColor(widget.isDark),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Comments',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextColor(widget.isDark),
                ),
              ),
              Text(
                '${_comments.length}',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.getSubtitleColor(widget.isDark),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCommentsList() {
    if (_comments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline_rounded,
              size: 48,
              color: AppColors.getSubtitleColor(widget.isDark),
            ),
            const SizedBox(height: 12),
            Text(
              'No comments yet',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppColors.getTextColor(widget.isDark),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Be the first to comment!',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.getSubtitleColor(widget.isDark),
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _comments.length,
      itemBuilder: (context, index) {
        return CommentWidget(comment: _comments[index], isDark: widget.isDark);
      },
    );
  }

  Widget _buildCommentInput(double bottomPadding) {
    return Container(
      padding: EdgeInsets.fromLTRB(16, 12, 16, 12 + bottomPadding),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(widget.isDark),
        border: Border(
          top: BorderSide(color: AppColors.getBorderColor(widget.isDark)),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.getBackground(widget.isDark),
                borderRadius: BorderRadius.circular(24),
              ),
              child: TextField(
                controller: _commentController,
                focusNode: _focusNode,
                style: TextStyle(
                  color: AppColors.getTextColor(widget.isDark),
                  fontSize: 14,
                ),
                decoration: InputDecoration(
                  hintText: 'Write a comment...',
                  hintStyle: TextStyle(
                    color: AppColors.getSubtitleColor(widget.isDark),
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                maxLines: 3,
                minLines: 1,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendComment(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _sendComment,
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.primaryColor,
                shape: BoxShape.circle,
              ),
              child: _isSending
                  ? const Padding(
                      padding: EdgeInsets.all(12),
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Icon(
                      Icons.send_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
