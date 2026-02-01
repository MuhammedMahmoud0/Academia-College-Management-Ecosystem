import 'package:college_project/features/student_id/models/student_id_model.dart';
import 'package:college_project/features/student_id/widgets/student_Id_card.dart';
import 'package:college_project/features/student_id/widgets/student_privileges_table.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentIdScreen extends StatefulWidget {
  const StudentIdScreen({super.key});

  @override
  State<StudentIdScreen> createState() => _StudentIdScreenState();
}

class _StudentIdScreenState extends State<StudentIdScreen> {
  // Mock data - In a real MVVM app, this would come from a ViewModel
  final Student _currentStudent = Student.mock;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Student Identification',
          style: TextStyle(
            color: const Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 20.sp,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: 40.h),
              // The StudentIdCard now handles its own animation and tap gestures
              // based on the implementation you provided.
              StudentIdCard(student: _currentStudent),
              SizedBox(height: 48.h),
              Text(
                'Tap card to flip for more details',
                style: TextStyle(
                  color: const Color(0xFF64748B),
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 50.h),
              // Using the refactored component from Canvas
              StudentPrivilegesTable(privileges: _currentStudent.privileges),
              SizedBox(height: 40.h),
            ],
          ),
        ),
      ),
    );
  }
}
