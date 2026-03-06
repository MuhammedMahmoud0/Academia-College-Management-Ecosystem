import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/course_regestration/cubit/registration_states.dart';
import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:college_project/features/course_regestration/repo/registration_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class RegistrationCubit extends Cubit<RegistrationStates> {
  RegistrationCubit() : super(RegistrationInitialState());

  static RegistrationCubit get(BuildContext context) =>
      BlocProvider.of(context);

  final RegistrationRepo _repo = RegistrationRepo();

  RegistrationResponseModel? registrationData;
  String _searchQuery = '';

  /// Parse API error and return user-friendly message with error type
  RegistrationError _parseError(ApiException e) {
    final message = e.message.toLowerCase();
    final statusCode = e.statusCode;

    // Time conflict errors
    if (message.contains('conflict') || message.contains('overlaps')) {
      return RegistrationError(
        type: RegistrationErrorType.timeConflict,
        message: e.message,
        title: 'Schedule Conflict',
      );
    }

    // Already registered errors
    if (message.contains('already registered') ||
        message.contains('already enrolled')) {
      return RegistrationError(
        type: RegistrationErrorType.alreadyRegistered,
        message: e.message,
        title: 'Already Registered',
      );
    }

    // Lab already assigned
    if (message.contains('already have a lab')) {
      return RegistrationError(
        type: RegistrationErrorType.labAlreadyAssigned,
        message: e.message,
        title: 'Lab Already Assigned',
      );
    }

    // Course full
    if (message.contains('full') || message.contains('no seats')) {
      return RegistrationError(
        type: RegistrationErrorType.courseFull,
        message: e.message,
        title: 'Course Full',
      );
    }

    // Prerequisites not met
    if (message.contains('prerequisite') || message.contains('pre-requisite')) {
      return RegistrationError(
        type: RegistrationErrorType.prerequisiteNotMet,
        message: e.message,
        title: 'Prerequisites Required',
      );
    }

    // Credit limit exceeded
    if (message.contains('credit') && message.contains('limit') ||
        message.contains('maximum credit')) {
      return RegistrationError(
        type: RegistrationErrorType.creditLimitExceeded,
        message: e.message,
        title: 'Credit Limit Exceeded',
      );
    }

    // Registration closed
    if (message.contains('closed') || message.contains('not open')) {
      return RegistrationError(
        type: RegistrationErrorType.registrationClosed,
        message: e.message,
        title: 'Registration Closed',
      );
    }

    // Network/connection errors
    if (message.contains('timeout') ||
        message.contains('connection') ||
        message.contains('internet')) {
      return RegistrationError(
        type: RegistrationErrorType.networkError,
        message: e.message,
        title: 'Connection Error',
      );
    }

    // Unauthorized
    if (statusCode == 401) {
      return RegistrationError(
        type: RegistrationErrorType.unauthorized,
        message: 'Your session has expired. Please login again.',
        title: 'Session Expired',
      );
    }

    // Server error
    if (statusCode != null && statusCode >= 500) {
      return RegistrationError(
        type: RegistrationErrorType.serverError,
        message: 'Server is temporarily unavailable. Please try again later.',
        title: 'Server Error',
      );
    }

    // Default error
    return RegistrationError(
      type: RegistrationErrorType.unknown,
      message: e.message,
      title: 'Error',
    );
  }

  /// Get available course offerings
  Future<void> getAvailableOfferings() async {
    emit(RegistrationLoadingState());
    try {
      registrationData = await _repo.getAvailableOfferings();
      emit(RegistrationLoadedState(data: registrationData!));
    } on ApiException catch (e) {
      debugPrint('Get offerings failed: $e');
      emit(RegistrationErrorState(e.message));
    } catch (e) {
      debugPrint('Get offerings failed: $e');
      emit(RegistrationErrorState('Failed to load available courses'));
    }
  }

  /// Refresh course offerings
  Future<void> refreshOfferings() async {
    if (registrationData == null) {
      return getAvailableOfferings();
    }

    emit(RegistrationRefreshingState(data: registrationData!));
    try {
      registrationData = await _repo.getAvailableOfferings();
      emit(RegistrationLoadedState(data: registrationData!));
    } on ApiException catch (e) {
      debugPrint('Refresh offerings failed: $e');
      emit(RegistrationErrorState(e.message));
    } catch (e) {
      debugPrint('Refresh offerings failed: $e');
      emit(RegistrationErrorState('Failed to refresh courses'));
    }
  }

  /// Register for selected courses
  Future<void> registerCourses({
    required List<int> lectureIds,
    required List<int> labIds,
  }) async {
    if (registrationData == null) return;

    emit(CourseActionLoadingState(data: registrationData!));
    try {
      await _repo.registerCourses(lectureIds: lectureIds, labIds: labIds);
      registrationData = await _repo.getAvailableOfferings();
      emit(
        CourseRegisteredState(
          data: registrationData!,
          message: 'Successfully registered for courses',
        ),
      );
    } on ApiException catch (e) {
      debugPrint('Register courses failed: $e');
      emit(
        CourseActionErrorState(data: registrationData!, error: _parseError(e)),
      );
    } catch (e) {
      debugPrint('Register courses failed: $e');
      emit(
        CourseActionErrorState(
          data: registrationData!,
          error: RegistrationError(
            type: RegistrationErrorType.unknown,
            message: 'Failed to register for courses',
            title: 'Error',
          ),
        ),
      );
    }
  }

  /// Register for a single course with lecture and optional lab
  Future<void> registerSingleCourse({
    required int lectureId,
    int? labId,
  }) async {
    if (registrationData == null) return;

    emit(CourseActionLoadingState(data: registrationData!));
    try {
      await _repo.registerCourses(
        lectureIds: [lectureId],
        labIds: labId != null ? [labId] : [],
      );
      registrationData = await _repo.getAvailableOfferings();
      emit(
        CourseRegisteredState(
          data: registrationData!,
          message: 'Successfully registered for course',
        ),
      );
    } on ApiException catch (e) {
      debugPrint('Register course failed: $e');
      emit(
        CourseActionErrorState(data: registrationData!, error: _parseError(e)),
      );
    } catch (e) {
      debugPrint('Register course failed: $e');
      emit(
        CourseActionErrorState(
          data: registrationData!,
          error: RegistrationError(
            type: RegistrationErrorType.unknown,
            message: 'Failed to register for course',
            title: 'Error',
          ),
        ),
      );
    }
  }

  /// Re-register for a different lab
  Future<void> reregisterLab({
    required int lectureId,
    required int labId,
    required int oldLabId,
  }) async {
    if (registrationData == null) return;

    emit(CourseActionLoadingState(data: registrationData!));
    try {
      await _repo.reregisterLab(
        lectureId: lectureId,
        labId: labId,
        oldLabId: oldLabId,
      );
      registrationData = await _repo.getAvailableOfferings();
      emit(
        LabReregisteredState(
          data: registrationData!,
          message: 'Successfully changed lab group',
        ),
      );
    } on ApiException catch (e) {
      debugPrint('Reregister lab failed: $e');
      emit(
        CourseActionErrorState(data: registrationData!, error: _parseError(e)),
      );
    } catch (e) {
      debugPrint('Reregister lab failed: $e');
      emit(
        CourseActionErrorState(
          data: registrationData!,
          error: RegistrationError(
            type: RegistrationErrorType.unknown,
            message: 'Failed to change lab group',
            title: 'Error',
          ),
        ),
      );
    }
  }

  /// Drop/unregister a course
  Future<void> dropCourse({required int lectureId}) async {
    if (registrationData == null) return;

    emit(CourseActionLoadingState(data: registrationData!));
    try {
      await _repo.dropCourse(lectureId: lectureId);
      registrationData = await _repo.getAvailableOfferings();
      emit(
        CourseDroppedState(
          data: registrationData!,
          message: 'Successfully dropped course',
        ),
      );
    } on ApiException catch (e) {
      debugPrint('Drop course failed: $e');
      emit(
        CourseActionErrorState(data: registrationData!, error: _parseError(e)),
      );
    } catch (e) {
      debugPrint('Drop course failed: $e');
      emit(
        CourseActionErrorState(
          data: registrationData!,
          error: RegistrationError(
            type: RegistrationErrorType.unknown,
            message: 'Failed to drop course',
            title: 'Error',
          ),
        ),
      );
    }
  }

  /// Update search query
  void updateSearchQuery(String query) {
    _searchQuery = query.toLowerCase();
    if (registrationData != null) {
      emit(RegistrationLoadedState(data: registrationData!));
    }
  }

  /// Get current semester
  String get currentSemester => registrationData?.semester ?? 'N/A';

  /// Get all offerings
  List<CourseOffering> get allOfferings => registrationData?.offerings ?? [];

  /// Get filtered offerings based on search query
  List<CourseOffering> get filteredOfferings {
    if (_searchQuery.isEmpty) return allOfferings;

    return allOfferings.where((offering) {
      return offering.courseName.toLowerCase().contains(_searchQuery) ||
          offering.courseCode.toLowerCase().contains(_searchQuery);
    }).toList();
  }

  /// Get registered courses (courses with enrolled lectures)
  List<CourseOffering> get registeredCourses {
    return allOfferings
        .where((offering) => offering.hasEnrolledLecture)
        .toList();
  }

  /// Get available courses (courses without enrolled lectures)
  List<CourseOffering> get availableCourses {
    final filtered = _searchQuery.isEmpty
        ? allOfferings
        : allOfferings.where((offering) {
            return offering.courseName.toLowerCase().contains(_searchQuery) ||
                offering.courseCode.toLowerCase().contains(_searchQuery);
          }).toList();

    return filtered.where((offering) => !offering.hasEnrolledLecture).toList();
  }

  /// Get total registered credit hours
  int get totalRegisteredCredits {
    return registeredCourses.fold(0, (sum, course) => sum + course.creditHours);
  }
}
