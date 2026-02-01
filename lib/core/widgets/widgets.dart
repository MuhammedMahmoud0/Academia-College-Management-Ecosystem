import 'package:cached_network_image/cached_network_image.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:flutter/material.dart';

class Widgets {
  static CachedNetworkImage defaultImage(
    String url, {
    BoxFit fit = BoxFit.cover,
    double? width,
    double? height,
  }) {
    return CachedNetworkImage(
      imageUrl: url,
      fit: fit,
      width: width,
      height: height,
      placeholder: (context, url) =>
          const Center(child: CircularProgressIndicator()),
      errorWidget: (context, url, error) =>
          const Icon(Icons.error, color: Colors.red),
    );
  }

  static Widget buildTextField({
    required TextEditingController controller,
    TextInputAction? textInputAction,

    String? label,
    String? hint,
    required IconData icon,
    required bool isDark,
    Function()? onSuffixPressed,
    IconData? suffixIcon,
    bool? obscureText,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType ?? TextInputType.text,
      validator: validator,
      textInputAction: textInputAction ?? TextInputAction.next,
      obscureText: obscureText ?? false,
      style: TextStyle(color: AppColors.getTextColor(isDark)),
      decoration: InputDecoration(
        labelText: label,

        hintText: hint,
        labelStyle: TextStyle(color: AppColors.getSubtitleColor(isDark)),
        prefixIcon: Icon(icon, color: AppColors.primaryColor),
        suffixIcon: suffixIcon != null
            ? IconButton(onPressed: onSuffixPressed, icon: Icon(suffixIcon))
            : null,
        filled: true,
        fillColor: AppColors.getCardBackground(isDark),

        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.getBorderColor(isDark)),
        ),

        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.getBorderColor(isDark)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primaryColor, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.errorColor),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.errorColor, width: 2),
        ),
      ),
    );
  }
}
