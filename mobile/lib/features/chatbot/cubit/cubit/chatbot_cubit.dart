import 'package:college_project/features/chatbot/cubit/cubit/chatbot_state.dart';
import 'package:college_project/features/chatbot/repo/chatbot_repo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChatbotCubit extends Cubit<ChatbotState> {
  ChatbotCubit() : super(ChatbotInitial());

  static ChatbotCubit get(BuildContext context) => BlocProvider.of(context);

  final ChatbotRepo _chatbotRepo = ChatbotRepo();

  Future<void> getChatbot() async {
    try {
      emit(ChatbotLoading());
      final categories = await _chatbotRepo.getChatbot();
      emit(ChatbotLoaded(categories));
    } catch (e) {
      emit(ChatbotError(e.toString()));
    }
  }
}
