// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'student_profile_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class StudentProfileModelAdapter extends TypeAdapter<StudentProfileModel> {
  @override
  final int typeId = 0;

  @override
  StudentProfileModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return StudentProfileModel(
      id: fields[0] as String?,
      name: fields[1] as String?,
      email: fields[2] as String?,
      phone: fields[3] as String?,
      avatarUrl: fields[4] as String?,
      address: fields[5] as String?,
      studentId: fields[6] as String?,
      yearLevel: fields[7] as int?,
      cgpa: fields[8] as double?,
      totalCredits: fields[9] as int?,
      departmentId: fields[10] as String?,
      departmentName: fields[11] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, StudentProfileModel obj) {
    writer
      ..writeByte(12)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.email)
      ..writeByte(3)
      ..write(obj.phone)
      ..writeByte(4)
      ..write(obj.avatarUrl)
      ..writeByte(5)
      ..write(obj.address)
      ..writeByte(6)
      ..write(obj.studentId)
      ..writeByte(7)
      ..write(obj.yearLevel)
      ..writeByte(8)
      ..write(obj.cgpa)
      ..writeByte(9)
      ..write(obj.totalCredits)
      ..writeByte(10)
      ..write(obj.departmentId)
      ..writeByte(11)
      ..write(obj.departmentName);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentProfileModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
