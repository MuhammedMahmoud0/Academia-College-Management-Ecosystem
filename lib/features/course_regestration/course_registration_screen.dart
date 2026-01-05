// import 'package:college_project/core/styles/app_colors.dart';
// import 'package:college_project/core/styles/text_styles.dart';
// import 'package:flutter/material.dart';

// class CourseRegistrationScreen extends StatelessWidget {
//   const CourseRegistrationScreen({super.key});

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
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text('Course Registration', style: AppTextStyles.heading1),
//                     const SizedBox(height: 4),
//                     Text(
//                       'Spring 2025 Semester',
//                       style: AppTextStyles.bodyMedium.copyWith(
//                         color: AppColors.subtitleColor,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             // Registration Status Card
//             SliverToBoxAdapter(
//               child: Padding(
//                 padding: const EdgeInsets.symmetric(horizontal: 20),
//                 child: Container(
//                   padding: const EdgeInsets.all(16),
//                   decoration: BoxDecoration(
//                     gradient: LinearGradient(
//                       colors: [
//                         AppColors.primaryColor,
//                         AppColors.primaryColor.withValues(alpha: 0.8),
//                       ],
//                       begin: Alignment.topLeft,
//                       end: Alignment.bottomRight,
//                     ),
//                     borderRadius: BorderRadius.circular(16),
//                     boxShadow: [
//                       BoxShadow(
//                         color: AppColors.primaryColor.withValues(alpha: 0.3),
//                         blurRadius: 10,
//                         offset: const Offset(0, 4),
//                       ),
//                     ],
//                   ),
//                   child: Column(
//                     children: [
//                       Row(
//                         children: [
//                           Container(
//                             padding: const EdgeInsets.all(12),
//                             decoration: BoxDecoration(
//                               color: Colors.white.withValues(alpha: 0.2),
//                               borderRadius: BorderRadius.circular(12),
//                             ),
//                             child: const Icon(
//                               Icons.calendar_month_rounded,
//                               color: Colors.white,
//                               size: 24,
//                             ),
//                           ),
//                           const SizedBox(width: 12),
//                           Expanded(
//                             child: Column(
//                               crossAxisAlignment: CrossAxisAlignment.start,
//                               children: [
//                                 const Text(
//                                   'Registration Period',
//                                   style: TextStyle(
//                                     color: Colors.white,
//                                     fontSize: 16,
//                                     fontWeight: FontWeight.bold,
//                                   ),
//                                 ),
//                                 const SizedBox(height: 4),
//                                 Text(
//                                   'Jan 15 - Jan 30, 2025',
//                                   style: TextStyle(
//                                     color: Colors.white.withValues(alpha: 0.9),
//                                     fontSize: 14,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ],
//                       ),
//                       const SizedBox(height: 16),
//                       Row(
//                         mainAxisAlignment: MainAxisAlignment.spaceAround,
//                         children: [
//                           _buildStatItem('Min Credits', '12'),
//                           Container(
//                             width: 1,
//                             height: 30,
//                             color: Colors.white.withValues(alpha: 0.3),
//                           ),
//                           _buildStatItem('Max Credits', '18'),
//                           Container(
//                             width: 1,
//                             height: 30,
//                             color: Colors.white.withValues(alpha: 0.3),
//                           ),
//                           _buildStatItem('Selected', '0'),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),

//             // Available Courses Section
//             SliverToBoxAdapter(
//               child: Padding(
//                 padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
//                 child: Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                   children: [
//                     Text('Available Courses', style: AppTextStyles.heading2),
//                     IconButton(
//                       onPressed: () {
//                         // Filter courses
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

//             // Course List
//             SliverPadding(
//               padding: const EdgeInsets.symmetric(horizontal: 20),
//               sliver: SliverList(
//                 delegate: SliverChildListDelegate([
//                   _buildAvailableCourseCard(
//                     courseName: 'Software Engineering',
//                     courseCode: 'CS 401',
//                     instructor: 'Dr. Ahmed Hassan',
//                     credits: 3,
//                     availableSeats: 15,
//                     totalSeats: 30,
//                     schedule: 'Sun, Tue 10:00 AM',
//                   ),
//                   const SizedBox(height: 12),
//                   _buildAvailableCourseCard(
//                     courseName: 'Artificial Intelligence',
//                     courseCode: 'CS 402',
//                     instructor: 'Dr. Sarah Mohamed',
//                     credits: 4,
//                     availableSeats: 5,
//                     totalSeats: 25,
//                     schedule: 'Mon, Wed 2:00 PM',
//                   ),
//                   const SizedBox(height: 12),
//                   _buildAvailableCourseCard(
//                     courseName: 'Mobile Development',
//                     courseCode: 'CS 403',
//                     instructor: 'Dr. Omar Ali',
//                     credits: 3,
//                     availableSeats: 0,
//                     totalSeats: 20,
//                     schedule: 'Sun, Tue 12:00 PM',
//                   ),
//                   const SizedBox(height: 12),
//                   _buildAvailableCourseCard(
//                     courseName: 'Web Development',
//                     courseCode: 'CS 404',
//                     instructor: 'Dr. Fatima Ibrahim',
//                     credits: 3,
//                     availableSeats: 20,
//                     totalSeats: 30,
//                     schedule: 'Mon, Wed 10:00 AM',
//                   ),
//                   const SizedBox(height: 100),
//                 ]),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildStatItem(String label, String value) {
//     return Column(
//       children: [
//         Text(
//           value,
//           style: const TextStyle(
//             color: Colors.white,
//             fontSize: 20,
//             fontWeight: FontWeight.bold,
//           ),
//         ),
//         const SizedBox(height: 4),
//         Text(
//           label,
//           style: TextStyle(
//             color: Colors.white.withValues(alpha: 0.8),
//             fontSize: 12,
//           ),
//         ),
//       ],
//     );
//   }

//   Widget _buildAvailableCourseCard({
//     required String courseName,
//     required String courseCode,
//     required String instructor,
//     required int credits,
//     required int availableSeats,
//     required int totalSeats,
//     required String schedule,
//   }) {
//     final isFull = availableSeats == 0;
//     final isAlmostFull = availableSeats > 0 && availableSeats <= 5;

//     return Container(
//       decoration: BoxDecoration(
//         color: AppColors.cardBackgroundColor,
//         borderRadius: BorderRadius.circular(16),
//         border: isFull
//             ? Border.all(color: AppColors.errorColor.withValues(alpha: 0.3))
//             : null,
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
//           onTap: isFull
//               ? null
//               : () {
//                   // Add to registration
//                 },
//           borderRadius: BorderRadius.circular(16),
//           child: Padding(
//             padding: const EdgeInsets.all(16),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Row(
//                   children: [
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(
//                             courseName,
//                             style: AppTextStyles.heading3.copyWith(
//                               color: isFull
//                                   ? AppColors.subtitleColor
//                                   : AppColors.textColor,
//                             ),
//                           ),
//                           const SizedBox(height: 4),
//                           Text(
//                             courseCode,
//                             style: AppTextStyles.bodySmall.copyWith(
//                               color: AppColors.subtitleColor,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     if (isFull)
//                       Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 12,
//                           vertical: 6,
//                         ),
//                         decoration: BoxDecoration(
//                           color: AppColors.errorColor.withValues(alpha: 0.1),
//                           borderRadius: BorderRadius.circular(8),
//                         ),
//                         child: Text(
//                           'FULL',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: AppColors.errorColor,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       )
//                     else if (isAlmostFull)
//                       Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 12,
//                           vertical: 6,
//                         ),
//                         decoration: BoxDecoration(
//                           color: AppColors.warningColor.withValues(alpha: 0.1),
//                           borderRadius: BorderRadius.circular(8),
//                         ),
//                         child: Text(
//                           '$availableSeats Left',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: AppColors.warningColor,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       )
//                     else
//                       Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 12,
//                           vertical: 6,
//                         ),
//                         decoration: BoxDecoration(
//                           color: AppColors.successColor.withValues(alpha: 0.1),
//                           borderRadius: BorderRadius.circular(8),
//                         ),
//                         child: Text(
//                           'Available',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: AppColors.successColor,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       ),
//                   ],
//                 ),
//                 const SizedBox(height: 12),
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.person_outline_rounded,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Expanded(
//                       child: Text(
//                         instructor,
//                         style: AppTextStyles.bodySmall.copyWith(
//                           color: AppColors.subtitleColor,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 8),
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.schedule_rounded,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       schedule,
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
//                 Row(
//                   children: [
//                     Expanded(
//                       child: ClipRRect(
//                         borderRadius: BorderRadius.circular(4),
//                         child: LinearProgressIndicator(
//                           value: (totalSeats - availableSeats) / totalSeats,
//                           backgroundColor: AppColors.backgroundColor,
//                           valueColor: AlwaysStoppedAnimation<Color>(
//                             isFull
//                                 ? AppColors.errorColor
//                                 : isAlmostFull
//                                 ? AppColors.warningColor
//                                 : AppColors.successColor,
//                           ),
//                           minHeight: 6,
//                         ),
//                       ),
//                     ),
//                     const SizedBox(width: 12),
//                     Text(
//                       '${totalSeats - availableSeats}/$totalSeats',
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: AppColors.subtitleColor,
//                         fontWeight: FontWeight.bold,
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
