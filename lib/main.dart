import 'package:college_project/core/routing/router_generation.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(390, 844),
      child: MaterialApp.router(
        title: 'Academia',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AppColors.backgroundColor,
          fontFamily: 'Poppins',
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primaryColor,
            brightness: Brightness.light,
          ),
        ),
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
  }
}
