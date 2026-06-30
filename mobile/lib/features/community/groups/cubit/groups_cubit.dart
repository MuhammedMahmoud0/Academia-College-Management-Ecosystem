import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/community/groups/cubit/groups_states.dart';
import 'package:college_project/features/community/groups/models/groups_response_model.dart';
import 'package:college_project/features/community/groups/repo/groups_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class GroupsCubit extends Cubit<GroupsStates> {
  GroupsCubit() : super(GroupsInitialState());

  static GroupsCubit get(BuildContext context) => BlocProvider.of(context);

  final GroupsRepo _groupsRepo = GroupsRepo();

  List<GroupModel> _myGroups = [];
  List<GroupModel> _suggestedGroups = [];

  List<GroupModel> get myGroups => _myGroups;
  List<GroupModel> get suggestedGroups => _suggestedGroups;

  Future<void> loadGroups() async {
    emit(GroupsLoadingState());

    try {
      final results = await Future.wait([
        _groupsRepo.getMyGroups(),
        _groupsRepo.getSuggestedGroups(),
      ]);

      // My groups are joined, suggested groups are not
      _myGroups = results[0].groups.map((g) => g.copyWith(isJoined: true)).toList();
      _suggestedGroups = results[1].groups.map((g) => g.copyWith(isJoined: false)).toList();

      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } on ApiException catch (e) {
      debugPrint('Load groups failed: $e');
      emit(GroupsErrorState(e.message));
    } catch (e) {
      debugPrint('Load groups failed: $e');
      emit(GroupsErrorState('Failed to load groups'));
    }
  }

  Future<void> joinGroup(int groupId) async {
    final groupIndex = _suggestedGroups.indexWhere((g) => g.id == groupId);
    if (groupIndex == -1) return;

    emit(GroupJoiningState(
      groupId: groupId,
      myGroups: _myGroups,
      suggestedGroups: _suggestedGroups,
    ));

    try {
      await _groupsRepo.joinGroup(groupId);

      // Move group from suggested to my groups
      final group = _suggestedGroups[groupIndex];
      _suggestedGroups.removeAt(groupIndex);
      _myGroups = [
        group.copyWith(isJoined: true, membersCount: group.membersCount + 1),
        ..._myGroups,
      ];

      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } on ApiException catch (e) {
      debugPrint('Join group failed: $e');
      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } catch (e) {
      debugPrint('Join group failed: $e');
      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    }
  }

  Future<void> leaveGroup(int groupId) async {
    final groupIndex = _myGroups.indexWhere((g) => g.id == groupId);
    if (groupIndex == -1) return;

    emit(GroupLeavingState(
      groupId: groupId,
      myGroups: _myGroups,
      suggestedGroups: _suggestedGroups,
    ));

    try {
      await _groupsRepo.leaveGroup(groupId);

      // Move group from my groups to suggested
      final group = _myGroups[groupIndex];
      _myGroups.removeAt(groupIndex);
      _suggestedGroups = [
        group.copyWith(isJoined: false, membersCount: group.membersCount - 1),
        ..._suggestedGroups,
      ];

      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } on ApiException catch (e) {
      debugPrint('Leave group failed: $e');
      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } catch (e) {
      debugPrint('Leave group failed: $e');
      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    }
  }

  Future<void> refreshGroups() async {
    try {
      final results = await Future.wait([
        _groupsRepo.getMyGroups(),
        _groupsRepo.getSuggestedGroups(),
      ]);

      // My groups are joined, suggested groups are not
      _myGroups = results[0].groups.map((g) => g.copyWith(isJoined: true)).toList();
      _suggestedGroups = results[1].groups.map((g) => g.copyWith(isJoined: false)).toList();

      emit(GroupsLoadedState(
        myGroups: _myGroups,
        suggestedGroups: _suggestedGroups,
      ));
    } on ApiException catch (e) {
      debugPrint('Refresh groups failed: $e');
    } catch (e) {
      debugPrint('Refresh groups failed: $e');
    }
  }
}
