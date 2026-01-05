import 'package:college_project/features/student_id/models/student_id_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentPrivilegesTable extends StatelessWidget {
  final List<StudentPrivilege> privileges;

  const StudentPrivilegesTable({super.key, required this.privileges});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: 24.w),
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20.r,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Access Privileges',
                style: TextStyle(
                  color: const Color(0xFF0F172A),
                  fontSize: 15.sp,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Icon(
                Icons.verified_user_rounded,
                color: Colors.green.shade600,
                size: 20.w,
              ),
            ],
          ),
          SizedBox(height: 16.h),
          const Divider(color: Color(0xFFF1F5F9), height: 1),
          SizedBox(height: 16.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: privileges.map((p) => _buildPrivilegeItem(p)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivilegeItem(StudentPrivilege privilege) {
    return Column(
      children: [
        Stack(
          children: [
            Container(
              height: 44.h,
              width: 44.w,
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFF1F5F9)),
              ),
              child: Icon(
                privilege.icon,
                color: privilege.isGranted
                    ? const Color(0xFF4F46E5)
                    : const Color(0xFF94A3B8),
                size: 20.w,
              ),
            ),
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                padding: EdgeInsets.all(2.w),
                decoration: BoxDecoration(
                  color: privilege.isGranted ? Colors.green : Colors.red,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 1.5),
                ),
                child: Icon(
                  privilege.isGranted ? Icons.check : Icons.close,
                  color: Colors.white,
                  size: 8.w,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 8.h),
        Text(
          privilege.label,
          style: TextStyle(
            color: const Color(0xFF64748B),
            fontSize: 10.sp,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}
