import 'package:college_project/features/course_regestration/models/registration_response_model.dart';
import 'package:flutter/material.dart';

abstract class RegistrationStates {}

/// Error types for registration actions
enum RegistrationErrorType {
  timeConflict,
  alreadyRegistered,
  labAlreadyAssigned,
  courseFull,
  prerequisiteNotMet,
  creditLimitExceeded,
  registrationClosed,
  networkError,
  unauthorized,
  serverError,
  unknown,
}

/// Registration error with type and user-friendly message
class RegistrationError {
  final RegistrationErrorType type;
  final String message;
  final String title;

  RegistrationError({
    required this.type,
    required this.message,
    required this.title,
  });

  /// Get icon for error type
  IconData get icon {
    switch (type) {
      case RegistrationErrorType.timeConflict:
        return Icons.schedule;
      case RegistrationErrorType.alreadyRegistered:
        return Icons.check_circle_outline;
      case RegistrationErrorType.labAlreadyAssigned:
        return Icons.science_outlined;
      case RegistrationErrorType.courseFull:
        return Icons.groups;
      case RegistrationErrorType.prerequisiteNotMet:
        return Icons.lock_outline;
      case RegistrationErrorType.creditLimitExceeded:
        return Icons.school_outlined;
      case RegistrationErrorType.registrationClosed:
        return Icons.event_busy;
      case RegistrationErrorType.networkError:
        return Icons.wifi_off;
      case RegistrationErrorType.unauthorized:
        return Icons.logout;
      case RegistrationErrorType.serverError:
        return Icons.cloud_off;
      case RegistrationErrorType.unknown:
        return Icons.error_outline;
    }
  }

  /// Get color for error type
  Color get color {
    switch (type) {
      case RegistrationErrorType.timeConflict:
        return Colors.orange;
      case RegistrationErrorType.alreadyRegistered:
        return Colors.blue;
      case RegistrationErrorType.labAlreadyAssigned:
        return Colors.purple;
      case RegistrationErrorType.courseFull:
        return Colors.red;
      case RegistrationErrorType.prerequisiteNotMet:
        return Colors.amber;
      case RegistrationErrorType.creditLimitExceeded:
        return Colors.deepOrange;
      case RegistrationErrorType.registrationClosed:
        return Colors.grey;
      case RegistrationErrorType.networkError:
        return Colors.blueGrey;
      case RegistrationErrorType.unauthorized:
        return Colors.red;
      case RegistrationErrorType.serverError:
        return Colors.red;
      case RegistrationErrorType.unknown:
        return Colors.red;
    }
  }
}

class RegistrationInitialState extends RegistrationStates {}

class RegistrationLoadingState extends RegistrationStates {}

class RegistrationLoadedState extends RegistrationStates {
  final RegistrationResponseModel data;

  RegistrationLoadedState({required this.data});
}

class RegistrationErrorState extends RegistrationStates {
  final String error;

  RegistrationErrorState(this.error);
}

class RegistrationRefreshingState extends RegistrationStates {
  final RegistrationResponseModel data;

  RegistrationRefreshingState({required this.data});
}

// Action states for registering/dropping courses
class CourseActionLoadingState extends RegistrationStates {
  final RegistrationResponseModel data;
  final int? offeringId;

  CourseActionLoadingState({required this.data, this.offeringId});
}

class CourseRegisteredState extends RegistrationStates {
  final RegistrationResponseModel data;
  final String message;

  CourseRegisteredState({required this.data, required this.message});
}

class CourseDroppedState extends RegistrationStates {
  final RegistrationResponseModel data;
  final String message;

  CourseDroppedState({required this.data, required this.message});
}

class LabReregisteredState extends RegistrationStates {
  final RegistrationResponseModel data;
  final String message;

  LabReregisteredState({required this.data, required this.message});
}

class CourseActionErrorState extends RegistrationStates {
  final RegistrationResponseModel data;
  final RegistrationError error;

  CourseActionErrorState({required this.data, required this.error});
}
