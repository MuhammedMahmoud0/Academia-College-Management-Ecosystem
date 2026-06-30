import 'package:college_project/core/appCubit/app_cubit.dart';
import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/features/community/groups/cubit/groups_cubit.dart';
import 'package:college_project/features/community/groups/cubit/groups_states.dart';
import 'package:college_project/features/community/groups/widgets/group_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class GroupsScreen extends StatelessWidget {
  const GroupsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => GroupsCubit()..loadGroups(),
      child: const _GroupsScreenView(),
    );
  }
}

class _GroupsScreenView extends StatefulWidget {
  const _GroupsScreenView();

  @override
  State<_GroupsScreenView> createState() => _GroupsScreenViewState();
}

class _GroupsScreenViewState extends State<_GroupsScreenView>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = context.watch<AppCubit>().isDarkMode;

    return Scaffold(
      appBar: _buildAppBar(isDark),
      body: BlocBuilder<GroupsCubit, GroupsStates>(
        builder: (context, state) {
          if (state is GroupsLoadingState) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is GroupsErrorState) {
            return _buildErrorState(state.error, isDark, context);
          }

          return _buildContent(context, isDark, state);
        },
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(bool isDark) {
    return AppBar(
      elevation: 0,
      backgroundColor: AppColors.getCardBackground(isDark),
      leading: IconButton(
        onPressed: () => Navigator.of(context).pop(),
        icon: Icon(
          Icons.arrow_back_ios_rounded,
          color: AppColors.getTextColor(isDark),
        ),
      ),
      title: Text(
        'Groups',
        style: TextStyle(
          color: AppColors.getTextColor(isDark),
          fontWeight: FontWeight.w800,
          fontSize: 22,
        ),
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(56),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.getBackground(isDark),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TabBar(
            controller: _tabController,
            indicator: BoxDecoration(
              color: AppColors.primaryColor,
              borderRadius: BorderRadius.circular(10),
            ),
            indicatorSize: TabBarIndicatorSize.tab,
            dividerColor: Colors.transparent,
            labelColor: Colors.white,
            unselectedLabelColor: AppColors.getSubtitleColor(isDark),
            labelStyle: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
            unselectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.w500,
              fontSize: 14,
            ),
            padding: const EdgeInsets.all(4),
            tabs: const [
              Tab(text: 'My Groups'),
              Tab(text: 'Discover'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildErrorState(String error, bool isDark, BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64,
            color: AppColors.getSubtitleColor(isDark),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              error,
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.read<GroupsCubit>().loadGroups(),
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, bool isDark, GroupsStates state) {
    final cubit = context.read<GroupsCubit>();
    final myGroups = cubit.myGroups;
    final suggestedGroups = cubit.suggestedGroups;

    int? joiningGroupId;
    int? leavingGroupId;

    if (state is GroupJoiningState) {
      joiningGroupId = state.groupId;
    } else if (state is GroupLeavingState) {
      leavingGroupId = state.groupId;
    }

    return RefreshIndicator(
      onRefresh: () => cubit.refreshGroups(),
      color: AppColors.primaryColor,
      child: TabBarView(
        controller: _tabController,
        children: [
          _buildMyGroupsTab(myGroups, isDark, cubit, leavingGroupId),
          _buildDiscoverTab(suggestedGroups, isDark, cubit, joiningGroupId),
        ],
      ),
    );
  }

  Widget _buildMyGroupsTab(
    List myGroups,
    bool isDark,
    GroupsCubit cubit,
    int? leavingGroupId,
  ) {
    if (myGroups.isEmpty) {
      return _buildEmptyState(
        isDark,
        Icons.group_outlined,
        'No groups yet',
        'Join groups to connect with your community',
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: myGroups.length,
      itemBuilder: (context, index) {
        final group = myGroups[index];
        return GroupCard(
          group: group,
          isDark: isDark,
          isLoading: leavingGroupId == group.id,
          onJoinOrLeave: () => _showLeaveConfirmation(context, cubit, group),
          cubit: cubit,
        );
      },
    );
  }

  Widget _buildDiscoverTab(
    List suggestedGroups,
    bool isDark,
    GroupsCubit cubit,
    int? joiningGroupId,
  ) {
    if (suggestedGroups.isEmpty) {
      return _buildEmptyState(
        isDark,
        Icons.explore_outlined,
        'No suggestions',
        'Check back later for new groups to join',
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: suggestedGroups.length,
      itemBuilder: (context, index) {
        final group = suggestedGroups[index];
        return GroupCard(
          group: group,
          isDark: isDark,
          isLoading: joiningGroupId == group.id,
          onJoinOrLeave: () => cubit.joinGroup(group.id),
          cubit: cubit,
        );
      },
    );
  }

  Widget _buildEmptyState(
    bool isDark,
    IconData icon,
    String title,
    String subtitle,
  ) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(icon, size: 40, color: AppColors.primaryColor),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: TextStyle(
              color: AppColors.getTextColor(isDark),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              color: AppColors.getSubtitleColor(isDark),
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  void _showLeaveConfirmation(
    BuildContext context,
    GroupsCubit cubit,
    dynamic group,
  ) {
    final isDark = context.read<AppCubit>().isDarkMode;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.getCardBackground(isDark),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.getBorderColor(isDark),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.errorColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.group_remove_rounded,
                color: AppColors.errorColor,
                size: 32,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Leave Group?',
              style: TextStyle(
                color: AppColors.getTextColor(isDark),
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Are you sure you want to Leave "${group.name}"?',
              style: TextStyle(
                color: AppColors.getSubtitleColor(isDark),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.getTextColor(isDark),
                      side: BorderSide(color: AppColors.getBorderColor(isDark)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Cancel',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      cubit.leaveGroup(group.id);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.errorColor,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Leave',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
