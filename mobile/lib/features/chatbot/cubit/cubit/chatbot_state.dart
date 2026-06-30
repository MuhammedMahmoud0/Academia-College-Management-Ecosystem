import 'package:college_project/features/chatbot/models/chatbot_model.dart';

class ChatbotState {}

final class ChatbotInitial extends ChatbotState {}

final class ChatbotLoading extends ChatbotState {}

final class ChatbotLoaded extends ChatbotState {
  final ChatbotCategoriesModel categories;

  ChatbotLoaded(this.categories);
}

final class ChatbotError extends ChatbotState {
  final String error;

  ChatbotError(this.error);
}
