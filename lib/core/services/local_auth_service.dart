import 'package:flutter/services.dart';
import 'package:local_auth/error_codes.dart' as auth_error;
import 'package:local_auth/local_auth.dart';

/// Thin wrapper around [LocalAuthentication] used to gate access to the app
/// with biometrics (fingerprint / Face ID) or the device PIN/passcode.
class LocalAuthService {
  LocalAuthService._();
  static final LocalAuthService instance = LocalAuthService._();

  final LocalAuthentication _auth = LocalAuthentication();

  /// Whether the device can perform any kind of local authentication
  /// (biometric OR device credential).
  Future<bool> canAuthenticate() async {
    try {
      final isSupported = await _auth.isDeviceSupported();
      final canCheckBiometrics = await _auth.canCheckBiometrics;
      return isSupported || canCheckBiometrics;
    } on PlatformException {
      return false;
    }
  }

  /// Prompts the user for biometric / device-credential authentication.
  ///
  /// Returns `true` when the user is authenticated. When the device has no
  /// biometrics or screen-lock configured we return `true` as well, so the
  /// user is never locked out of their own account.
  Future<bool> authenticate({
    required String reason,
  }) async {
    try {
      return await _auth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          // Allow falling back to the device PIN/pattern/passcode so users
          // without enrolled biometrics can still get in.
          biometricOnly: false,
        ),
      );
    } on PlatformException catch (e) {
      // If there is nothing to authenticate against, don't block the user.
      if (e.code == auth_error.notAvailable ||
          e.code == auth_error.notEnrolled ||
          e.code == auth_error.passcodeNotSet) {
        return true;
      }
      // lockedOut / permanentlyLockedOut / userCanceled / etc. → deny.
      return false;
    }
  }
}
