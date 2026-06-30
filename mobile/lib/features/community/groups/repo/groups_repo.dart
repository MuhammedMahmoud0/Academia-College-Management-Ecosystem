import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/community/groups/models/groups_response_model.dart';

class GroupsRepo {
  final api = ApiClient();

  Future<GroupsResponseModel> getSuggestedGroups() async {
    try {
      final response = await api.get(Endpoints.communitySuggestedGroups);
      return GroupsResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<GroupsResponseModel> getMyGroups() async {
    try {
      final response = await api.get(Endpoints.communityMyGroups);
      return GroupsResponseModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }

  Future<void> joinGroup(int groupId) async {
    try {
      await api.post(Endpoints.communityJoinGroup(groupId.toString()));
    } on ApiException {
      rethrow;
    }
  }

  Future<void> leaveGroup(int groupId) async {
    try {
      await api.post(Endpoints.communityJoinGroup(groupId.toString()));
    } on ApiException {
      rethrow;
    }
  }
}
