import 'package:college_project/features/home/models/student_model.dart';
import 'package:hive/hive.dart';

part 'student_profile_model.g.dart';

@HiveType(typeId: 0)
class StudentProfileModel extends HiveObject {
  // Basic info
  @HiveField(0)
  final String? id;

  @HiveField(1)
  final String? name;

  @HiveField(2)
  final String? email;

  @HiveField(3)
  final String? phone;

  @HiveField(4)
  final String? avatarUrl;

  @HiveField(5)
  final String? address;

  // Academic
  @HiveField(6)
  final String? studentId;

  @HiveField(7)
  final int? yearLevel;

  @HiveField(8)
  final double? cgpa;

  @HiveField(9)
  final int? totalCredits;

  // Department
  @HiveField(10)
  final String? departmentId;

  @HiveField(11)
  final String? departmentName;

  StudentProfileModel({
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

  /// Convert from StudentModel to StudentProfileModel
  factory StudentProfileModel.fromStudentModel(StudentModel studentModel) {
    return StudentProfileModel(
      id: studentModel.id,
      name: studentModel.name,
      email: studentModel.email,
      phone: studentModel.phone,
      avatarUrl: studentModel.avatarUrl,
      address: studentModel.address,
      studentId: studentModel.studentId,
      yearLevel: studentModel.yearLevel,
      cgpa: studentModel.cgpa,
      totalCredits: studentModel.totalCredits,
      departmentId: studentModel.departmentId,
      departmentName: studentModel.departmentName,
    );
  }

  /// Convert to StudentModel for use in the app
  StudentModel toStudentModel() {
    return StudentModel(
      id: id,
      name: name,
      email: email,
      phone: phone,
      avatarUrl: avatarUrl,
      address: address,
      studentId: studentId,
      yearLevel: yearLevel,
      cgpa: cgpa,
      totalCredits: totalCredits,
      departmentId: departmentId,
      departmentName: departmentName,
    );
  }

  StudentProfileModel copyWith({
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
    return StudentProfileModel(
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
