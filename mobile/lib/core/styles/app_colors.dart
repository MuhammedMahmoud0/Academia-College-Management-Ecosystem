import 'package:flutter/material.dart';

class AppColors {
  // Light Theme Colors
  static const Color primaryColor = Color(0xFF4B4EFC);
  static const Color primaryLight = Color(0xFFE8E8FF);

  // Light mode specific
  static const Color lightCardBackground = Colors.white;
  static const Color lightBackground = Color(0xFFF8F9FA);
  static const Color lightTextColor = Color(0xFF333333);
  static const Color lightSubtitleColor = Color(0xFF666666);
  static const Color lightBorderColor = Color(0xFFE0E0E0);

  // Dark mode specific
  static const Color darkCardBackground = Color(0xFF1E1E2E);
  static const Color darkBackground = Color(0xFF121218);
  static const Color darkTextColor = Color(0xFFF5F5F5);
  static const Color darkSubtitleColor = Color(0xFFB0B0B0);
  static const Color darkBorderColor = Color(0xFF3D3D4E);

  // Default colors (light mode - for backwards compatibility)
  static const Color cardBackgroundColor = lightCardBackground;
  static const Color backgroundColor = lightBackground;
  static const Color textColor = lightTextColor;
  static const Color subtitleColor = lightSubtitleColor;
  static const Color borderColor = lightBorderColor;

  // Additional colors for grades and status (same for both themes)
  static const Color successColor = Color(0xFF22C55E);
  static const Color warningColor = Color(0xFFF59E0B);
  static const Color errorColor = Color(0xFFEF4444);
  static const Color infoColor = Color(0xFF3B82F6);

  // Theme-aware getters
  static Color getCardBackground(bool isDark) =>
      isDark ? darkCardBackground : lightCardBackground;

  static Color getBackground(bool isDark) =>
      isDark ? darkBackground : lightBackground;

  static Color getTextColor(bool isDark) =>
      isDark ? darkTextColor : lightTextColor;

  static Color getSubtitleColor(bool isDark) =>
      isDark ? darkSubtitleColor : lightSubtitleColor;

  static Color getBorderColor(bool isDark) =>
      isDark ? darkBorderColor : lightBorderColor;
}
