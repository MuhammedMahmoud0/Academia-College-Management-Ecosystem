class StudentIdBackModel {
  final String systemName;
  final StudentIdQrCode qrCode;
  final StudentIdBarcode barcode;
  final List<String> accessPrivileges;

  StudentIdBackModel({
    required this.systemName,
    required this.qrCode,
    required this.barcode,
    required this.accessPrivileges,
  });

  factory StudentIdBackModel.fromJson(Map<String, dynamic> json) {
    return StudentIdBackModel(
      systemName: json['system_name'] as String? ?? '',
      qrCode: StudentIdQrCode.fromJson(json['qr_code'] as Map<String, dynamic>),
      barcode: StudentIdBarcode.fromJson(
        json['barcode'] as Map<String, dynamic>,
      ),
      accessPrivileges:
          (json['access_privileges'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }
}

class StudentIdQrCode {
  final String studentId;
  final String nationalId;

  StudentIdQrCode({required this.studentId, required this.nationalId});

  factory StudentIdQrCode.fromJson(Map<String, dynamic> json) {
    return StudentIdQrCode(
      studentId: json['student_id'] as String? ?? '',
      nationalId: json['national_id'] as String? ?? '',
    );
  }
}

class StudentIdBarcode {
  final bool access;

  StudentIdBarcode({required this.access});

  factory StudentIdBarcode.fromJson(Map<String, dynamic> json) {
    return StudentIdBarcode(access: json['access'] as bool? ?? false);
  }
}
