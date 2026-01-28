import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/student_schedule/models/schedule_models.dart';
import 'package:college_project/features/student_schedule/widgets/course_details_sheet.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentScheduleScreen extends StatefulWidget {
  const StudentScheduleScreen({super.key});

  @override
  State<StudentScheduleScreen> createState() => _StudentScheduleScreenState();
}

class _StudentScheduleScreenState extends State<StudentScheduleScreen> {
  int _selectedViewIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
            size: 20.sp,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Student Schedule',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20.sp,
          ),
        ),
        centerTitle: true,
      ),

      body: Column(
        children: [
          SizedBox(height: 10.h),
          _buildYearFilter(),
          SizedBox(height: 24.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: _selectedViewIndex == 0
                  ? WeeklyListScheduleScreen() // _buildListView()
                  : WeeklyGridScheduleScreen(),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Action for FAB
          _exportToPdf();
        },
        backgroundColor: AppColors.primaryColor,
        child: Icon(Icons.save_alt_rounded, color: Colors.white, size: 24.sp),
      ),
    );
  }

  Widget _buildYearFilter() {
    return Container(
      height: 48.h,
      width: double.infinity,
      margin: EdgeInsets.symmetric(horizontal: 20.w),
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(24.r),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildYearToggleItem(
              "List View",
              0,
              Icons.view_list_rounded,
            ),
          ),
          Expanded(
            child: _buildYearToggleItem(
              "Grid View",
              1,
              Icons.grid_view_rounded,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildYearToggleItem(String title, int index, IconData icon) {
    bool isSelected = _selectedViewIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() => _selectedViewIndex = index);
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(20.r),
        ),
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primaryColor : Colors.white,
              size: 20.sp,
            ),
            SizedBox(width: 8.w),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? AppColors.primaryColor : Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 13.sp,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Handle PDF export
  Future<void> _exportToPdf() async {
    // Show loading indicator
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(width: 12),
            const Text('Generating PDF...'),
          ],
        ),
        duration: const Duration(seconds: 2),
        backgroundColor: AppColors.primaryColor,
      ),
    );

    // Simulate PDF generation
    await Future.delayed(const Duration(seconds: 2));

    // Show success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text('Schedule exported to PDF successfully!'),
            ],
          ),
          duration: Duration(seconds: 3),
          backgroundColor: AppColors.successColor,
        ),
      );
    }

    // In production, this would use a package like pdf or printing
    // to generate and save/share the PDF
  }
}

class WeeklyListScheduleScreen extends StatefulWidget {
  const WeeklyListScheduleScreen({super.key});

  @override
  State<WeeklyListScheduleScreen> createState() =>
      _WeeklyListScheduleScreenState();
}

class _WeeklyListScheduleScreenState extends State<WeeklyListScheduleScreen> {
  int selectedDayIndex = 0;
  final WeeklySchedule schedule = WeeklySchedule.mockSchedule;

  @override
  Widget build(BuildContext context) {
    // Get sessions for the selected day, sorted by time
    final todaySessions =
        schedule.sessions
            .where((session) => session.dayIndex == selectedDayIndex)
            .toList()
          ..sort((a, b) => a.timeSlotIndex.compareTo(b.timeSlotIndex));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Week Days Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                schedule.days.length,
                (index) => _buildDayCard(index),
              ),
            ),
          ),
        ),

        // Schedule Content
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Date Header
                Text(
                  '${schedule.days[selectedDayIndex]}, Sept ${12 + selectedDayIndex} 2025',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2C2C2C),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${todaySessions.length} Classes Today', // • ${_calculateTotalHours(todaySessions)} Hours',
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
                const SizedBox(height: 24),

                // Class Cards
                if (todaySessions.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        children: [
                          Icon(
                            Icons.event_busy,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No classes scheduled for this day',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  ...todaySessions.map((session) {
                    final timeSlot = schedule.timeSlots[session.timeSlotIndex];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _buildClassCard(session, timeSlot),
                    );
                  }),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDayCard(int index) {
    final isSelected = selectedDayIndex == index;
    final day = schedule.days[index];

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedDayIndex = index;
        });
      },
      child: Container(
        width: 60,
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              day.toUpperCase(),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : Colors.grey[400],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${12 + index}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : Colors.grey[400],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClassCard(ScheduleSlot session, TimeSlot timeSlot) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Time Column
        SizedBox(
          width: 60,
          child: Text(
            timeSlot.startTime,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
        ),

        // Class Card
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border(left: BorderSide(color: session.color, width: 4)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.all(16),
            child: InkWell(
              onTap: () {
                CourseDetailsSheet.show(
                  context,
                  session: session,
                  schedule: schedule,
                );
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Course Code and Name
                  Text(
                    '${session.courseCode} - ${session.courseName}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF2C2C2C),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Time
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 16, color: session.color),
                      const SizedBox(width: 6),
                      Text(
                        '${timeSlot.startTime} - ${timeSlot.endTime}',
                        style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Location and Instructor
                  Row(
                    children: [
                      // Location
                      Icon(Icons.location_on, size: 16, color: session.color),
                      const SizedBox(width: 6),
                      Text(
                        session.hall,
                        style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                      ),
                      const SizedBox(width: 16),

                      // Instructor
                      Icon(Icons.person, size: 16, color: session.color),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          session.instructor,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[700],
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  String _calculateTotalHours(List<ScheduleSlot> sessions) {
    int totalMinutes = 0;
    for (var session in sessions) {
      // Get the starting time slot
      final timeSlot = schedule.timeSlots[session.timeSlotIndex];
      final startParts = timeSlot.startTime.split(':');

      // Get the ending time slot based on duration
      final endTimeSlotIndex = session.timeSlotIndex + session.duration - 1;
      final endTimeSlot = schedule.timeSlots[endTimeSlotIndex];
      final endParts = endTimeSlot.endTime.split(':');

      final startMinutes =
          int.parse(startParts[0]) * 60 + int.parse(startParts[1]);
      final endMinutes = int.parse(endParts[0]) * 60 + int.parse(endParts[1]);

      totalMinutes += endMinutes - startMinutes;
    }

    final hours = totalMinutes ~/ 60;
    final minutes = totalMinutes % 60;

    if (minutes > 0) {
      return '$hours:${minutes.toString().padLeft(2, '0')}';
    }
    return hours.toString();
  }
}

class WeeklyGridScheduleScreen extends StatefulWidget {
  const WeeklyGridScheduleScreen({super.key});

  @override
  State<WeeklyGridScheduleScreen> createState() =>
      _WeeklyGridScheduleScreenState();
}

class _WeeklyGridScheduleScreenState extends State<WeeklyGridScheduleScreen> {
  // ===== CONFIG =====
  static const double timeColumnWidth = 80;
  static const double dayColumnWidth = 150;
  static const double cellHeight = 120;
  static const double minScale = 0.6;
  static const double maxScale = 2.8;

  // ===== DATA =====
  final List<String> days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

  final List<String> timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  final Map<String, List<Map<String, dynamic>>> schedule = {
    'MON': [
      {
        'startTime': '08:00',
        'endTime': '10:00',
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': Color(0xFF4A90E2),
      },
      {
        'startTime': '10:00',
        'endTime': '12:00',
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': Color(0xFFF5A623),
      },
      {
        'startTime': '13:00',
        'endTime': '15:00',
        'code': 'ENG105 Writing',
        'location': 'Hall A1',
        'instructor': 'Dr. Smith',
        'color': Color(0xFF7B61FF),
      },
    ],
    'TUE': [
      {
        'startTime': '15:00',
        'endTime': '17:00',
        'code': 'LAB101 Physics',
        'location': 'Lab Room 2',
        'instructor': 'Prof. Miller',
        'color': Color(0xFF2ECC71),
      },
    ],
    'WED': [
      {
        'startTime': '08:00',
        'endTime': '10:00',
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': Color(0xFF4A90E2),
      },
    ],
  };

  // ===== UI =====
  @override
  Widget build(BuildContext context) {
    return InteractiveViewer(
      minScale: minScale,
      maxScale: maxScale,
      boundaryMargin: const EdgeInsets.all(120),
      constrained: false,
      child: Column(
        children: [_buildHeaderRow(), ...timeSlots.map(_buildTimeRow)],
      ),
    );
  }

  // ===== HEADER =====
  Widget _buildHeaderRow() {
    return Row(
      children: [
        const SizedBox(width: timeColumnWidth),
        ...days.map(
          (day) => Container(
            width: dayColumnWidth,
            height: 45,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Text(
              day,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
        ),
      ],
    );
  }

  // ===== TIME ROW =====
  Widget _buildTimeRow(String timeSlot) {
    return Row(
      children: [
        // Time label
        Container(
          width: timeColumnWidth,
          height: cellHeight,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Text(
            timeSlot,
            style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
          ),
        ),

        // Day cells
        ...days.map((day) {
          final classData = _getClassForTimeSlot(day, timeSlot);

          return Container(
            width: dayColumnWidth,
            height: cellHeight,
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              color: classData == null ? Colors.grey.shade50 : null,
            ),
            child: classData != null
                ? _buildClassCard(classData)
                : const SizedBox(),
          );
        }),
      ],
    );
  }

  // ===== HELPERS =====
  Map<String, dynamic>? _getClassForTimeSlot(String day, String timeSlot) {
    final daySchedule = schedule[day];
    if (daySchedule == null) return null;

    for (final classData in daySchedule) {
      if (classData['startTime'] == timeSlot) {
        return classData;
      }
    }
    return null;
  }

  // ===== CLASS CARD =====
  Widget _buildClassCard(Map<String, dynamic> classData) {
    final Color color = classData['color'];

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(10),
        border: Border(left: BorderSide(color: color, width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            classData['code'],
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
              color: color,
            ),
          ),
          SizedBox(height: 8.h),

          Row(
            children: [
              Icon(Icons.watch_later_outlined, size: 12, color: color),
              SizedBox(width: 4.w),
              Text(
                '${classData['startTime']} - ${classData['endTime']}',
                style: const TextStyle(fontSize: 10),
              ),
            ],
          ),
          SizedBox(height: 4.h),
          Row(
            children: [
              Icon(Icons.location_on, size: 12, color: color),
              SizedBox(width: 4.w),

              Text(classData['location'], style: const TextStyle(fontSize: 10)),
            ],
          ),
          Spacer(),
          Row(
            children: [
              Icon(Icons.person, size: 12, color: color),
              SizedBox(width: 4.w),

              Text(
                classData['instructor'],
                style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
              ),
            ],
          ),
        ],
      ),
    );
  }
}


///good ui but not working but need zoom in and zoom out
/*
class WeeklyGridScheduleScreen extends StatefulWidget {
  const WeeklyGridScheduleScreen({super.key});

  @override
  State<WeeklyGridScheduleScreen> createState() =>
      _WeeklyGridScheduleScreenState();
}

class _WeeklyGridScheduleScreenState extends State<WeeklyGridScheduleScreen> {
  bool isGridView = true;
  int selectedNavIndex = 0;

  final List<String> days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
  final List<String> timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Classes organized by day and time
  final Map<String, List<Map<String, dynamic>>> schedule = {
    'MON': [
      {
        'startTime': '08:00',
        'endTime': '09:00',
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': const Color(0xFF4A90E2),
      },
      {
        'startTime': '10:00',
        'endTime': '11:00',
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
      {
        'startTime': '13:00',
        'endTime': '14:00',
        'code': 'ENG105 Writing',
        'location': 'Hall A1',
        'instructor': 'Dr. Smith',
        'color': const Color(0xFF9013FE),
      },
    ],
    'TUE': [
      {
        'startTime': '10:00',
        'endTime': '11:00',
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
      {
        'startTime': '15:00',
        'endTime': '16:00',
        'code': 'LAB101 Physics',
        'location': 'Lab Room 2',
        'instructor': 'Prof. Miller',
        'color': const Color(0xFF7ED321),
      },
    ],
    'WED': [
      {
        'startTime': '08:00',
        'endTime': '09:00',
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': const Color(0xFF4A90E2),
      },
      {
        'startTime': '10:00',
        'endTime': '11:00',
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
      {
        'startTime': '13:00',
        'endTime': '14:00',
        'code': 'ENG105 Writing',
        'location': 'Hall A1',
        'instructor': 'Dr. Smith',
        'color': const Color(0xFF9013FE),
      },
    ],
  };

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Grid Schedule
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Header with day names
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Time column
                    const SizedBox(width: 50),
                    // Day columns
                    ...days.map(
                      (day) => Expanded(
                        child: Center(
                          child: Text(
                            day,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Schedule Grid
                ...timeSlots.map((timeSlot) => _buildTimeRow(timeSlot)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTimeRow(String timeSlot) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Time label
            SizedBox(
              width: 50,
              child: Text(
                timeSlot,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            // Day cells
            ...days.map((day) {
              final classData = _getClassForTimeSlot(day, timeSlot);
              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  child: classData != null
                      ? _buildClassCard(classData)
                      : Container(
                          height: 80,
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Map<String, dynamic>? _getClassForTimeSlot(String day, String timeSlot) {
    final daySchedule = schedule[day];
    if (daySchedule == null) return null;

    for (var classData in daySchedule) {
      if (classData['startTime'] == timeSlot) {
        return classData;
      }
    }
    return null;
  }

  Widget _buildClassCard(Map<String, dynamic> classData) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: classData['color'].withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: classData['color'], width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            classData['code'],
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: classData['color'],
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            classData['location'],
            style: TextStyle(fontSize: 10, color: Colors.grey[700]),
          ),
          const Spacer(),
          Text(
            classData['instructor'],
            style: TextStyle(fontSize: 10, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }
}
*/

/*
class WeeklyGridScheduleScreen extends StatefulWidget {
  const WeeklyGridScheduleScreen({super.key});

  @override
  State<WeeklyGridScheduleScreen> createState() =>
      _WeeklyGridScheduleScreenState();
}

class _WeeklyGridScheduleScreenState extends State<WeeklyGridScheduleScreen> {
  bool isGridView = true;
  int selectedNavIndex = 0;
  double _currentZoom = 1.0;
  final TransformationController _transformationController =
      TransformationController();

  final List<String> days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
  final List<String> timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Classes organized by day and time with different durations
  // Duration is calculated from startTime to endTime
  final Map<String, List<Map<String, dynamic>>> schedule = {
    'SAT': [
      {
        'startTime': '08:00',
        'endTime': '10:00', // 2 hours (cells: 08:00, 09:00)
        'code': 'CS101 Programming',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': const Color(0xFF4A90E2),
      },
    ],
    'SUN': [
      {
        'startTime': '10:00',
        'endTime': '12:00', // 2 hours (cells: 10:00, 11:00)
        'code': 'MATH202 Calculus II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
    ],
    'MON': [
      {
        'startTime': '08:00',
        'endTime': '10:00', // 2 hours (cells: 08:00, 09:00)
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': const Color(0xFF4A90E2),
      },
      {
        'startTime': '10:00',
        'endTime': '12:00', // 2 hours (cells: 10:00, 11:00)
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
      {
        'startTime': '13:00',
        'endTime': '15:00', // 2 hours (cells: 13:00, 14:00)
        'code': 'ENG105 Writing',
        'location': 'Hall A1',
        'instructor': 'Dr. Smith',
        'color': const Color(0xFF9013FE),
      },
    ],
    'TUE': [
      {
        'startTime': '08:00',
        'endTime': '09:00', // 1 hour (cell: 08:00 only)
        'code': 'PHY201 Physics',
        'location': 'Lab 3',
        'instructor': 'Dr. Brown',
        'color': const Color(0xFFE74C3C),
      },
      {
        'startTime': '10:00',
        'endTime': '13:00', // 3 hours (cells: 10:00, 11:00, 12:00)
        'code': 'Advanced Programming Lab',
        'location': 'Computer Lab 1',
        'instructor': 'Prof. Johnson',
        'color': const Color(0xFF3498DB),
      },
      {
        'startTime': '15:00',
        'endTime': '17:00', // 2 hours (cells: 15:00, 16:00)
        'code': 'LAB101 Physics Lab',
        'location': 'Lab Room 2',
        'instructor': 'Prof. Miller',
        'color': const Color(0xFF7ED321),
      },
    ],
    'WED': [
      {
        'startTime': '08:00',
        'endTime': '10:00', // 2 hours (cells: 08:00, 09:00)
        'code': 'CS101 Intro',
        'location': 'Hall B2',
        'instructor': 'Dr. Jenkins',
        'color': const Color(0xFF4A90E2),
      },
      {
        'startTime': '10:00',
        'endTime': '11:00', // 1 hour (cell: 10:00 only)
        'code': 'MATH202 Calc II',
        'location': 'Room 405',
        'instructor': 'Prof. Aris',
        'color': const Color(0xFFF5A623),
      },
      {
        'startTime': '13:00',
        'endTime': '15:00', // 2 hours (cells: 13:00, 14:00)
        'code': 'ENG105 Writing',
        'location': 'Hall A1',
        'instructor': 'Dr. Smith',
        'color': const Color(0xFF9013FE),
      },
    ],
    'THU': [
      {
        'startTime': '08:00',
        'endTime': '11:00', // 3 hours (cells: 08:00, 09:00, 10:00)
        'code': 'BIO301 Biology Research',
        'location': 'Hall C1',
        'instructor': 'Dr. Green',
        'color': const Color(0xFF27AE60),
      },
      {
        'startTime': '14:00',
        'endTime': '16:00', // 2 hours (cells: 14:00, 15:00)
        'code': 'CHEM202 Chemistry Lab',
        'location': 'Lab 5',
        'instructor': 'Prof. White',
        'color': const Color(0xFF8E44AD),
      },
    ],
    'FRI': [
      {
        'startTime': '08:00',
        'endTime': '09:00', // 1 hour (cell: 08:00 only)
        'code': 'ART101 Arts',
        'location': 'Studio A',
        'instructor': 'Ms. Davis',
        'color': const Color(0xFFE67E22),
      },
      {
        'startTime': '10:00',
        'endTime': '12:00', // 2 hours (cells: 10:00, 11:00)
        'code': 'MUS201 Music Theory',
        'location': 'Music Room',
        'instructor': 'Prof. Anderson',
        'color': const Color(0xFFE91E63),
      },
      {
        'startTime': '13:00',
        'endTime': '14:00', // 1 hour (cell: 13:00 only)
        'code': 'HIS201 History',
        'location': 'Hall D2',
        'instructor': 'Prof. Taylor',
        'color': const Color(0xFF16A085),
      },
    ],
  };

  @override
  void dispose() {
    _transformationController.dispose();
    super.dispose();
  }

  void _zoomIn() {
    setState(() {
      _currentZoom = (_currentZoom + 0.2).clamp(0.5, 3.0);
      _transformationController.value = Matrix4.identity()..scale(_currentZoom);
    });
  }

  void _zoomOut() {
    setState(() {
      _currentZoom = (_currentZoom - 0.2).clamp(0.5, 3.0);
      _transformationController.value = Matrix4.identity()..scale(_currentZoom);
    });
  }

  void _resetZoom() {
    setState(() {
      _currentZoom = 1.0;
      _transformationController.value = Matrix4.identity();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Zoom Controls
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: Colors.white,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Zoom: ${(_currentZoom * 100).toInt()}%',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[700],
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.zoom_out),
                    onPressed: _currentZoom > 0.5 ? _zoomOut : null,
                    color: const Color(0xFF4A90E2),
                    iconSize: 20,
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: _resetZoom,
                    color: const Color(0xFF4A90E2),
                    iconSize: 20,
                  ),
                  IconButton(
                    icon: const Icon(Icons.zoom_in),
                    onPressed: _currentZoom < 3.0 ? _zoomIn : null,
                    color: const Color(0xFF4A90E2),
                    iconSize: 20,
                  ),
                ],
              ),
            ],
          ),
        ),

        // Grid Schedule with InteractiveViewer
        Expanded(
          child: InteractiveViewer(
            transformationController: _transformationController,
            boundaryMargin: const EdgeInsets.all(50),
            minScale: 0.5,
            maxScale: 3.0,
            constrained: false,
            onInteractionUpdate: (details) {
              setState(() {
                _currentZoom = _transformationController.value
                    .getMaxScaleOnAxis();
              });
            },
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header with day names
                      _buildHeaderRow(),
                      const SizedBox(height: 8),

                      // Divider line
                      Row(
                        children: [
                          const SizedBox(width: 60),
                          ...days.map(
                            (day) => Container(
                              width: 120,
                              height: 2,
                              margin: const EdgeInsets.symmetric(horizontal: 2),
                              color: Colors.grey[300],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Schedule Grid
                      ...timeSlots.map((timeSlot) => _buildTimeRow(timeSlot)),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeaderRow() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Time column header
        Container(
          width: 60,
          padding: const EdgeInsets.all(8),
          child: Text(
            'Time',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
        ),
        // Day columns
        ...days.map(
          (day) => Container(
            width: 120,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF4A90E2).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFF4A90E2).withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Center(
              child: Text(
                day,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF4A90E2),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTimeRow(String timeSlot) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Time label
            Container(
              width: 60,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Text(
                timeSlot,
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            // Day cells
            ...days.map((day) {
              final cellInfo = _getCellInfoForTimeSlot(day, timeSlot);

              // Skip if this cell is part of a class that started earlier
              if (cellInfo['isPartOfEarlierClass'] == true) {
                return const SizedBox(width: 124); // Width + margin
              }

              final classData = cellInfo['classData'];
              return Container(
                width: 120,
                margin: const EdgeInsets.symmetric(horizontal: 2),
                child: classData != null
                    ? _buildClassCard(classData)
                    : _buildEmptyCell(),
              );
            }),
          ],
        ),
      ),
    );
  }

  Map<String, dynamic> _getCellInfoForTimeSlot(String day, String timeSlot) {
    final daySchedule = schedule[day];
    if (daySchedule == null) {
      return {'classData': null, 'isPartOfEarlierClass': false};
    }

    // Check if there's a class starting at this time slot
    for (var classData in daySchedule) {
      if (classData['startTime'] == timeSlot) {
        return {'classData': classData, 'isPartOfEarlierClass': false};
      }
    }

    // Check if this time slot is part of a class that started earlier
    final timeSlotHour = int.parse(timeSlot.split(':')[0]);

    for (var classData in daySchedule) {
      final startTime = classData['startTime'] as String;
      final endTime = classData['endTime'] as String;

      final startHour = int.parse(startTime.split(':')[0]);
      final endHour = int.parse(endTime.split(':')[0]);

      // If current time slot is between start and end (exclusive of both)
      // Example: class from 9 to 11, current slot 10 -> should be hidden
      if (timeSlotHour > startHour && timeSlotHour < endHour) {
        return {'classData': null, 'isPartOfEarlierClass': true};
      }
    }

    return {'classData': null, 'isPartOfEarlierClass': false};
  }

  Widget _buildEmptyCell() {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Center(
        child: Icon(
          Icons.add_circle_outline,
          color: Colors.grey[300],
          size: 20,
        ),
      ),
    );
  }

  Widget _buildClassCard(Map<String, dynamic> classData) {
    // Calculate number of cells to span
    final startTime = classData['startTime'] as String;
    final endTime = classData['endTime'] as String;

    final startHour = int.parse(startTime.split(':')[0]);
    final endHour = int.parse(endTime.split(':')[0]);

    // Number of cells = endHour - startHour
    // Example: 9:00 to 11:00 = 11 - 9 = 2 cells (9, 10)
    // But we want to include 11 too, so we need 3 cells
    // Actually if end is 11:00, it means class ends at 11, so cells are 9 and 10 only
    final numCells = endHour - startHour;

    // Each cell is 100px height + 4px margin
    final cardHeight = (numCells * 104.0) - 4; // Subtract last margin

    return Container(
      height: cardHeight,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: classData['color'].withOpacity(0.12),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: classData['color'], width: 2),
        boxShadow: [
          BoxShadow(
            color: classData['color'].withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Course Code
          Text(
            classData['code'],
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: classData['color'],
              height: 1.3,
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),

          // Time Duration
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(
              color: classData['color'].withOpacity(0.15),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              '${classData['startTime']} - ${classData['endTime']}',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: classData['color'],
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Location
          Row(
            children: [
              Icon(Icons.location_on, size: 12, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  classData['location'],
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey[700],
                    height: 1.2,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),

          // Instructor
          Row(
            children: [
              Icon(Icons.person, size: 12, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  classData['instructor'],
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey[600],
                    height: 1.2,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),

          // Duration badge for longer classes
          if (numCells > 1) ...[
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: classData['color'].withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                '$numCells ${numCells == 1 ? 'hour' : 'hours'}',
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: classData['color'],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
*/