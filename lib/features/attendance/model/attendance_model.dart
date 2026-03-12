class AttendanceModel {
  String? msg;
  String? status;
  String? sessionId;
  String? error;
  AttendanceModel({this.msg, this.status, this.sessionId, this.error});

  factory AttendanceModel.fromJson(Map<String, dynamic> json) {
    return AttendanceModel(
      msg: json['message'],
      status: json['status'],
      sessionId: json['sessionId'],
      error: json['error'],
    );
  }
}
