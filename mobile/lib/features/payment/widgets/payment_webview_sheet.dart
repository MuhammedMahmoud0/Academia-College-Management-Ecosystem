import 'package:college_project/core/styles/app_colors.dart';
import 'package:college_project/core/styles/text_styles.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PaymentWebViewSheet extends StatefulWidget {
  final String url;
  final bool isDark;

  const PaymentWebViewSheet({
    super.key,
    required this.url,
    required this.isDark,
  });

  static Future<bool?> show(
    BuildContext context, {
    required String url,
    required bool isDark,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (_) => PaymentWebViewSheet(url: url, isDark: isDark),
    );
  }

  @override
  State<PaymentWebViewSheet> createState() => _PaymentWebViewSheetState();
}

class _PaymentWebViewSheetState extends State<PaymentWebViewSheet> {
  late final WebViewController _controller;
  int _progress = 0;
  bool _completed = false;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppColors.getBackground(widget.isDark))
      ..addJavaScriptChannel(
        'PaymentResult',
        onMessageReceived: (message) {
          if (message.message == 'approved') _handleApproved();
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) {
            if (mounted) setState(() => _progress = progress);
          },
          onUrlChange: (change) {
            final url = change.url?.toLowerCase() ?? '';
            if (url.contains('approved') ||
                url.contains('success') ||
                url.contains('completed')) {
              _handleApproved();
            }
          },
          onPageFinished: (_) => _checkForApproved(),
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  Future<void> _checkForApproved() async {
    try {
      await _controller.runJavaScript('''
        (function() {
          try {
            var text = document.body ? document.body.innerText.toLowerCase() : '';
            if (text.indexOf('approved') !== -1) {
              PaymentResult.postMessage('approved');
            }
          } catch (e) {}
        })();
      ''');
    } catch (_) {}
  }

  void _handleApproved() {
    if (!mounted || _completed) return;
    _completed = true;
    Navigator.of(context).pop(true);
  }

  Future<void> _confirmClose() async {
    final shouldClose = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.getCardBackground(widget.isDark),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Cancel Payment?',
          style: AppTextStyles.heading3.copyWith(
            color: AppColors.getTextColor(widget.isDark),
          ),
        ),
        content: Text(
          'Are you sure you want to close the payment window? Any unfinished payment will be cancelled.',
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.getSubtitleColor(widget.isDark),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(
              'Continue',
              style: AppTextStyles.button.copyWith(
                color: AppColors.primaryColor,
              ),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(
              'Close',
              style: AppTextStyles.button.copyWith(color: AppColors.errorColor),
            ),
          ),
        ],
      ),
    );

    if (shouldClose == true && mounted) {
      Navigator.of(context).pop(_completed);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.isDark;
    final mediaQuery = MediaQuery.of(context);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _confirmClose();
      },
      child: Padding(
        padding: EdgeInsets.only(top: mediaQuery.padding.top + 24),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          child: Container(
            color: AppColors.getBackground(isDark),
            child: Column(
              children: [
                _buildHeader(isDark),
                if (_progress < 100)
                  LinearProgressIndicator(
                    value: _progress / 100,
                    backgroundColor: AppColors.getBorderColor(isDark),
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppColors.primaryColor,
                    ),
                    minHeight: 2,
                  ),
                Expanded(child: WebViewWidget(controller: _controller)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(bool isDark) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 8, 12),
      decoration: BoxDecoration(
        color: AppColors.getCardBackground(isDark),
        border: Border(
          bottom: BorderSide(color: AppColors.getBorderColor(isDark)),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primaryColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.lock_rounded,
              color: AppColors.primaryColor,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Secure Checkout',
                  style: AppTextStyles.heading3.copyWith(
                    color: AppColors.getTextColor(isDark),
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  'Powered by Paymob',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.getSubtitleColor(isDark),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(
              Icons.close_rounded,
              color: AppColors.getTextColor(isDark),
            ),
            onPressed: _confirmClose,
          ),
        ],
      ),
    );
  }
}
