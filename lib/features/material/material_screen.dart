import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:college_project/features/material/models/material_model.dart';
import 'package:college_project/features/material/widgets/Material_Card_Widget.dart';
import 'package:college_project/features/material/widgets/Material_SearchBar.dart';

class MaterialsScreen extends StatefulWidget {
  const MaterialsScreen({Key? key}) : super(key: key);

  @override
  State<MaterialsScreen> createState() => _MaterialsScreenState();
}

class _MaterialsScreenState extends State<MaterialsScreen> {
  final Color primaryColor = const Color(0xFF6C63FF);
  final Color backgroundColor = const Color(0xFFF8F9FE);

  // List of courses for the filter
  final List<String> _courses = [
    "All Courses",
    "Data Structures",
    "Algorithms",
    "Mobile Dev",
    "Database",
    "Math",
  ];

  int _selectedCourseIndex = 0;
  late List<StudyMaterial> _allMaterials;
  List<StudyMaterial> _filteredMaterials = [];
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _allMaterials = [
      ...MaterialData.getSampleMaterials(),
      StudyMaterial(
        title: 'Linear Algebra Basics',
        description: 'Vectors, matrices, and systems of equations.',
        date: 'Jan 04, 2024',
        type: StudyMaterialType.pdf,
        sizeOrUrl: '3.1 MB',
      ),
      StudyMaterial(
        title: 'Mobile App Architecture',
        description: 'Design patterns for modern mobile development.',
        date: 'Feb 10, 2024',
        type: StudyMaterialType.pdf,
        sizeOrUrl: '4.2 MB',
      ),
    ];
    _applyFilters();
  }

  void _applyFilters() {
    setState(() {
      String query = _searchController.text.toLowerCase();
      String selectedCourse = _courses[_selectedCourseIndex];

      _filteredMaterials = _allMaterials.where((m) {
        bool matchesSearch =
            m.title.toLowerCase().contains(query) ||
            m.description.toLowerCase().contains(query);

        bool matchesCourse;
        if (selectedCourse == "All Courses") {
          matchesCourse = true;
        } else if (selectedCourse == "Math") {
          matchesCourse =
              m.title.contains("Math") || m.title.contains("Algebra");
        } else if (selectedCourse == "Data Structures") {
          matchesCourse =
              m.title.contains("Data Structures") ||
              m.title.contains("Algorithms") ||
              m.title.contains("Discrete");
        } else if (selectedCourse == "Mobile Dev") {
          matchesCourse =
              m.title.toLowerCase().contains("mobile") ||
              m.title.toLowerCase().contains("flutter");
        } else {
          String courseKeyword = selectedCourse.toLowerCase().split(' ')[0];
          matchesCourse = m.title.toLowerCase().contains(courseKeyword);
        }

        return matchesSearch && matchesCourse;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryColor,
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
          'Study Materials',
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
          MaterialSearchBar(
            controller: _searchController,
            onChanged: (_) => _applyFilters(),
          ),
          SizedBox(height: 16.h),
          _buildHorizontalCourseFilter(),
          SizedBox(height: 24.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: backgroundColor,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: _buildMainContent(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalCourseFilter() {
    return SizedBox(
      height: 40.h,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        physics: const BouncingScrollPhysics(),
        itemCount: _courses.length,
        itemBuilder: (context, index) {
          bool isSelected = _selectedCourseIndex == index;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCourseIndex = index;
                _applyFilters();
              });
            },
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 4.w),
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20.r),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.1),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                _courses[index],
                style: TextStyle(
                  color: isSelected ? primaryColor : Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 13.sp,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMainContent() {
    if (_filteredMaterials.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off_rounded,
              size: 64.sp,
              color: Colors.grey.shade300,
            ),
            SizedBox(height: 16.h),
            Text(
              "No materials found",
              style: TextStyle(
                color: Colors.grey,
                fontSize: 16.sp,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    final lectures = _filteredMaterials
        .where((m) => m.type == StudyMaterialType.pdf)
        .toList();
    final externalResources = _filteredMaterials
        .where((m) => m.type == StudyMaterialType.link)
        .toList();

    return ListView(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 24.h),
      physics: const BouncingScrollPhysics(),
      children: [
        if (lectures.isNotEmpty) ...[
          _buildSectionHeader("Lecture Materials", lectures.length),
          ...lectures.map(
            (m) => MaterialCard(material: m, primaryColor: primaryColor),
          ),
          SizedBox(height: 24.h),
        ],

        if (externalResources.isNotEmpty) ...[
          _buildSectionHeader("External Resources", externalResources.length),
          ...externalResources.map(
            (m) => MaterialCard(material: m, primaryColor: primaryColor),
          ),
        ],
      ],
    );
  }

  Widget _buildSectionHeader(String title, int count) {
    return Padding(
      padding: EdgeInsets.only(left: 4.w, bottom: 16.h),
      child: Row(
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          SizedBox(width: 8.w),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 2.h),
            decoration: BoxDecoration(
              color: primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Text(
              "$count",
              style: TextStyle(
                color: primaryColor,
                fontSize: 11.sp,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
