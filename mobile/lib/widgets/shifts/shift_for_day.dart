import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/utils/shifts.dart';
import 'package:mobile/widgets/common/shift_info.dart';

class ShiftForDay extends StatelessWidget {
  final List<Map<String, dynamic>> shifts;
  final DateTime selectedDay;
  final Function(Map<String, dynamic>)? onShiftTap;
  const ShiftForDay({
    super.key,
    required this.shifts,
    required this.selectedDay,
    this.onShiftTap,
  });

  @override
  Widget build(BuildContext context) {
    final Shifts shift = Shifts(shifts);
    final shiftsForDay = shift.getShiftsForDay(selectedDay);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (shiftsForDay.isNotEmpty)
          Row(
            spacing: 6,
            children: [
              Text(
                'Shifts for Day',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.foreground,
                ),
              ),
              CircleAvatar(
                radius: 14,
                backgroundColor: AppTheme.primary.withValues(alpha: 0.04),
                child: Text(
                  shiftsForDay.length.toString(),
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                  ),
                ),
              ),
            ],
          ),
        const SizedBox(height: 12),
        if (shiftsForDay.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 34.0),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SvgPicture.asset(
                    'assets/svgs/empty.svg',
                    width: 170,
                    height: 170,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No shifts scheduled',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.foreground,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Select another day to view other shifts.',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.mutedForeground,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ...shiftsForDay.asMap().entries.map((entry) {
            final shift = entry.value;
            return ShiftInfo(
              shift: shift,
              onTap: onShiftTap != null ? () => onShiftTap!(shift) : null,
            );
          }),
      ],
    );
  }
}
