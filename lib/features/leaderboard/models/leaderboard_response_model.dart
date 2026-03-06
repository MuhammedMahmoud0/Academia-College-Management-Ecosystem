class LeaderboardResponseModel {
  final List<LeaderboardStudent> leaderboard;
  final UserRank? userRank;

  LeaderboardResponseModel({
    required this.leaderboard,
    this.userRank,
  });

  factory LeaderboardResponseModel.fromJson(Map<String, dynamic> json) {
    return LeaderboardResponseModel(
      leaderboard: (json['leaderboard'] as List<dynamic>?)
              ?.map((e) => LeaderboardStudent.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      userRank: json['userRank'] != null
          ? UserRank.fromJson(json['userRank'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'leaderboard': leaderboard.map((e) => e.toJson()).toList(),
      'userRank': userRank?.toJson(),
    };
  }
}

class LeaderboardStudent {
  final int rank;
  final String studentId;
  final String name;
  final String avatar;
  final String department;
  final int level;
  final double score;
  final String badge;

  LeaderboardStudent({
    required this.rank,
    required this.studentId,
    required this.name,
    required this.avatar,
    required this.department,
    required this.level,
    required this.score,
    required this.badge,
  });

  factory LeaderboardStudent.fromJson(Map<String, dynamic> json) {
    return LeaderboardStudent(
      rank: json['rank'] ?? 0,
      studentId: json['studentId'] ?? '',
      name: json['name'] ?? '',
      avatar: json['avatar'] ?? '',
      department: json['department'] ?? '',
      level: json['level'] ?? 0,
      score: (json['score'] ?? 0).toDouble(),
      badge: json['badge'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rank': rank,
      'studentId': studentId,
      'name': name,
      'avatar': avatar,
      'department': department,
      'level': level,
      'score': score,
      'badge': badge,
    };
  }
}

class UserRank {
  final int rank;
  final double score;
  final double percentile;

  UserRank({
    required this.rank,
    required this.score,
    required this.percentile,
  });

  factory UserRank.fromJson(Map<String, dynamic> json) {
    return UserRank(
      rank: json['rank'] ?? 0,
      score: (json['score'] ?? 0).toDouble(),
      percentile: (json['percentile'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rank': rank,
      'score': score,
      'percentile': percentile,
    };
  }
}
