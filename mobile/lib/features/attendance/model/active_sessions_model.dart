class ActiveSessionsResponseModel {
  final List<ActiveSessionModel>? sessions;
  final String? error;
  ActiveSessionsResponseModel({this.sessions, this.error});

  factory ActiveSessionsResponseModel.fromJson(Map<String, dynamic> json) {
    return ActiveSessionsResponseModel(
      sessions: (json['sessions'] as List<dynamic>?)
          ?.map(
            (post) => ActiveSessionModel.fromJson(post as Map<String, dynamic>),
          )
          .toList(),
      error: json['error'] as String?,
    );
  }
}

class ActiveSessionModel {
  final bool? isLive;
  final double? latitude;
  final double? longitude;
  ActiveSessionModel({this.isLive, this.latitude, this.longitude});

  factory ActiveSessionModel.fromJson(Map<String, dynamic> json) {
    return ActiveSessionModel(
      isLive: json['isLive'],
      latitude: json['latitude'],
      longitude: json['longitude'],
    );
  }
}
