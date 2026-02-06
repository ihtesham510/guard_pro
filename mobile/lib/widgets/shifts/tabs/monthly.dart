import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/common/calendar.dart';

class Monthly extends StatelessWidget {
  final ValueChanged<DateTime> onDaySelected;
  final DateTime selectedDay;
  final List<Map<String, dynamic>> shifts;
  const Monthly({
    super.key,
    required this.onDaySelected,
    required this.selectedDay,
    required this.shifts,
  });

  void _onDaySelected(DateTime selectedDay) {
    onDaySelected(selectedDay);
  }

  @override
  Widget build(BuildContext context) {
    if (shifts.isEmpty) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SvgPicture.asset(
                'assets/svgs/empty.svg',
                width: 170,
                height: 170,
              ),
              SizedBox(height: 16),
              Text(
                'No shifts available',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.foreground,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'You don\'t have any shifts assigned yet',
                style: TextStyle(fontSize: 14, color: AppTheme.mutedForeground),
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Calendar(
        selectedDay: selectedDay,
        onDateSelect: (date) {
          _onDaySelected(date);
        },
      ),
    );
  }
}
