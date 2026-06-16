import 'dart:async';

import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/appCubit/app_states.dart';
import 'package:college_project/core/data/local/hive_storage_helper.dart';
import 'package:college_project/core/data/local/sharedpref_helper.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/routing/router_generation.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';
import 'package:college_project/features/auth/login/cubit/auth_cubit.dart';
import 'package:college_project/features/auth/login/cubit/auth_states.dart';
import 'package:college_project/features/notifications/cubit/notification_cubit.dart';
import 'package:college_project/features/notifications/services/push_notification_service.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SharedPrefHelper().init();
  await HiveStorageService.init();
  // Set up the persistent cookie jar before any request so the refresh-token
  // cookie is captured at login and resent on /auth/refresh.
  await ApiClient().initCookieJar();

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // Local notifications plugin used by both the WS path AND the FCM
  // foreground/background paths to render system-tray notifications.
  await PushNotificationService().initialize();
  PushNotificationService().onNotificationTap = (notifId) {
    RouterGenerationConfig.goRouter.pushNamed(AppRoutes.notificationScreen);
  };

  // FCM background-isolate handler — MUST be a top-level function annotated
  // with @pragma('vm:entry-point') so it survives tree-shaking in release
  // builds. See [_firebaseMessagingBackgroundHandler] below.
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // iOS / Android 13+: ensure system-level permission. Calling this here
  // (alongside the in-login permission request) means push works even for
  // users who skip the FCM-token registration code path.
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
  );

  // iOS: show notifications while the app is in the foreground.
  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
    alert: true,
    badge: true,
    sound: true,
  );

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const MyApp());
}

/// Background / terminated FCM handler. Runs in its own Dart isolate, so
/// it must re-initialise Firebase and the local-notification plugin.
///
/// If the server sends a `notification` payload, Android auto-renders it
/// system-tray. For data-only payloads we render via flutter_local_notifications
/// so the user still sees something when the app is closed.
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // If FCM already carried a notification block, the system shows it for us.
  if (message.notification != null) {
    debugPrint('[FCM-bg] notification payload auto-displayed');
    return;
  }

  final data = message.data;
  final body = data['message']?.toString() ?? data['body']?.toString() ?? '';
  if (body.isEmpty) return;

  final title = data['title']?.toString() ?? 'New notification';
  final type = data['type']?.toString() ?? 'default';
  final idStr = data['id']?.toString() ?? data['notificationId']?.toString();
  final id =
      int.tryParse(idStr ?? '') ??
      DateTime.now().millisecondsSinceEpoch.remainder(1 << 31);

  final plugin = FlutterLocalNotificationsPlugin();
  const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
  const iosInit = DarwinInitializationSettings();
  await plugin.initialize(
    settings: const InitializationSettings(android: androidInit, iOS: iosInit),
  );

  final androidDetails = AndroidNotificationDetails(
    'college_$type',
    'College – $type',
    channelDescription: 'College app – $type',
    importance: Importance.high,
    priority: Priority.high,
    styleInformation: BigTextStyleInformation(body),
  );
  const iosDetails = DarwinNotificationDetails();

  await plugin.show(
    id: id,
    title: title,
    body: body,
    notificationDetails: NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    ),
    payload: idStr,
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final NotificationsCubit _notificationsCubit = NotificationsCubit();
  StreamSubscription<RemoteMessage>? _fcmForegroundSub;
  StreamSubscription<RemoteMessage>? _fcmOpenedSub;
  StreamSubscription<String>? _fcmTokenSub;

  @override
  void initState() {
    super.initState();
    _bootstrapRealtime();
    _wireFcm();
  }

  // If the app starts with a valid token (returning user), open the WS
  // connection right away so notifications stream in before any login event.
  Future<void> _bootstrapRealtime() async {
    final token = await const FlutterSecureStorage().read(key: 'token');
    if (token != null && token.isNotEmpty) {
      // Prime Dio before any HTTP call — otherwise REST requests race
      // splash's tryAutoLogin and go out unauthenticated.
      ApiClient().setToken(token);
      // Open the WS early so push events stream in before AuthSuccess fires.
      // The unread-count REST pull is intentionally NOT done here — it's
      // already triggered by the AuthSuccess listener below, and doubling it
      // up just produces a duplicate "Unread count" log and a wasted call.
      await _notificationsCubit.startRealtime(token);
    }
  }

  /// Foreground messages, taps that brought the app from background, and
  /// the cold-start tap (`getInitialMessage`) all funnel through the cubit
  /// so the badge / list stay in sync.
  Future<void> _wireFcm() async {
    _fcmForegroundSub = FirebaseMessaging.onMessage.listen((message) {
      debugPrint('[FCM-fg] ${message.messageId}  data=${message.data}');
      _notificationsCubit.onFcmMessageReceived(message);
    });

    _fcmOpenedSub = FirebaseMessaging.onMessageOpenedApp.listen((message) {
      debugPrint('[FCM-tap] ${message.messageId}  data=${message.data}');
      _notificationsCubit.onFcmMessageReceived(message);
      _navigateToNotifications();
    });

    final initial = await FirebaseMessaging.instance.getInitialMessage();
    if (initial != null) {
      debugPrint('[FCM-cold-tap] ${initial.messageId}');
      _notificationsCubit.onFcmMessageReceived(initial);
      // Defer until the router is mounted.
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _navigateToNotifications(),
      );
    }

    // Keep backend FCM token fresh — server may have refreshed the token.
    _fcmTokenSub = FirebaseMessaging.instance.onTokenRefresh.listen((token) {
      debugPrint('[FCM] token refreshed: $token');
      // The auth feature is responsible for posting this to /register-device.
      // We surface the event via debug log; wiring it to the repo can be added
      // alongside the existing AuthRepo.updateFCMToken call if desired.
    });
  }

  void _navigateToNotifications() {
    try {
      RouterGenerationConfig.goRouter.pushNamed(AppRoutes.notificationScreen);
    } catch (e) {
      debugPrint('[FCM] navigation failed: $e');
    }
  }

  @override
  void dispose() {
    _fcmForegroundSub?.cancel();
    _fcmOpenedSub?.cancel();
    _fcmTokenSub?.cancel();
    _notificationsCubit.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => AppCubit()..initSettings()),
        BlocProvider(create: (context) => AuthCubit()),
        BlocProvider.value(value: _notificationsCubit),
      ],
      child: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) async {
          if (state is AuthSuccess) {
            final token = await const FlutterSecureStorage().read(key: 'token');
            if (!context.mounted) return;
            if (token != null && token.isNotEmpty) {
              await context.read<NotificationsCubit>().startRealtime(token);
              if (!context.mounted) return;
              context.read<NotificationsCubit>().getUnreadCount();
            }
          } else if (state is AuthInitial || state is AuthTokenExpired) {
            context.read<NotificationsCubit>().stopRealtime();
            RouterGenerationConfig.goRouter.goNamed(AppRoutes.loginScreen);
          }
        },
        child: BlocBuilder<AppCubit, AppStates>(
          builder: (context, state) {
            final appCubit = AppCubit.get(context);
            final isDark = appCubit.isDarkMode;

            return ScreenUtilInit(
              designSize: const Size(390, 844),
              child: MaterialApp.router(
                title: 'Academia',
                debugShowCheckedModeBanner: false,
                theme: ThemeData(
                  useMaterial3: true,
                  scaffoldBackgroundColor: AppColors.getBackground(false),
                  fontFamily: 'Poppins',
                  brightness: Brightness.light,
                  colorScheme: ColorScheme.fromSeed(
                    seedColor: AppColors.primaryColor,
                    brightness: Brightness.light,
                  ),
                ),
                darkTheme: ThemeData(
                  useMaterial3: true,
                  scaffoldBackgroundColor: AppColors.getBackground(true),
                  fontFamily: 'Poppins',
                  brightness: Brightness.dark,
                  appBarTheme: const AppBarTheme(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.white,
                    elevation: 0,
                  ),
                  colorScheme: ColorScheme.fromSeed(
                    seedColor: AppColors.primaryColor,
                    brightness: Brightness.dark,
                    surface: const Color(0xFF1E1E2E),
                    onSurface: Colors.white,
                  ),
                ),
                themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
                locale: appCubit.currentLocale,
                localizationsDelegates: [
                  S.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
                supportedLocales: S.delegate.supportedLocales,
                routerConfig: RouterGenerationConfig.goRouter,
              ),
            );
          },
        ),
      ),
    );
  }
}
