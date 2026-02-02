import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/appCubit/app_states.dart';
import 'package:college_project/core/data/local/hive_storage_helper.dart';
import 'package:college_project/core/data/local/sharedpref_helper.dart';
import 'package:college_project/core/routing/router_generation.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/auth/cubit/auth_cubit.dart';
import 'package:college_project/generated/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SharedPrefHelper().init();
  await HiveStorageService.init();
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

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => AppCubit()..initSettings()),
        BlocProvider(create: (context) => AuthCubit()),
      ],
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
                colorScheme: ColorScheme.fromSeed(
                  seedColor: AppColors.primaryColor,
                  brightness: Brightness.dark,
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
    );
  }
}
