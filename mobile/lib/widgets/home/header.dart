import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/home/avatar.dart';

class HomeHeader extends StatelessWidget {
  final Map<String, dynamic>? user;
  final VoidCallback onMessagesPressed;
  final VoidCallback onNotificationsPressed;

  const HomeHeader({
    super.key,
    required this.user,
    required this.onMessagesPressed,
    required this.onNotificationsPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row(
          children: [
            Avatar(
              imageUrl: user?['image_url'],
              placeholder: const Icon(FluentIcons.person_16_filled),
              onTap: () => context.go('/profile'),
            ),
            const SizedBox(width: 10),
            if (user != null)
              Text(
                user!['first_name'],
                style: Theme.of(context).textTheme.headlineSmall,
              ),
          ],
        ),
        Row(
          children: [
            IconButton(
              icon: const Icon(FluentIcons.comment_16_filled),
              padding: const EdgeInsets.all(8),
              style: IconButton.styleFrom(backgroundColor: AppTheme.muted),
              onPressed: onMessagesPressed,
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(FluentIcons.alert_16_filled),
              padding: const EdgeInsets.all(8),
              style: IconButton.styleFrom(backgroundColor: AppTheme.muted),
              onPressed: onNotificationsPressed,
            ),
          ],
        ),
      ],
    );
  }
}
