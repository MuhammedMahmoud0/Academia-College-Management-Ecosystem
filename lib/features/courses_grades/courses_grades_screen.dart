// import 'package:college_project/core/styles/app_colors.dart';
// import 'package:college_project/core/styles/text_styles.dart';
// import 'package:flutter/material.dart';

// class CoursesGradesScreen extends StatelessWidget {
//   const CoursesGradesScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.backgroundColor,
//       body: SafeArea(
//         child: CustomScrollView(
//           physics: const BouncingScrollPhysics(),
//           slivers: [
//             // App Bar
//             SliverToBoxAdapter(
//               child: Padding(
//                 padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
//                 child: Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                   children: [
//                     Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text('My Courses', style: AppTextStyles.heading1),
//                         const SizedBox(height: 4),
//                         Text(
//                           'Current Semester',
//                           style: AppTextStyles.bodyMedium.copyWith(
//                             color: AppColors.subtitleColor,
//                           ),
//                         ),
//                       ],
//                     ),
//                     IconButton(
//                       onPressed: () {
//                         // Filter or search
//                       },
//                       icon: const Icon(
//                         Icons.filter_list_rounded,
//                         color: AppColors.textColor,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             // Content
//             SliverPadding(
//               padding: const EdgeInsets.symmetric(horizontal: 20),
//               sliver: SliverToBoxAdapter(
//                 child: Column(
//                   children: [
//                     _buildCourseCard(
//                       courseName: 'Database Systems',
//                       courseCode: 'CS 301',
//                       instructor: 'Dr. Ahmed Hassan',
//                       credits: 3,
//                       grade: 'A',
//                       progress: 0.75,
//                       color: AppColors.primaryColor,
//                     ),
//                     const SizedBox(height: 16),
//                     _buildCourseCard(
//                       courseName: 'Data Structures',
//                       courseCode: 'CS 202',
//                       instructor: 'Dr. Sarah Mohamed',
//                       credits: 4,
//                       grade: 'A-',
//                       progress: 0.60,
//                       color: AppColors.successColor,
//                     ),
//                     const SizedBox(height: 16),
//                     _buildCourseCard(
//                       courseName: 'Operating Systems',
//                       courseCode: 'CS 303',
//                       instructor: 'Dr. Omar Ali',
//                       credits: 3,
//                       grade: 'B+',
//                       progress: 0.80,
//                       color: AppColors.warningColor,
//                     ),
//                     const SizedBox(height: 16),
//                     _buildCourseCard(
//                       courseName: 'Computer Networks',
//                       courseCode: 'CS 304',
//                       instructor: 'Dr. Fatima Ibrahim',
//                       credits: 3,
//                       grade: 'A',
//                       progress: 0.55,
//                       color: AppColors.infoColor,
//                     ),
//                     const SizedBox(height: 100),
//                   ],
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildCourseCard({
//     required String courseName,
//     required String courseCode,
//     required String instructor,
//     required int credits,
//     required String grade,
//     required double progress,
//     required Color color,
//   }) {
//     return Container(
//       decoration: BoxDecoration(
//         color: AppColors.cardBackgroundColor,
//         borderRadius: BorderRadius.circular(16),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withValues(alpha: 0.05),
//             blurRadius: 10,
//             offset: const Offset(0, 2),
//           ),
//         ],
//       ),
//       child: Material(
//         color: Colors.transparent,
//         child: InkWell(
//           onTap: () {
//             // Navigate to course details
//           },
//           borderRadius: BorderRadius.circular(16),
//           child: Padding(
//             padding: const EdgeInsets.all(16),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Row(
//                   children: [
//                     Container(
//                       width: 48,
//                       height: 48,
//                       decoration: BoxDecoration(
//                         color: color.withValues(alpha: 0.1),
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                       child: Icon(
//                         Icons.menu_book_rounded,
//                         color: color,
//                         size: 24,
//                       ),
//                     ),
//                     const SizedBox(width: 12),
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(courseName, style: AppTextStyles.heading3),
//                           const SizedBox(height: 2),
//                           Text(
//                             courseCode,
//                             style: AppTextStyles.bodySmall.copyWith(
//                               color: AppColors.subtitleColor,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     Container(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 12,
//                         vertical: 6,
//                       ),
//                       decoration: BoxDecoration(
//                         color: color.withValues(alpha: 0.1),
//                         borderRadius: BorderRadius.circular(8),
//                       ),
//                       child: Text(
//                         grade,
//                         style: AppTextStyles.bodyMedium.copyWith(
//                           color: color,
//                           fontWeight: FontWeight.bold,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 16),
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.person_outline_rounded,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       instructor,
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: AppColors.subtitleColor,
//                       ),
//                     ),
//                     const SizedBox(width: 16),
//                     Icon(
//                       Icons.credit_card_rounded,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       '$credits Credits',
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: AppColors.subtitleColor,
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 12),
//                 Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Text(
//                           'Progress',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: AppColors.subtitleColor,
//                           ),
//                         ),
//                         Text(
//                           '${(progress * 100).toInt()}%',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: color,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 8),
//                     ClipRRect(
//                       borderRadius: BorderRadius.circular(4),
//                       child: LinearProgressIndicator(
//                         value: progress,
//                         backgroundColor: AppColors.backgroundColor,
//                         valueColor: AlwaysStoppedAnimation<Color>(color),
//                         minHeight: 6,
//                       ),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }
