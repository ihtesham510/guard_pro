import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class CheckInOverlay extends StatelessWidget {
  final VoidCallback onClose;
  final Map<String, dynamic> shift;

  const CheckInOverlay({super.key, required this.onClose, required this.shift});

  void _performCheckIn(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Successfully Checked In!'),
        backgroundColor: Colors.green,
      ),
    );

    onClose();
  }

  @override
  Widget build(BuildContext context) {
    final siteName = shift['site']?['name'] ?? 'the shift';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm Check-In'),
        leading: IconButton(icon: const Icon(Icons.close), onPressed: onClose),
        elevation: 0,
        backgroundColor: AppTheme.card,
        foregroundColor: AppTheme.foreground,
      ),
      backgroundColor: AppTheme.card,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: AppTheme.muted,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.border),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      FluentIcons.map_24_regular,
                      size: 48,
                      color: AppTheme.mutedForeground,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Map will be displayed here',
                      style: TextStyle(color: AppTheme.mutedForeground),
                    ),
                  ],
                ),
              ),
            ),
            const Spacer(),
            Icon(
              FluentIcons.qr_code_24_regular,
              size: 48,
              color: AppTheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Your Shift at $siteName',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Please confirm you are at the location and ready to check in.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: AppTheme.mutedForeground),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () => _performCheckIn(context),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              child: const Text('Confirm Check-In'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: onClose,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Cancel'),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
