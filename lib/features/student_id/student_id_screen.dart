import 'package:college_project/features/student_id/cubit/student_id_cubit.dart';
import 'package:college_project/features/student_id/cubit/student_id_states.dart';
import 'package:college_project/features/student_id/widgets/student_Id_card.dart';
import 'package:college_project/features/student_id/widgets/student_privileges_table.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentIdScreen extends StatefulWidget {
  const StudentIdScreen({super.key});

  @override
  State<StudentIdScreen> createState() => _StudentIdScreenState();
}

class _StudentIdScreenState extends State<StudentIdScreen> {
  @override
  void initState() {
    super.initState();
    context.read<StudentIdCubit>().fetchStudentId();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: Theme.of(context).colorScheme.onSurface,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Student Identification',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.w800,
            fontSize: 20.sp,
          ),
        ),
      ),
      body: BlocBuilder<StudentIdCubit, StudentIdStates>(
        builder: (context, state) {
          if (state is StudentIdLoading || state is StudentIdInitial) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is StudentIdError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 48),
                  SizedBox(height: 16.h),
                  Text(
                    'Failed to load ID',
                    style: TextStyle(
                      fontSize: 16.sp,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    state.error,
                    style: TextStyle(
                      fontSize: 13.sp,
                      color: const Color(0xFF64748B),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 24.h),
                  ElevatedButton(
                    onPressed: () =>
                        context.read<StudentIdCubit>().fetchStudentId(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (state is StudentIdLoaded) {
            return SingleChildScrollView(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 40.h),
                    StudentIdCard(front: state.front, back: state.back),
                    SizedBox(height: 48.h),
                    Text(
                      'Tap card to flip for more details',
                      style: TextStyle(
                        color: Theme.of(
                          context,
                        ).colorScheme.onSurface.withValues(alpha: 0.6),
                        fontSize: 14.sp,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 50.h),
                    StudentPrivilegesTable(
                      privileges: state.back.accessPrivileges,
                    ),
                    SizedBox(height: 40.h),
                  ],
                ),
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
