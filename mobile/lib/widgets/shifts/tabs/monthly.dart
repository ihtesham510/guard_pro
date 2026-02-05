import 'package:date_kit/date_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/common/calendar.dart';
import 'package:mobile/widgets/shifts/shift_for_day.dart';

class Monthly extends StatefulWidget {
  final List<Map<String, dynamic>> shifts;
  const Monthly({super.key, required this.shifts});

  @override
  State<Monthly> createState() => _MonthlyState();
}

class _MonthlyState extends State<Monthly> {
  late final List<Map<String, dynamic>> shifts = widget.shifts;

  DateTime _selectedDay = DateTime.now();

  @override
  void initState() {
    super.initState();
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    setState(() {
      _selectedDay = selectedDay;
    });
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

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 12.0),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                format(_selectedDay, 'EEEE, MMMM d'),
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.foreground,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: Calendar(
                  selectedDay: _selectedDay,
                  onDateSelect: (date) {
                    _onDaySelected(date, date);
                  },
                ),
              ),

              ShiftForDay(shifts: shifts, selectedDay: _selectedDay),
            ],
          ),
        ),
      ),
    );
  }
}
