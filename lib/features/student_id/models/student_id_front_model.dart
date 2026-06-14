class StudentIdFrontModel {
  final String systemName;
  final String identityLabel;
  final StudentIdHolder holder;
  final StudentIdValidity cardValidity;

  StudentIdFrontModel({
    required this.systemName,
    required this.identityLabel,
    required this.holder,
    required this.cardValidity,
  });

  factory StudentIdFrontModel.fromJson(Map<String, dynamic> json) {
    return StudentIdFrontModel(
      systemName: json['system_name'] as String? ?? '',
      identityLabel: json['identity_label'] as String? ?? '',
      holder: StudentIdHolder.fromJson(json['holder'] as Map<String, dynamic>),
      cardValidity: StudentIdValidity.fromJson(
        json['card_validity'] as Map<String, dynamic>,
      ),
    );
  }
}

class StudentIdHolder {
  final String fullName;
  final String role;
  final String studentId;
  final String department;
  final String level;
  final int yearLevel;

  StudentIdHolder({
    required this.fullName,
    required this.role,
    required this.studentId,
    required this.department,
    required this.level,
    required this.yearLevel,
  });

  factory StudentIdHolder.fromJson(Map<String, dynamic> json) {
    return StudentIdHolder(
      fullName: json['full_name'] as String? ?? '',
      role: json['role'] as String? ?? '',
      studentId: json['student_id'] as String? ?? '',
      department: json['department'] as String? ?? '',
      level: json['level'] as String? ?? '',
      yearLevel: json['year_level'] as int? ?? 0,
    );
  }
}

class StudentIdValidity {
  final String issuedDate;
  final String expiresDate;

  StudentIdValidity({required this.issuedDate, required this.expiresDate});

  factory StudentIdValidity.fromJson(Map<String, dynamic> json) {
    return StudentIdValidity(
      issuedDate: json['issued_date'] as String? ?? '',
      expiresDate: json['expires_date'] as String? ?? '',
    );
  }

  /// Formats expires_date "2027-07-31" → "JUL 2027"
  String get formattedExpiry {
    try {
      final dt = DateTime.parse(expiresDate);
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      return '${months[dt.month - 1]} ${dt.year}';
    } catch (_) {
      return expiresDate;
    }
  }
}
