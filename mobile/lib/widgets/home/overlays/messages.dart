import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';

class MessagesOverlay extends StatelessWidget {
  final VoidCallback onClose;

  const MessagesOverlay({super.key, required this.onClose});

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(FluentIcons.arrow_step_back_16_regular),
            onPressed: onClose,
          ),
          title: const Text('Messages'),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          elevation: 1,
        ),
        body: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            ListTile(
              leading: const CircleAvatar(child: Text("M")),
              title: const Text('Manager'),
              subtitle: const Text('Hey, can you cover a shift on Friday?'),
              onTap: onClose,
            ),
            ListTile(
              leading: const CircleAvatar(child: Text("C")),
              title: const Text('Co-worker'),
              subtitle: const Text('See you tomorrow!'),
              onTap: onClose,
            ),
          ],
        ),
      ),
    );
  }
}
