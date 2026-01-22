import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/widgets/home/info_row.dart';

class ShiftInfoCard extends StatelessWidget {
  final Map<String, dynamic> shift;
  final VoidCallback onCheckIn;
  final VoidCallback onViewDetails;

  const ShiftInfoCard({
    super.key,
    required this.shift,
    required this.onCheckIn,
    required this.onViewDetails,
  });

  DateTime getCurrentOrNextShiftStartDate() {
    return DateTime.now();
  }

  @override
  Widget build(BuildContext context) {
    final timing = '${shift['start_time']} - ${shift['end_time']}';
    final address =
        '${shift['site']['address']['address_line_1']}, ${shift['site']['address']['city']}, ${shift['site']['address']['state']}';
    final siteName = shift['site']['name'];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
              child: const Text(
                'Your Next Shift Starts Soon',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 16),
            InfoRow(
              icon: FluentIcons.calendar_20_regular,
              text: format(shift['date'] ?? DateTime.now(), 'MMM d'),
            ),
            InfoRow(icon: FluentIcons.clock_20_regular, text: timing),
            InfoRow(icon: FluentIcons.building_20_regular, text: siteName),
            InfoRow(icon: FluentIcons.location_16_regular, text: address),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: shift['date'] != null ? null : onCheckIn,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Check In', style: TextStyle(fontSize: 16)),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: onViewDetails,
                child: const Text('View Details'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
