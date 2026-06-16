// lib/features/chatbot/widgets/chatbot_bottom_sheet.dart

import 'dart:convert';
import 'package:college_project/features/chatbot/cubit/cubit/chatbot_cubit.dart';
import 'package:college_project/features/chatbot/cubit/cubit/chatbot_state.dart';
import 'package:college_project/features/chatbot/widgets/chatbot_widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:college_project/features/chatbot/models/chatbot_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// ─── Entry Point ──────────────────────────────────────────────────────────────

Future<void> showChatbotSheet(BuildContext context, {required bool isDark}) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    useRootNavigator: true,
    useSafeArea: true,
    builder: (_) => Directionality(
      textDirection: TextDirection.rtl,
      child: BlocProvider(
        create: (context) => ChatbotCubit()..getChatbot(),
        child: ChatbotSheet(isDark: isDark),
      ),
    ),
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────

class ChatbotSheet extends StatefulWidget {
  final bool isDark;
  const ChatbotSheet({super.key, required this.isDark});

  @override
  State<ChatbotSheet> createState() => _ChatbotSheetState();
}

class _ChatbotSheetState extends State<ChatbotSheet> {
  List<ChatCategory> _categories = [];
  bool _isLoading = true;

  // navigation
  ChatCategory? _selectedCategory;
  QuestionAnswer? _selectedQuestion;

  // chat
  final _inputController = TextEditingController();
  final _inputFocusNode = FocusNode();
  final _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    //  _loadData();
  }

  @override
  void dispose() {
    _inputController.dispose();
    _inputFocusNode.dispose();
    _scrollController.dispose();
    super.dispose();
  }
  /*
  Future<void> _loadData() async {
    try {
      final json = await rootBundle.loadString('assets/data/chatbot_data.json');
      final data = jsonDecode(json);
      setState(() {
        _categories = (data['categories'] as List)
            .map((c) => ChatCategory.fromJson(c))
            .toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }
*/
  // ── Send Message ─────────────────────────────────────────────────────────

  Future<void> _sendMessage() async {
    final text = _inputController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(
        ChatMessage(text: text, isUser: true, time: DateTime.now()),
      );
      _isTyping = true;
    });

    _inputController.clear();
    _scrollToBottom();

    // TODO: استبدل الـ delay ده بـ AI API call
    await Future.delayed(const Duration(milliseconds: 1200));

    setState(() {
      _isTyping = false;
      _messages.add(
        ChatMessage(
          text:
              'شكراً على سؤالك! 🎓\nهذه الخاصية قيد التطوير وسيتم دعم الذكاء الاصطناعي قريباً للإجابة على جميع استفساراتك.',
          isUser: false,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  String get _title {
    if (_messages.isNotEmpty) return 'محادثة مع المساعد';
    if (_selectedQuestion != null) return _selectedCategory!.title;
    if (_selectedCategory != null) return _selectedCategory!.title;
    return 'مساعد الكلية 🎓';
  }

  bool get _canGoBack =>
      (_selectedQuestion != null || _selectedCategory != null) &&
      _messages.isEmpty;

  void _goBack() {
    setState(() {
      if (_selectedQuestion != null) {
        _selectedQuestion = null;
      } else if (_selectedCategory != null) {
        _selectedCategory = null;
      }
    });
  }

  // ── Colors ───────────────────────────────────────────────────────────────

  Color get _bgColor => widget.isDark ? const Color(0xFF1E1E2E) : Colors.white;

  Color get _cardColor =>
      widget.isDark ? const Color(0xFF2A2A3E) : const Color(0xFFF8F9FF);

  Color get _textColor =>
      widget.isDark ? Colors.white : const Color(0xFF1A1A2E);

  Color get _subtitleColor =>
      widget.isDark ? Colors.white60 : const Color(0xFF6B7280);

  Color get _dividerColor =>
      widget.isDark ? Colors.white12 : const Color(0xFFE5E7EB);

  // ─────────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ChatbotCubit, ChatbotState>(
      listener: (context, state) {
        if (state is ChatbotLoading) {
          _isLoading = true;
        }
        if (state is ChatbotLoaded) {
          _categories = state.categories.categories;
          _isLoading = false;
        }
        if (state is ChatbotError) {
          _isLoading = false;
        }
      },
      builder: (context, state) {
        return DraggableScrollableSheet(
          initialChildSize: 0.85,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (_, scrollController) => Container(
            decoration: BoxDecoration(
              color: _bgColor,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(28),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.15),
                  blurRadius: 20,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: Column(
              children: [
                _buildHandle(),
                _buildHeader(),
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: Color(0xFF6C63FF),
                          ),
                        )
                      : _buildBody(scrollController),
                ),
                //   _buildInputBar(),
              ],
            ),
          ),
        );
      },
    );
  }

  // ── Handle ───────────────────────────────────────────────────────────────

  Widget _buildHandle() => Padding(
    padding: const EdgeInsets.symmetric(vertical: 12),
    child: Container(
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: _dividerColor,
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  );

  // ── Header ───────────────────────────────────────────────────────────────

  Widget _buildHeader() => Padding(
    padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
    child: Row(
      children: [
        // bot avatar
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF6C63FF), Color(0xFF3B82F6)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(
            Icons.support_agent_rounded,
            color: Colors.white,
            size: 24,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _title,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: _textColor,
                ),
              ),
              if (_selectedCategory == null &&
                  _selectedQuestion == null &&
                  _messages.isEmpty)
                Text(
                  'اختر تصنيفاً أو اكتب سؤالك',
                  style: TextStyle(fontSize: 13, color: _subtitleColor),
                ),
            ],
          ),
        ),
        if (_canGoBack) ...[
          const SizedBox(width: 12),
          GestureDetector(
            onTap: _goBack,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _cardColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 18,
                color: Color(0xFF6C63FF),
              ),
            ),
          ),
        ],
      ],
    ),
  );

  // ── Body Router ──────────────────────────────────────────────────────────

  Widget _buildBody(ScrollController sc) {
    if (_messages.isNotEmpty) return _buildChatView();
    if (_selectedQuestion != null) return _buildAnswerView(sc);
    if (_selectedCategory != null) return _buildQuestionsView(sc);
    return _buildCategoriesGrid(sc);
  }

  // ── Categories Grid ──────────────────────────────────────────────────────

  Widget _buildCategoriesGrid(ScrollController sc) {
    return GridView.builder(
      controller: sc,
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 32),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        childAspectRatio: 1.1,
      ),
      itemCount: _categories.length,
      itemBuilder: (_, i) => _CategoryCard(
        category: _categories[i],
        isDark: widget.isDark,
        cardColor: _cardColor,
        textColor: _textColor,
        subtitleColor: _subtitleColor,
        onTap: () => setState(() => _selectedCategory = _categories[i]),
      ),
    );
  }

  // ── Questions List ───────────────────────────────────────────────────────

  Widget _buildQuestionsView(ScrollController sc) {
    final cat = _selectedCategory!;
    final catColor = ChatBotWidgets.colorFromHex(cat.color);

    return ListView.separated(
      controller: sc,
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 32),
      itemCount: cat.questions.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (_, i) {
        final qa = cat.questions[i];
        return _QuestionTile(
          qa: qa,
          catColor: catColor,
          isDark: widget.isDark,
          cardColor: _cardColor,
          textColor: _textColor,
          subtitleColor: _subtitleColor,
          onTap: () => setState(() => _selectedQuestion = qa),
        );
      },
    );
  }

  // ── Answer View ──────────────────────────────────────────────────────────

  Widget _buildAnswerView(ScrollController sc) {
    final qa = _selectedQuestion!;
    final catColor = ChatBotWidgets.colorFromHex(_selectedCategory!.color);

    return SingleChildScrollView(
      controller: sc,
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Question bubble
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  catColor.withValues(alpha: 0.15),
                  catColor.withValues(alpha: 0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: catColor.withValues(alpha: 0.3),
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.help_outline_rounded, color: catColor, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      'السؤال',
                      style: TextStyle(
                        color: catColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  qa.question,
                  textDirection: TextDirection.rtl,
                  style: TextStyle(
                    color: _textColor,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Answer bubble
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: _cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _dividerColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF6C63FF), Color(0xFF3B82F6)],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.support_agent_rounded,
                        color: Colors.white,
                        size: 14,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'الإجابة',
                      style: TextStyle(
                        color: const Color(0xFF6C63FF),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  qa.answer,
                  textDirection: TextDirection.rtl,
                  style: TextStyle(
                    color: _textColor,
                    fontSize: 15,
                    height: 1.7,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Back to questions button
          GestureDetector(
            onTap: () => setState(() => _selectedQuestion = null),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFF6C63FF).withValues(alpha: 0.3),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'عرض أسئلة أخرى',
                    style: TextStyle(
                      color: Color(0xFF6C63FF),
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  SizedBox(width: 8),
                  Icon(
                    Icons.arrow_forward_rounded,
                    color: Color(0xFF6C63FF),
                    size: 18,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Chat View ─────────────────────────────────────────────────────────────

  Widget _buildChatView() {
    return Column(
      children: [
        // زرار الرجوع للتصنيفات
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
          child: GestureDetector(
            onTap: () {
              setState(() {
                _messages.clear();
                _selectedCategory = null;
                _selectedQuestion = null;
              });
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF6C63FF).withValues(alpha: 0.2),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.grid_view_rounded,
                    color: Color(0xFF6C63FF),
                    size: 16,
                  ),
                  SizedBox(width: 8),
                  Text(
                    "back to questions",
                    style: TextStyle(
                      color: Color(0xFF6C63FF),
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        // messages list
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
            itemCount: _messages.length + (_isTyping ? 1 : 0),
            itemBuilder: (_, i) {
              if (i == _messages.length) return _buildTypingIndicator();
              return _buildMessageBubble(_messages[i]);
            },
          ),
        ),
      ],
    );
  }

  // ── Message Bubble ────────────────────────────────────────────────────────

  Widget _buildMessageBubble(ChatMessage msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: msg.isUser
            ? MainAxisAlignment.start
            : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!msg.isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6C63FF), Color(0xFF3B82F6)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.support_agent_rounded,
                color: Colors.white,
                size: 16,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: msg.isUser ? const Color(0xFF6C63FF) : _cardColor,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(18),
                  topRight: const Radius.circular(18),
                  bottomLeft: msg.isUser
                      ? const Radius.circular(18)
                      : const Radius.circular(4),
                  bottomRight: msg.isUser
                      ? const Radius.circular(4)
                      : const Radius.circular(18),
                ),
                border: msg.isUser ? null : Border.all(color: _dividerColor),
              ),
              child: Text(
                msg.text,
                textDirection: TextDirection.rtl,
                style: TextStyle(
                  color: msg.isUser ? Colors.white : _textColor,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
            ),
          ),
          if (msg.isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: const Color(0xFF6C63FF).withValues(alpha: 0.15),
              child: const Icon(
                Icons.person_rounded,
                size: 18,
                color: Color(0xFF6C63FF),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── Typing Indicator ──────────────────────────────────────────────────────

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6C63FF), Color(0xFF3B82F6)],
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.support_agent_rounded,
              color: Colors.white,
              size: 16,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: _cardColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
                bottomRight: Radius.circular(18),
                bottomLeft: Radius.circular(4),
              ),
              border: Border.all(color: _dividerColor),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildDot(0),
                const SizedBox(width: 4),
                _buildDot(1),
                const SizedBox(width: 4),
                _buildDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int index) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + (index * 200)),
      builder: (_, value, __) => AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: const Color(0xFF6C63FF).withValues(alpha: 0.3 + (value * 0.7)),
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  // ── Input Bar ─────────────────────────────────────────────────────────────

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      decoration: BoxDecoration(
        color: _bgColor,
        border: Border(top: BorderSide(color: _dividerColor)),
      ),
      child: Row(
        children: [
          // text field أول عشان RTL
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: _cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _dividerColor),
              ),
              child: TextField(
                controller: _inputController,
                focusNode: _inputFocusNode,
                textAlign: TextAlign.right,
                maxLines: 3,
                minLines: 1,
                onSubmitted: (_) => _sendMessage(),
                style: TextStyle(color: _textColor, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'اكتب سؤالك هنا...',
                  hintStyle: TextStyle(color: _subtitleColor, fontSize: 14),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // send button على الشمال
          GestureDetector(
            onTap: _sendMessage,
            child: Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6C63FF), Color(0xFF3B82F6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6C63FF).withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.send_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Category Card ────────────────────────────────────────────────────────────

class _CategoryCard extends StatelessWidget {
  final ChatCategory category;
  final bool isDark;
  final Color cardColor;
  final Color textColor;
  final Color subtitleColor;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.category,
    required this.isDark,
    required this.cardColor,
    required this.textColor,
    required this.subtitleColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = ChatBotWidgets.colorFromHex(category.color);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.2), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: isDark ? 0.1 : 0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                ChatBotWidgets.iconFromName(category.iconName),
                color: color,
                size: 24,
              ),
            ),
            const Spacer(),
            Text(
              category.title,
              textDirection: TextDirection.rtl,
              style: TextStyle(
                color: textColor,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                height: 1.3,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              '${category.questions.length} سؤال',
              style: TextStyle(color: subtitleColor, fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Question Tile ────────────────────────────────────────────────────────────

class _QuestionTile extends StatelessWidget {
  final QuestionAnswer qa;
  final Color catColor;
  final bool isDark;
  final Color cardColor;
  final Color textColor;
  final Color subtitleColor;
  final String? badge;
  final VoidCallback onTap;

  const _QuestionTile({
    required this.qa,
    required this.catColor,
    required this.isDark,
    required this.cardColor,
    required this.textColor,
    required this.subtitleColor,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: catColor.withValues(alpha: 0.15), width: 1),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // arrow على اليسار عشان RTL
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: catColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.arrow_back_ios_rounded,
                color: catColor,
                size: 14,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (badge != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: catColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        badge!,
                        style: TextStyle(
                          color: catColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                  ],
                  Text(
                    qa.question,
                    textDirection: TextDirection.rtl,
                    style: TextStyle(
                      color: textColor,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
