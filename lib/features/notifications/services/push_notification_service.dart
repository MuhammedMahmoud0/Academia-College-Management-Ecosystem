import 'dart:io';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:college_project/features/notifications/models/notification_model.dart';
import 'package:college_project/features/notifications/utils/notification_type_helper.dart';

/// Wraps [FlutterLocalNotificationsPlugin] so that WebSocket-pushed
/// notifications appear in the system tray exactly like WhatsApp / Email alerts.
class PushNotificationService {
  static final PushNotificationService _instance =
      PushNotificationService._internal();
  factory PushNotificationService() => _instance;
  PushNotificationService._internal();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  // Called once from main() before runApp
  Future<void> initialize() async {
    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );

    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    // Android 13+ requires explicit runtime permission
    if (Platform.isAndroid) {
      await _plugin
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >()
          ?.requestNotificationsPermission();
    }
  }

  /// Shows a system-tray notification styled for the given [notification].
  /// Uses a grouped channel per notification type (like WhatsApp grouping by chat).
  Future<void> show(NotificationModel notification) async {
    final typeTitle = NotificationTypeHelper.title(notification.type);
    final color = NotificationTypeHelper.color(notification.type);

    // Each notification type gets its own channel on Android
    // (appears as separate groups in the system shade)
    final channelId = 'college_${notification.type}';
    final channelName = typeTitle;

    final androidDetails = AndroidNotificationDetails(
      channelId,
      channelName,
      channelDescription: 'College app – $channelName',
      importance: Importance.high,
      priority: Priority.high,
      color: color,
      // Group key so notifications of the same type collapse together
      groupKey: channelId,
      styleInformation: BigTextStyleInformation(notification.message),
      category: AndroidNotificationCategory.message,
      enableLights: true,
      ledColor: color,
      ledOnMs: 1000,
      ledOffMs: 500,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _plugin.show(
      // Use the notification's own ID so duplicate pushes replace, not stack
      notification.id,
      typeTitle,
      notification.message,
      details,
      // Pass the notification ID as payload so taps can navigate to the right screen
      payload: notification.id.toString(),
    );
  }

  // ─── Tap handling ─────────────────────────────────────────────────────────

  /// Override this in your navigation layer to deep-link on tap.
  /// Example in main.dart:
  ///   PushNotificationService().onNotificationTap = (id) {
  ///     navigatorKey.currentState?.pushNamed('/notification/$id');
  ///   };
  void Function(int notificationId)? onNotificationTap;

  void _onNotificationTap(NotificationResponse response) {
    final id = int.tryParse(response.payload ?? '');
    if (id != null) onNotificationTap?.call(id);
  }
}
