class CommunityResponseModel {
  final List<PostModel> posts;

  CommunityResponseModel({required this.posts});

  factory CommunityResponseModel.fromJson(Map<String, dynamic> json) {
    return CommunityResponseModel(
      posts: (json['posts'] as List<dynamic>)
          .map((post) => PostModel.fromJson(post as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {'posts': posts.map((post) => post.toJson()).toList()};
  }

  /// Get posts sorted by date descending (newest first)
  List<PostModel> get sortedPosts {
    final sorted = List<PostModel>.from(posts);
    sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sorted;
  }
}

class PostModel {
  final int id;
  final String authorName;
  final String? authorAvatar;
  final String? groupName;
  final String? content;
  final String? imageUrl;
  final int likesCount;
  final int commentsCount;
  final DateTime createdAt;
  final List<CommentModel> recentComments;
  final List<CommentModel> postComments;
  final bool isLiked;

  PostModel({
    required this.id,
    required this.authorName,
    this.authorAvatar,
    this.groupName,
    this.content,
    this.imageUrl,
    required this.likesCount,
    required this.commentsCount,
    required this.createdAt,
    required this.recentComments,
    required this.postComments,
    this.isLiked = false,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] as int,
      authorName: json['author_name'] as String,
      authorAvatar: json['author_avatar'] as String?,
      groupName: json['group_name'] as String?,
      content: json['content'] as String?,
      imageUrl: json['image_url'] as String?,
      likesCount: json['likes_count'] as int,
      commentsCount: json['comments_count'] as int,
      createdAt: DateTime.parse(json['created_at'] as String),
      recentComments:
          (json['recent_comments'] as List<dynamic>?)
              ?.map((c) => CommentModel.fromJson(c as Map<String, dynamic>))
              .toList() ??
          [],
      postComments:
          (json['post_comments'] as List<dynamic>?)
              ?.map((c) => CommentModel.fromJson(c as Map<String, dynamic>))
              .toList() ??
          [],
      isLiked: json['is_liked_by_me'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'author_name': authorName,
      'author_avatar': authorAvatar,
      'group_name': groupName,
      'content': content,
      'image_url': imageUrl,
      'likes_count': likesCount,
      'comments_count': commentsCount,
      'created_at': createdAt.toIso8601String(),
      'recent_comments': recentComments.map((c) => c.toJson()).toList(),
      'post_comments': postComments.map((c) => c.toJson()).toList(),
      'is_liked_by_me': isLiked,
    };
  }

  PostModel copyWith({
    int? id,
    String? authorName,
    String? authorAvatar,
    String? groupName,
    String? content,
    String? imageUrl,
    int? likesCount,
    int? commentsCount,
    DateTime? createdAt,
    List<CommentModel>? recentComments,
    List<CommentModel>? postComments,
    bool? isLiked,
  }) {
    return PostModel(
      id: id ?? this.id,
      authorName: authorName ?? this.authorName,
      authorAvatar: authorAvatar ?? this.authorAvatar,
      groupName: groupName ?? this.groupName,
      content: content ?? this.content,
      imageUrl: imageUrl ?? this.imageUrl,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      createdAt: createdAt ?? this.createdAt,
      recentComments: recentComments ?? this.recentComments,
      postComments: postComments ?? this.postComments,
      isLiked: isLiked ?? this.isLiked,
    );
  }

  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()}y ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()}mo ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}

class CommentModel {
  final int id;
  final String content;
  final DateTime createdAt;
  final String authorName;
  final String? authorAvatar;

  CommentModel({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.authorName,
    this.authorAvatar,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    return CommentModel(
      id: json['id'] as int,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      authorName: json['users'] != null
          ? json['users']['full_name'] as String
          : json['author_name'] as String,
      authorAvatar: json['users'] != null
          ? json['users']['avatar_url'] as String?
          : json['author_avatar'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'created_at': createdAt.toIso8601String(),
      'author_name': authorName,
      'author_avatar': authorAvatar,
    };
  }

  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays > 0) {
      return '${difference.inDays}d';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'now';
    }
  }
}
