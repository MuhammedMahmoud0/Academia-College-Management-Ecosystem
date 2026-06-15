import 'package:college_project/core/styles/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:college_project/features/material/cubit/materials_cubit.dart';
import 'package:college_project/features/material/cubit/materials_states.dart';
import 'package:college_project/features/material/models/materials_response_model.dart';
import 'package:college_project/features/material/widgets/Material_Card_Widget.dart';
import 'package:college_project/features/material/widgets/Material_SearchBar.dart';

class MaterialsScreen extends StatelessWidget {
  const MaterialsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => MaterialsCubit()..getMaterials(),
      child: const MaterialsView(),
    );
  }
}

class MaterialsView extends StatefulWidget {
  const MaterialsView({super.key});

  @override
  State<MaterialsView> createState() => _MaterialsViewState();
}

class _MaterialsViewState extends State<MaterialsView> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  bool _isGroupedView =
      true; // true = grouped by lecture, false = all materials

  @override
  void initState() {
    super.initState();
    context.read<MaterialsCubit>().getMaterials();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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
            onChanged: (value) {
              setState(() {
                _searchQuery = value.toLowerCase();
              });
            },
          ),
          SizedBox(height: 16.h),
          _buildViewToggle(),
          SizedBox(height: 16.h),
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32.r),
                  topRight: Radius.circular(32.r),
                ),
              ),
              child: BlocBuilder<MaterialsCubit, MaterialsStates>(
                builder: (context, state) {
                  if (state is MaterialsLoadingState) {
                    return _buildLoadingState();
                  } else if (state is MaterialsErrorState) {
                    return _buildErrorState(state.error);
                  } else if (state is MaterialsLoadedState ||
                      state is MaterialsRefreshingState) {
                    final materials = state is MaterialsLoadedState
                        ? state.materials
                        : (state as MaterialsRefreshingState).materials;
                    return _isGroupedView
                        ? _buildGroupedContent(materials)
                        : _buildAllMaterialsContent(materials);
                  }
                  return _buildLoadingState();
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildViewToggle() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: Container(
        padding: EdgeInsets.all(4.w),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12.r),
        ),
        child: Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _isGroupedView = false),
                child: Container(
                  padding: EdgeInsets.symmetric(vertical: 10.h),
                  decoration: BoxDecoration(
                    color: !_isGroupedView
                        ? Theme.of(
                            context,
                          ).colorScheme.onPrimary.withOpacity(0.15)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(10.r),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.list_rounded,
                        size: 18.sp,
                        color: Colors.white,
                      ),
                      SizedBox(width: 6.w),
                      Text(
                        'All',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 13.sp,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _isGroupedView = true),
                child: Container(
                  padding: EdgeInsets.symmetric(vertical: 10.h),
                  decoration: BoxDecoration(
                    color: _isGroupedView
                        ? Theme.of(
                            context,
                          ).colorScheme.onPrimary.withOpacity(0.15)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(10.r),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.folder_rounded,
                        size: 18.sp,
                        color: Colors.white,
                      ),
                      SizedBox(width: 6.w),
                      Text(
                        'By Lecture',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 13.sp,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: CircularProgressIndicator(color: AppColors.primaryColor),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64.sp,
            color: Colors.red.shade300,
          ),
          SizedBox(height: 16.h),
          Text(
            error,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: 16.sp,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 16.h),
          ElevatedButton(
            onPressed: () {
              context.read<MaterialsCubit>().getMaterials();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.r),
              ),
            ),
            child: Text(
              'Retry',
              style: TextStyle(color: Colors.white, fontSize: 14.sp),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
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
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: 16.sp,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /// Build ALL materials view (flat list)
  Widget _buildAllMaterialsContent(MaterialsResponseModel materials) {
    // Filter materials based on search query
    final filteredMaterials = materials.data.where((m) {
      return m.title.toLowerCase().contains(_searchQuery);
    }).toList();

    if (filteredMaterials.isEmpty) {
      return _buildEmptyState();
    }

    // Separate files and links
    final files = filteredMaterials.where((m) => m.isFile).toList();
    final links = filteredMaterials.where((m) => m.isLink).toList();

    return RefreshIndicator(
      onRefresh: () => context.read<MaterialsCubit>().refreshMaterials(),
      color: AppColors.primaryColor,
      child: ListView(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 24.h),
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        children: [
          if (files.isNotEmpty) ...[
            _buildSectionHeader(
              "Files",
              files.length,
              Icons.picture_as_pdf_rounded,
            ),
            ...files.map((m) => MaterialCard(material: m)),
            SizedBox(height: 20.h),
          ],
          if (links.isNotEmpty) ...[
            _buildSectionHeader("Links", links.length, Icons.language_rounded),
            ...links.map((m) => MaterialCard(material: m)),
          ],
        ],
      ),
    );
  }

  /// Build GROUPED materials view (by lecture_id)
  Widget _buildGroupedContent(MaterialsResponseModel materials) {
    final grouped = materials.groupedByLecture;

    // Filter materials based on search query
    final filteredGrouped = <int, List<MaterialModel>>{};
    for (final entry in grouped.entries) {
      final filteredMaterials = entry.value.where((m) {
        return m.title.toLowerCase().contains(_searchQuery);
      }).toList();
      if (filteredMaterials.isNotEmpty) {
        filteredGrouped[entry.key] = filteredMaterials;
      }
    }

    if (filteredGrouped.isEmpty) {
      return _buildEmptyState();
    }

    // Sort lecture IDs
    final sortedLectureIds = filteredGrouped.keys.toList()..sort();

    return RefreshIndicator(
      onRefresh: () => context.read<MaterialsCubit>().refreshMaterials(),
      color: AppColors.primaryColor,
      child: ListView.builder(
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 24.h),
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        itemCount: sortedLectureIds.length,
        itemBuilder: (context, index) {
          final lectureId = sortedLectureIds[index];
          final lectureMaterials = filteredGrouped[lectureId]!;

          // Separate files and links within the lecture group
          final files = lectureMaterials.where((m) => m.isFile).toList();
          final links = lectureMaterials.where((m) => m.isLink).toList();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildLectureHeader(lectureId, lectureMaterials.length),
              if (files.isNotEmpty) ...[
                _buildSubSectionHeader("Files", files.length),
                ...files.map((m) => MaterialCard(material: m)),
              ],
              if (links.isNotEmpty) ...[
                _buildSubSectionHeader("Links", links.length),
                ...links.map((m) => MaterialCard(material: m)),
              ],
              SizedBox(height: 16.h),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(String title, int count, IconData icon) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(
        color: AppColors.primaryColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primaryColor, size: 20.sp),
          SizedBox(width: 8.w),
          Text(
            title,
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryColor,
            ),
          ),
          const Spacer(),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 2.h),
            decoration: BoxDecoration(
              color: AppColors.primaryColor,
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Text(
              "$count",
              style: TextStyle(
                color: Colors.white,
                fontSize: 11.sp,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLectureHeader(int lectureId, int count) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(
        color: AppColors.primaryColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        children: [
          Icon(
            Icons.folder_rounded,
            color: AppColors.primaryColor,
            size: 20.sp,
          ),
          SizedBox(width: 8.w),
          Text(
            lectureId == 0 ? 'General Materials' : 'Lecture $lectureId',
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryColor,
            ),
          ),
          const Spacer(),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 2.h),
            decoration: BoxDecoration(
              color: AppColors.primaryColor,
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Text(
              "$count",
              style: TextStyle(
                color: Colors.white,
                fontSize: 11.sp,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubSectionHeader(String title, int count) {
    return Padding(
      padding: EdgeInsets.only(left: 4.w, bottom: 8.h, top: 4.h),
      child: Row(
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 14.sp,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
          SizedBox(width: 8.w),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(8.r),
            ),
            child: Text(
              "$count",
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
                fontSize: 10.sp,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
