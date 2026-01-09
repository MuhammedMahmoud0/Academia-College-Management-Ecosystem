import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../models/material_model.dart';

class MaterialCard extends StatelessWidget {
  final StudyMaterial material;
  final Color primaryColor;
  final VoidCallback? onTap;

  const MaterialCard({
    Key? key,
    required this.material,
    required this.primaryColor,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isPdf = material.type == StudyMaterialType.pdf;

    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Icon Box
          Container(
            height: 48.h,
            width: 48.w,
            decoration: BoxDecoration(
              color: (isPdf
                  ? Colors.red.shade50
                  : primaryColor.withOpacity(0.08)),
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Icon(
              isPdf ? Icons.picture_as_pdf_rounded : Icons.language_rounded,
              color: isPdf ? Colors.red : primaryColor,
              size: 24.sp,
            ),
          ),
          SizedBox(width: 12.w),

          // Info Section
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  material.title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14.sp,
                    color: Colors.black87,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4.h),
                Row(
                  children: [
                    Text(
                      material.date,
                      style: TextStyle(
                        fontSize: 10.sp,
                        color: Colors.grey.shade500,
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.symmetric(horizontal: 6.w),
                      width: 3.w,
                      height: 3.h,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Text(
                      material.sizeOrUrl,
                      style: TextStyle(
                        fontSize: 10.sp,
                        color: Colors.grey.shade500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Action Button
          GestureDetector(
            onTap: onTap,
            child: Container(
              padding: EdgeInsets.all(8.w),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F9FE),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isPdf
                    ? Icons.file_download_outlined
                    : Icons.open_in_new_rounded,
                color: Colors.grey.shade700,
                size: 20.sp,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
