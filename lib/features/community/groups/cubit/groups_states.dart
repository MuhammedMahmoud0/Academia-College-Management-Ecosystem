import 'package:college_project/features/community/groups/models/groups_response_model.dart';

abstract class GroupsStates {}

class GroupsInitialState extends GroupsStates {}

class GroupsLoadingState extends GroupsStates {}

class GroupsLoadedState extends GroupsStates {
  final List<GroupModel> myGroups;
  final List<GroupModel> suggestedGroups;

  GroupsLoadedState({
    required this.myGroups,
    required this.suggestedGroups,
  });
}

class GroupsErrorState extends GroupsStates {
  final String error;

  GroupsErrorState(this.error);
}

class GroupJoiningState extends GroupsStates {
  final int groupId;
  final List<GroupModel> myGroups;
  final List<GroupModel> suggestedGroups;

  GroupJoiningState({
    required this.groupId,
    required this.myGroups,
    required this.suggestedGroups,
  });
}

class GroupLeavingState extends GroupsStates {
  final int groupId;
  final List<GroupModel> myGroups;
  final List<GroupModel> suggestedGroups;

  GroupLeavingState({
    required this.groupId,
    required this.myGroups,
    required this.suggestedGroups,
  });
}
