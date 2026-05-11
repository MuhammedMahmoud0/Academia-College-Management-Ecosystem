class LoginModel {
  final String? token;
  final String? msg;

  LoginModel({this.token, this.msg});

  factory LoginModel.fromJson(Map<String, dynamic> json) {
    return LoginModel(token: json['accessToken'], msg: json['message']);
  }
}
