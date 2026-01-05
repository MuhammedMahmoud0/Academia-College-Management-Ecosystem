<<<<<<< HEAD
// import 'package:college_project/core/styles/app_colors.dart';
// import 'package:college_project/core/styles/text_styles.dart';
// import 'package:college_project/features/home/models/exam_model.dart';
// import 'package:flutter/material.dart';

// class ExamsScreen extends StatelessWidget {
//   const ExamsScreen({super.key});

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
//                         Text('Exam Schedule', style: AppTextStyles.heading1),
//                         const SizedBox(height: 4),
//                         Text(
//                           'Final Exams - Spring 2025',
//                           style: AppTextStyles.bodyMedium.copyWith(
//                             color: AppColors.subtitleColor,
//                           ),
//                         ),
//                       ],
//                     ),
//                     IconButton(
//                       onPressed: () {
//                         // Calendar view
//                       },
//                       icon: const Icon(
//                         Icons.calendar_month_rounded,
//                         color: AppColors.textColor,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),

//             // Exam Statistics
//             SliverToBoxAdapter(
//               child: Padding(
//                 padding: const EdgeInsets.symmetric(horizontal: 20),
//                 child: Container(
//                   padding: const EdgeInsets.all(16),
//                   decoration: BoxDecoration(
//                     gradient: LinearGradient(
//                       colors: [
//                         AppColors.infoColor,
//                         AppColors.infoColor.withValues(alpha: 0.8),
//                       ],
//                       begin: Alignment.topLeft,
//                       end: Alignment.bottomRight,
//                     ),
//                     borderRadius: BorderRadius.circular(16),
//                     boxShadow: [
//                       BoxShadow(
//                         color: AppColors.infoColor.withValues(alpha: 0.3),
//                         blurRadius: 10,
//                         offset: const Offset(0, 4),
//                       ),
//                     ],
//                   ),
//                   child: Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceAround,
//                     children: [
//                       _buildStatItem('Total', '6', Icons.event_note_rounded),
//                       Container(
//                         width: 1,
//                         height: 40,
//                         color: Colors.white.withValues(alpha: 0.3),
//                       ),
//                       _buildStatItem('Upcoming', '4', Icons.schedule_rounded),
//                       Container(
//                         width: 1,
//                         height: 40,
//                         color: Colors.white.withValues(alpha: 0.3),
//                       ),
//                       _buildStatItem(
//                         'Completed',
//                         '2',
//                         Icons.check_circle_rounded,
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),

//             // Upcoming Exams Section
//             SliverToBoxAdapter(
//               child: Padding(
//                 padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
//                 child: Text('Upcoming Exams', style: AppTextStyles.heading2),
//               ),
//             ),

//             // Exam List
//             SliverPadding(
//               padding: const EdgeInsets.symmetric(horizontal: 20),
//               sliver: SliverList(
//                 delegate: SliverChildListDelegate([
//                   ...Exam.mockExams.map(
//                     (exam) => Padding(
//                       padding: const EdgeInsets.only(bottom: 12),
//                       child: _buildExamCard(exam),
//                     ),
//                   ),
//                   const SizedBox(height: 16),
//                   Text('Completed Exams', style: AppTextStyles.heading2),
//                   const SizedBox(height: 16),
//                   _buildCompletedExamCard(
//                     courseName: 'Computer Architecture',
//                     courseCode: 'CS 201',
//                     date: DateTime.now().subtract(const Duration(days: 5)),
//                     location: 'Hall A - Seat 45',
//                     duration: '2 Hours',
//                     grade: 'A',
//                   ),
//                   const SizedBox(height: 12),
//                   _buildCompletedExamCard(
//                     courseName: 'Discrete Mathematics',
//                     courseCode: 'MATH 201',
//                     date: DateTime.now().subtract(const Duration(days: 8)),
//                     location: 'Hall B - Seat 23',
//                     duration: '3 Hours',
//                     grade: 'A-',
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

//   Widget _buildStatItem(String label, String value, IconData icon) {
//     return Column(
//       children: [
//         Icon(icon, color: Colors.white, size: 24),
//         const SizedBox(height: 8),
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

//   Widget _buildExamCard(Exam exam) {
//     final daysUntil = exam.dateTime.difference(DateTime.now()).inDays;
//     final isUrgent = daysUntil <= 3;

//     return Container(
//       decoration: BoxDecoration(
//         color: AppColors.cardBackgroundColor,
//         borderRadius: BorderRadius.circular(16),
//         border: isUrgent
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
//           onTap: () {
//             // View exam details
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
//                       width: 56,
//                       height: 56,
//                       decoration: BoxDecoration(
//                         color: isUrgent
//                             ? AppColors.errorColor.withValues(alpha: 0.1)
//                             : AppColors.primaryColor.withValues(alpha: 0.1),
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                       child: Column(
//                         mainAxisAlignment: MainAxisAlignment.center,
//                         children: [
//                           Text(
//                             exam.dateTime.day.toString(),
//                             style: TextStyle(
//                               fontSize: 20,
//                               fontWeight: FontWeight.bold,
//                               color: isUrgent
//                                   ? AppColors.errorColor
//                                   : AppColors.primaryColor,
//                             ),
//                           ),
//                           Text(
//                             _getMonthName(exam.dateTime.month).substring(0, 3),
//                             style: TextStyle(
//                               fontSize: 12,
//                               color: isUrgent
//                                   ? AppColors.errorColor
//                                   : AppColors.primaryColor,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     const SizedBox(width: 12),
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(exam.courseName, style: AppTextStyles.heading3),
//                           const SizedBox(height: 4),
//                           Text(
//                             exam.courseCode,
//                             style: AppTextStyles.bodySmall.copyWith(
//                               color: AppColors.subtitleColor,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     if (isUrgent)
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
//                           'URGENT',
//                           style: AppTextStyles.bodySmall.copyWith(
//                             color: AppColors.errorColor,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       ),
//                   ],
//                 ),
//                 const SizedBox(height: 16),
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.access_time_rounded,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       exam.formattedTime,
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: AppColors.subtitleColor,
//                       ),
//                     ),
//                     const SizedBox(width: 16),
//                     Icon(
//                       Icons.location_on_outlined,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Expanded(
//                       child: Text(
//                         exam.location,
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
//                       Icons.timer_outlined,
//                       size: 16,
//                       color: AppColors.subtitleColor,
//                     ),
//                     const SizedBox(width: 6),
//                     Text(
//                       _formatDuration(exam.duration),
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: AppColors.subtitleColor,
//                       ),
//                     ),
//                     const Spacer(),
//                     Text(
//                       'In $daysUntil day${daysUntil != 1 ? 's' : ''}',
//                       style: AppTextStyles.bodySmall.copyWith(
//                         color: isUrgent
//                             ? AppColors.errorColor
//                             : AppColors.primaryColor,
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

//   Widget _buildCompletedExamCard({
//     required String courseName,
//     required String courseCode,
//     required DateTime date,
//     required String location,
//     required String duration,
//     required String grade,
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
//             // View exam details
//           },
//           borderRadius: BorderRadius.circular(16),
//           child: Padding(
//             padding: const EdgeInsets.all(16),
//             child: Row(
//               children: [
//                 Container(
//                   width: 48,
//                   height: 48,
//                   decoration: BoxDecoration(
//                     color: AppColors.successColor.withValues(alpha: 0.1),
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   child: const Icon(
//                     Icons.check_circle_rounded,
//                     color: AppColors.successColor,
//                     size: 24,
//                   ),
//                 ),
//                 const SizedBox(width: 12),
//                 Expanded(
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Text(courseName, style: AppTextStyles.heading3),
//                       const SizedBox(height: 4),
//                       Text(
//                         '${date.day} ${_getMonthName(date.month)} ${date.year}',
//                         style: AppTextStyles.bodySmall.copyWith(
//                           color: AppColors.subtitleColor,
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//                 Container(
//                   padding: const EdgeInsets.symmetric(
//                     horizontal: 16,
//                     vertical: 8,
//                   ),
//                   decoration: BoxDecoration(
//                     color: AppColors.successColor.withValues(alpha: 0.1),
//                     borderRadius: BorderRadius.circular(8),
//                   ),
//                   child: Text(
//                     grade,
//                     style: AppTextStyles.heading3.copyWith(
//                       color: AppColors.successColor,
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }

//   String _getMonthName(int month) {
//     const months = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December',
//     ];
//     return months[month - 1];
//   }

//   String _formatDuration(Duration duration) {
//     final hours = duration.inHours;
//     final minutes = duration.inMinutes.remainder(60);
//     if (minutes > 0) {
//       return '$hours Hour${hours != 1 ? 's' : ''} $minutes Min';
//     }
//     return '$hours Hour${hours != 1 ? 's' : ''}';
//   }
// }
=======
import 'package:college_project/features/exams/widgets/exam_card.dart';
import 'package:college_project/features/exams/widgets/exam_filter_bar.dart';
import 'package:college_project/features/home/models/exam_model.dart';
import 'package:flutter/material.dart';

class ExamDashboardScreen extends StatefulWidget {
  const ExamDashboardScreen({super.key});

  @override
  State<ExamDashboardScreen> createState() => _ExamDashboardScreenState();
}

class _ExamDashboardScreenState extends State<ExamDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: false,
        title: const Text(
          'Exam Schedule',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 22,
          ),
        ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 12),
          ExamFilterBar(controller: _tabController),
          const SizedBox(height: 8),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildFilteredExamList('upcoming'),
                _buildFilteredExamList('completed'),
                _buildFilteredExamList('missed'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilteredExamList(String status) {
    final now = DateTime.now();

    // Filtering logic now fully implements the 'missed' state
    final filteredExams = Exam.mockExams.where((exam) {
      final isPast = exam.dateTime.isBefore(now);

      if (status == 'upcoming') {
        return !isPast;
      }
      if (status == 'completed') {
        // In this mock, we assume exams are completed if they are in the past
        // and specifically tagged as completed in a real DB.
        // For the demo, we'll use the statusString helper.
        return exam.statusString == 'completed';
      }
      if (status == 'missed') {
        // An exam is missed if the date has passed but it wasn't 'completed'.
        // For this mock logic, we'll show exams that are past but not completed.
        return isPast && exam.statusString != 'completed';
      }
      return false;
    }).toList();

    if (filteredExams.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_busy_outlined, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'No $status exams found',
              style: TextStyle(
                color: Colors.grey[500],
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredExams.length,
      itemBuilder: (context, index) {
        return ExamCard(exam: filteredExams[index]);
      },
    );
  }
}
>>>>>>> f8d29fad350b9cd6f933c21164036dc581573381
