class Student {
  final String id;
  final String name;
  final String email;
  final String department;
  final String level;
  final double gpa;
  final String? profilePhotoUrl;
  final String academicStatus;

  const Student({
    required this.id,
    required this.name,
    required this.email,
    required this.department,
    required this.level,
    required this.gpa,
    this.profilePhotoUrl,
    required this.academicStatus,
  });

  // Mock data for demonstration
  static const Student mock = Student(
    id: '20210445',
    name: 'Ahmed Kabary',
    email: 'ahmed.kabary@academia.edu',
    department: 'Computer Science',
    level: 'Level 4',
    gpa: 3.72,
    academicStatus: 'Good Standing',
  );
}
