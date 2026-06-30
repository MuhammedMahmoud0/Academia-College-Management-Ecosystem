import 'package:flutter/material.dart';

class ChatBotWidgets {
  // ─── Icon Helper ──────────────────────────────────────────────────────────────

  static IconData iconFromName(String name) {
    switch (name) {
      case 'school':
        return Icons.school_outlined;
      case 'schedule':
        return Icons.schedule_outlined;
      case 'grade':
        return Icons.grade_outlined;
      case 'warning_amber':
        return Icons.warning_amber_outlined;
      case 'event_available':
        return Icons.event_available_outlined;
      case 'emoji_events':
        return Icons.emoji_events_outlined;
      case 'menu_book':
        return Icons.menu_book_outlined;
      case 'pause_circle':
        return Icons.pause_circle_outline;
      default:
        return Icons.help_outline;
    }
  }

  static Color colorFromHex(String hex) {
    final buffer = StringBuffer();
    if (hex.length == 7) buffer.write('ff');
    buffer.write(hex.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }
}
