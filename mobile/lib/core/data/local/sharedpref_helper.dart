import 'package:shared_preferences/shared_preferences.dart';

class SharedPrefHelper {
  static final SharedPrefHelper _instance = SharedPrefHelper._internal();
  factory SharedPrefHelper() => _instance;
  SharedPrefHelper._internal();

  late final SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Getters
  bool getBool(String key, {bool defaultValue = false}) =>
      _prefs.getBool(key) ?? defaultValue;

  int getInt(String key, {int defaultValue = 0}) =>
      _prefs.getInt(key) ?? defaultValue;

  double getDouble(String key, {double defaultValue = 0.0}) =>
      _prefs.getDouble(key) ?? defaultValue;

  String getString(String key, {String defaultValue = ''}) =>
      _prefs.getString(key) ?? defaultValue;

  List<String> getStringList(
    String key, {
    List<String> defaultValue = const [],
  }) {
    return _prefs.getStringList(key) ?? defaultValue;
  }

  // Setters
  Future<void> setBool(String key, bool value) async =>
      await _prefs.setBool(key, value);

  Future<void> setInt(String key, int value) async =>
      await _prefs.setInt(key, value);

  Future<void> setDouble(String key, double value) async =>
      await _prefs.setDouble(key, value);

  Future<void> setString(String key, String value) async =>
      await _prefs.setString(key, value);

  Future<void> setStringList(String key, List<String> value) async =>
      await _prefs.setStringList(key, value);

  // Remove
  Future<void> remove(String key) async => await _prefs.remove(key);

  // Clear all
  Future<void> clear() async => await _prefs.clear();

  // Check if key exists
  bool containsKey(String key) => _prefs.containsKey(key);
}
