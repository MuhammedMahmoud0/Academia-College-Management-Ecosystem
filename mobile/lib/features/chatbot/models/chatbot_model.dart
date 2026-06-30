class ChatbotCategoriesModel {
  List<ChatCategory> categories;

  ChatbotCategoriesModel({required this.categories});

  factory ChatbotCategoriesModel.fromJson(Map<String, dynamic> json) =>
      ChatbotCategoriesModel(
        categories: (json['categories'] as List)
            .map((c) => ChatCategory.fromJson(c))
            .toList(),
      );
}

class ChatCategory {
  final String id;
  final String title;
  final String iconName;
  final String color;
  final List<QuestionAnswer> questions;

  ChatCategory({
    required this.id,
    required this.title,
    required this.iconName,
    required this.color,
    required this.questions,
  });

  factory ChatCategory.fromJson(Map<String, dynamic> json) => ChatCategory(
    id: json['id'],
    title: json['title'],
    iconName: json['icon'],
    color: json['color'],
    questions: (json['questions'] as List)
        .map((q) => QuestionAnswer.fromJson(q))
        .toList(),
  );
}

class QuestionAnswer {
  final String id;
  final String question;
  final String answer;

  QuestionAnswer({
    required this.id,
    required this.question,
    required this.answer,
  });

  factory QuestionAnswer.fromJson(Map<String, dynamic> json) => QuestionAnswer(
    id: json['id'],
    question: json['question'],
    answer: json['answer'],
  );
}

// ─── Chat Message Model ───────────────────────────────────────────────────────

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime time;

  ChatMessage({required this.text, required this.isUser, required this.time});
}
