import 'package:flutter/material.dart';

enum SnackBarType { success, error }

class Components {
  static showSnackBar(BuildContext context, String message, SnackBarType type) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: TextStyle(color: Colors.white)),
        backgroundColor: type == SnackBarType.success
            ? Colors.green
            : Colors.red,
      ),
    );
  }
}
