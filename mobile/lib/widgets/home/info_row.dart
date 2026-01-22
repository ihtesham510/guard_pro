import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const InfoRow({super.key, required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Icon(icon, size: 18, color: AppTheme.primary),
            const SizedBox(width: 8),
            Text(text, style: TextStyle(fontSize: 14)),
          ],
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}
