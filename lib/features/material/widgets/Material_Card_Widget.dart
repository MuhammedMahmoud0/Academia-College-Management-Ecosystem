// ignore_for_file: must_be_immutable

import 'package:college_project/core/routing/app_routes.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/material/cubit/materials_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/materials_response_model.dart';

class MaterialCard extends StatefulWidget {
  final MaterialModel material;
  const MaterialCard({super.key, required this.material});

  @override
  State<MaterialCard> createState() => _MaterialCardState();
}

class _MaterialCardState extends State<MaterialCard> {
  bool isLoad = false;

  Future<void> _handleTap(BuildContext context) async {
    if (!isLoad) {
      isLoad = true;
      setState(() {});
      if (widget.material.isLink && widget.material.url != null) {
        final uri = Uri.parse(widget.material.url!);
        await launchUrl(uri);
      } else {
        // navigate to pdf screen
        String url = await context.read<MaterialsCubit>().getDownloadMaterial(
          materialId: widget.material.id,
        );
        debugPrint(url);
        GoRouter.of(context).pushNamed(AppRoutes.pdfScreenRoute, extra: url);
      }
    }
    isLoad = false;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    bool isFile = widget.material.isFile;

    return GestureDetector(
      onTap: () => _handleTap(context),
      child: Container(
        margin: EdgeInsets.only(bottom: 12.h),
        padding: EdgeInsets.all(12.w),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
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
                color: isFile
                    ? Theme.of(context).colorScheme.errorContainer
                    : AppColors.primaryColor.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Icon(
                isFile ? Icons.picture_as_pdf_rounded : Icons.language_rounded,
                color: isFile ? Colors.red : AppColors.primaryColor,
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
                    widget.material.title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14.sp,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  Row(
                    children: [
                      Text(
                        widget.material.formattedDate,
                        style: TextStyle(
                          fontSize: 10.sp,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                      if (isFile)
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 6.w),
                          width: 3.w,
                          height: 3.h,
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.outlineVariant,
                            shape: BoxShape.circle,
                          ),
                        ),
                      Text(
                        isFile ? widget.material.displaySize : '',
                        style: TextStyle(
                          fontSize: 10.sp,
                          color: Colors.grey.shade500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                  /*
                Text(
                  material.displayUrl,
                  style: TextStyle(
                    fontSize: 10.sp,
                    color: Colors.grey.shade500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
             */
                ],
              ),
            ),

            // Action Button
            Container(
              padding: EdgeInsets.all(8.w),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                shape: BoxShape.circle,
              ),
              child: isLoad
                  ? SizedBox(
                      height: 20.h,
                      width: 20.w,
                      child: CircularProgressIndicator(strokeWidth: 2.5.w),
                    )
                  : Icon(
                      isFile
                          ? Icons.arrow_forward_ios_rounded
                          : Icons.open_in_new_rounded,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                      size: 20.sp,
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
