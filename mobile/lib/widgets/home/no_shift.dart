import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';

class NoShiftMessage extends StatelessWidget {
  const NoShiftMessage({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.6,
      child: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(FluentIcons.clock_dismiss_24_regular, size: 42),
            SizedBox(height: 12),
            Text('No Active Shift'),
          ],
        ),
      ),
    );
  }
}
