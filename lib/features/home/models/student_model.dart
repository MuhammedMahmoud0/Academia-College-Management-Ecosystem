import 'package:college_project/core/constants/constants.dart';

class StudentModel {
  // Basic info
  final String? id;

  final String? name;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final String? address;

  // Academic
  final String? studentId;
  final int? yearLevel;
  final double? cgpa;
  final int? totalCredits;

  // Department
  final String? departmentId;
  final String? departmentName;

  StudentModel({
    this.id,
    this.name,
    this.email,
    this.phone,
    this.avatarUrl,
    this.address,
    this.studentId,
    this.yearLevel,
    this.cgpa,
    this.totalCredits,
    this.departmentId,
    this.departmentName,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    final sp = json['studentProfile'];
    final profile = sp?['student_profiles'];

    final dept = profile?['departments'];

    return StudentModel(
      id: sp?['id'],
      // Basic
      name: sp?['full_name'] ?? 'testname',
      email: sp?['email'] ?? 'testemail',
      phone: sp?['phone'] ?? 'testphone',
      avatarUrl: sp?['avatar_url'] ?? Constants.userImg,
      address: sp?['address'] ?? 'testaddress',

      // Academic
      studentId: profile?['student_id'] ?? 'teststudentid',
      yearLevel: profile?['year_level'] ?? 1,
      cgpa: (profile?['cgpa'] as num?)?.toDouble() ?? 0.0,
      totalCredits: profile?['total_credits'] ?? 0,

      // Department
      departmentId: dept?['department_id'] ?? 'testdepartmentid',
      departmentName: dept?['name'] ?? 'testdepartmentname',
    );
  }

  StudentModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? avatarUrl,
    String? address,
    String? studentId,
    int? yearLevel,
    double? cgpa,
    int? totalCredits,
    String? departmentId,
    String? departmentName,
  }) {
    return StudentModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      address: address ?? this.address,
      studentId: studentId ?? this.studentId,
      yearLevel: yearLevel ?? this.yearLevel,
      cgpa: cgpa ?? this.cgpa,
      totalCredits: totalCredits ?? this.totalCredits,
      departmentId: departmentId ?? this.departmentId,
      departmentName: departmentName ?? this.departmentName,
    );
  }
}
