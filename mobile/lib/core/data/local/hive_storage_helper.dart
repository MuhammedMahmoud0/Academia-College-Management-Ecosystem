import 'package:college_project/features/home/models/student_profile_model.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter/material.dart';

class HiveStorageService {
  static const String studentBoxName = 'student_box';
  static const String studentKey = 'current_student_profile';

  /// Initialize Hive and Register Adapters
  static Future<void> init() async {
    await Hive.initFlutter();

    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(StudentProfileModelAdapter());
      debugPrint('✅ StudentProfileModel adapter registered');
    }

    await Hive.openBox<StudentProfileModel>(studentBoxName);
    debugPrint('✅ Hive box opened: $studentBoxName');
  }

  /// Save student data locally
  static Future<void> saveStudent(StudentProfileModel student) async {
    try {
      final box = Hive.box<StudentProfileModel>(studentBoxName);
      await box.put(studentKey, student);
      debugPrint('✅ Student data saved to Hive');
      debugPrint('   - Name: ${student.name}');
      debugPrint('   - Email: ${student.email}');
      debugPrint('   - Student ID: ${student.studentId}');

      // Verify it was saved
      final saved = box.get(studentKey);
      if (saved != null) {
        debugPrint('✅ Verification: Data successfully retrieved from Hive');
      } else {
        debugPrint('❌ Verification failed: Data not found in Hive');
      }
    } catch (e) {
      debugPrint('❌ Error saving to Hive: $e');
      rethrow;
    }
  }

  /// Retrieve student data for offline use
  static StudentProfileModel? getStudent() {
    try {
      final box = Hive.box<StudentProfileModel>(studentBoxName);
      final student = box.get(studentKey);

      if (student != null) {
        debugPrint('✅ Student data retrieved from Hive');
        debugPrint('   - Name: ${student.name}');
        debugPrint('   - Email: ${student.email}');
      } else {
        debugPrint('⚠️ No student data found in Hive');
      }

      return student;
    } catch (e) {
      debugPrint('❌ Error retrieving from Hive: $e');
      return null;
    }
  }

  /// Clear data on logout
  static Future<void> clearAll() async {
    try {
      final box = Hive.box<StudentProfileModel>(studentBoxName);
      await box.clear();
      debugPrint('✅ Hive data cleared successfully');
    } catch (e) {
      debugPrint('❌ Error clearing Hive: $e');
      rethrow;
    }
  }

  /// Check if student data exists
  static bool hasStudentData() {
    try {
      final box = Hive.box<StudentProfileModel>(studentBoxName);
      final hasData = box.containsKey(studentKey);
      debugPrint('Hive contains student data: $hasData');
      return hasData;
    } catch (e) {
      debugPrint('❌ Error checking Hive: $e');
      return false;
    }
  }

  /// Get all keys in the box (for debugging)
  static void printAllKeys() {
    try {
      final box = Hive.box<StudentProfileModel>(studentBoxName);
      debugPrint('All keys in Hive box: ${box.keys.toList()}');
      debugPrint('Total items in box: ${box.length}');
    } catch (e) {
      debugPrint('❌ Error printing keys: $e');
    }
  }
}
