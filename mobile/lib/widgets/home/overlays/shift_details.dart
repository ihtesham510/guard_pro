import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/widgets/home/info_row.dart';

class ShiftDetailsOverlay extends StatelessWidget {
  final VoidCallback onClose;
  final Map<String, dynamic> shift;

  const ShiftDetailsOverlay({
    super.key,
    required this.onClose,
    required this.shift,
  });

  @override
  Widget build(BuildContext context) {
    final timing = '${shift['start_time']} - ${shift['end_time']}';
    final address =
        '${shift['site']?['address']?['address_line_1']}, ${shift['site']?['address']?['city']}, ${shift['site']?['address']?['state']}';
    final siteName = shift['site']?['name'];

    final shiftStartDate = shift['start_date'] != null
        ? format(DateTime.parse(shift['start_date']), 'MMM d')
        : null;
    final shiftEndDate = shift['end_date'] != null
        ? format(DateTime.parse(shift['end_date']), 'MMM d')
        : null;
    final date = shiftStartDate != null && shiftEndDate != null
        ? '$shiftStartDate - $shiftEndDate'
        : shiftStartDate ?? shiftEndDate;

    return Material(
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(FluentIcons.arrow_step_back_16_regular),
            onPressed: onClose,
          ),
          title: const Text('Shift Details'),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          elevation: 1,
        ),
        body: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            const SizedBox(height: 16),
            InfoRow(
              icon: FluentIcons.building_20_regular,
              text: siteName ?? "N/A",
            ),
            InfoRow(icon: FluentIcons.location_16_regular, text: address),
            InfoRow(icon: FluentIcons.calendar_20_regular, text: date ?? "N/A"),
            InfoRow(icon: FluentIcons.clock_20_regular, text: timing),
          ],
        ),
      ),
    );
  }
}
