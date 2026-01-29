import 'package:date_kit/date_kit.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class Event {
  final String title;
  final String subtitle;
  final DateTime startTime;
  final DateTime endTime;

  Event({
    required this.title,
    required this.subtitle,
    required this.startTime,
    required this.endTime,
  });

  String get formattedTime {
    final startHour = format(startTime, 'HH:mm');
    final endHour = format(endTime, 'HH:mm');
    return '$startHour-$endHour';
  }
}

class EventCard extends StatelessWidget {
  final Event event;

  const EventCard({super.key, required this.event});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.border),
        ),
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: AppTheme.primary,
                shape: BoxShape.circle,
              ),
              margin: const EdgeInsets.only(right: 12, top: 4),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.formattedTime,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.mutedForeground,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    event.title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.cardForeground,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    event.subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.mutedForeground,
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
