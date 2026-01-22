import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class NoShiftCard extends StatelessWidget {
  const NoShiftCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: AppTheme.border),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              FluentIcons.weather_sunny_24_regular,
              color: AppTheme.primary,
              size: 28,
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'No Shifts Today',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Enjoy your day off!',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.mutedForeground,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
