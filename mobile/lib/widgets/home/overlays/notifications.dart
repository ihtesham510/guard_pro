import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';

class NotificationsOverlay extends StatelessWidget {
  final VoidCallback onClose;
  const NotificationsOverlay({super.key, required this.onClose});

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(FluentIcons.arrow_step_back_16_regular),
            onPressed: onClose,
          ),
          title: const Text('Notifications'),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          elevation: 1,
        ),
        body: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            ListTile(
              leading: const Icon(FluentIcons.alert_24_regular),
              title: const Text('New shift assigned'),
              subtitle: const Text(
                'A new shift has been assigned to you for tomorrow.',
              ),
              onTap: onClose,
            ),
            ListTile(
              leading: const Icon(FluentIcons.comment_24_regular),
              title: const Text('New message'),
              subtitle: const Text('You have a new message from your manager.'),
              onTap: onClose,
            ),
            ListTile(
              leading: const Icon(FluentIcons.clock_alarm_24_regular),
              title: const Text('Shift Reminder'),
              subtitle: const Text('Your shift starts in 1 hour.'),
              onTap: onClose,
            ),
          ],
        ),
      ),
    );
  }
}
