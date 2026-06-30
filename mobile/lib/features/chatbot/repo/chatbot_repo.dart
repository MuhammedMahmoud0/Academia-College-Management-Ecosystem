import 'package:college_project/core/constants/endpoints.dart';
import 'package:college_project/core/data/network/api_client.dart';
import 'package:college_project/core/data/network/api_exception.dart';
import 'package:college_project/features/chatbot/models/chatbot_model.dart';

class ChatbotRepo {
  final api = ApiClient();

  Future<ChatbotCategoriesModel> getChatbot() async {
    try {
      final response = await api.get(Endpoints.faq);
      return ChatbotCategoriesModel.fromJson(response.data);
    } on ApiException {
      rethrow;
    }
  }
}
