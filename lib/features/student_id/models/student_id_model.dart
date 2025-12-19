import 'package:flutter/material.dart';

class Student {
  final String name;
  final String idNumber;
  final String universityName;
  final String level;
  final String major;
  final String gpa;
  final String profileImageUrl;
  final String validUntil;
  final List<StudentPrivilege> privileges;

  const Student({
    required this.name,
    required this.idNumber,
    required this.universityName,
    required this.level,
    required this.major,
    required this.gpa,
    required this.profileImageUrl,
    required this.validUntil,
    required this.privileges,
  });

  // Mock data for initial state
  static Student get mock => const Student(
    name: 'Alex Thompson',
    idNumber: '2024-8842-19',
    universityName: 'UNIVERSITY OF TECHNOLOGY',
    level: 'Junior',
    major: 'Comp. Science',
    gpa: '3.82',
    profileImageUrl: 'https://i.pravatar.cc/150?u=student',
    validUntil: 'JUN 2026',
    privileges: [
      StudentPrivilege(
        icon: Icons.door_front_door_rounded,
        label: 'Main Gate',
        isGranted: true,
      ),
      StudentPrivilege(
        icon: Icons.menu_book_rounded,
        label: 'Library',
        isGranted: true,
      ),
      StudentPrivilege(
        icon: Icons.fitness_center_rounded,
        label: 'Gym',
        isGranted: false,
      ),
      StudentPrivilege(
        icon: Icons.local_hospital_rounded,
        label: 'Clinic',
        isGranted: true,
      ),
    ],
  );
}

class StudentPrivilege {
  final IconData icon;
  final String label;
  final bool isGranted;

  const StudentPrivilege({
    required this.icon,
    required this.label,
    required this.isGranted,
  });
}
