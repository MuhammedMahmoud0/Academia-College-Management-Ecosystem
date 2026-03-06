class GroupsResponseModel {
  final List<GroupModel> groups;

  GroupsResponseModel({required this.groups});

  factory GroupsResponseModel.fromJson(Map<String, dynamic> json) {
    return GroupsResponseModel(
      groups: (json['groups'] as List<dynamic>)
          .map((group) => GroupModel.fromJson(group as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {'groups': groups.map((group) => group.toJson()).toList()};
  }
}

class GroupModel {
  final int id;
  final String name;
  final String? description;
  final String? avatarUrl;
  final int membersCount;
  final DateTime createdAt;
  final bool isJoined;

  GroupModel({
    required this.id,
    required this.name,
    this.description,
    this.avatarUrl,
    required this.membersCount,
    required this.createdAt,
    this.isJoined = false,
  });

  factory GroupModel.fromJson(Map<String, dynamic> json) {
    return GroupModel(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      membersCount: json['members_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
      isJoined: json['is_joined'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'avatar_url': avatarUrl,
      'members_count': membersCount,
      'created_at': createdAt.toIso8601String(),
      'is_joined': isJoined,
    };
  }

  GroupModel copyWith({
    int? id,
    String? name,
    String? description,
    String? avatarUrl,
    int? membersCount,
    DateTime? createdAt,
    bool? isJoined,
  }) {
    return GroupModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      membersCount: membersCount ?? this.membersCount,
      createdAt: createdAt ?? this.createdAt,
      isJoined: isJoined ?? this.isJoined,
    );
  }

  String get formattedMembersCount {
    if (membersCount >= 1000000) {
      return '${(membersCount / 1000000).toStringAsFixed(1)}M';
    } else if (membersCount >= 1000) {
      return '${(membersCount / 1000).toStringAsFixed(1)}K';
    }
    return membersCount.toString();
  }
}
