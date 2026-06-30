import 'package:college_project/core/appCubit/app_states.dart';
import 'package:college_project/core/constants/constants.dart';
import 'package:college_project/core/data/local/sharedpref_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AppCubit extends Cubit<AppStates> {
  AppCubit() : super(AppInitialState());

  static AppCubit get(BuildContext context) => BlocProvider.of(context);

  final _prefs = SharedPrefHelper();

  // Current settings
  bool _isDarkMode = false;
  String _languageCode = 'en';

  bool get isDarkMode => _isDarkMode;
  String get languageCode => _languageCode;
  Locale get currentLocale => Locale(_languageCode);

  // Initialize settings from SharedPreferences
  void initSettings() {
    _isDarkMode = _prefs.getBool(Constants.themeKey);
    _languageCode = _prefs.getString(Constants.languageKey, defaultValue: 'en');
    emit(AppInitialState());
  }

  // Toggle theme
  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    await _prefs.setBool(Constants.themeKey, _isDarkMode);
    emit(AppThemeChangedState());
  }

  // Set specific theme
  Future<void> setTheme(bool isDark) async {
    if (_isDarkMode == isDark) return;
    _isDarkMode = isDark;
    await _prefs.setBool(Constants.themeKey, _isDarkMode);
    emit(AppThemeChangedState());
  }

  // Change language
  Future<void> changeLanguage(String langCode) async {
    if (_languageCode == langCode) return;
    _languageCode = langCode;
    await _prefs.setString(Constants.languageKey, _languageCode);
    emit(AppLanguageChangedState());
  }

  // Notify profile updated to trigger rebuilds
  void notifyProfileUpdated() {
    emit(AppProfileUpdatedState());
  }
}
