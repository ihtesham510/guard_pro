import 'package:date_kit/date_kit.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class Calendar extends StatelessWidget {
  static const weeks = ['Mo', 'Tu', 'We', 'Tu', 'Fr', 'Sa', 'Su'];
  final ValueChanged<DateTime> onDateSelect;
  final DateTime selectedDay;
  const Calendar({
    super.key,
    required this.onDateSelect,
    required this.selectedDay,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [_buildWeeksDays(), const SizedBox(height: 8), _buildDays()],
    );
  }

  Widget _buildWeeksDays() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: weeks.map((day) {
        return Center(
          child: Text(
            day,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppTheme.mutedForeground,
            ),
          ),
        );
      }).toList(),
    );
  }

  List<DateTime> _getDaysInMonth(DateTime month) {
    final firstDayOfMonth = DateTime(month.year, month.month, 1);
    final lastDayOfMonth = DateTime(month.year, month.month + 1, 0);

    final firstDayWeekday = firstDayOfMonth.weekday % 7;

    final lastDayWeekday = lastDayOfMonth.weekday % 7;

    final daysFromPreviousMonth = firstDayWeekday;

    final daysFromNextMonth = 6 - lastDayWeekday;

    final startDate = firstDayOfMonth.subtract(
      Duration(days: daysFromPreviousMonth),
    );

    final daysInCurrentMonth = lastDayOfMonth.day;
    final totalDays =
        daysFromPreviousMonth + daysInCurrentMonth + daysFromNextMonth;

    final List<DateTime> days = [];
    for (int i = 0; i < totalDays; i++) {
      days.add(startDate.add(Duration(days: i)));
    }

    return days;
  }

  Widget _buildDays() {
    final days = _getDaysInMonth(selectedDay);
    final currentMonth = selectedDay.month;
    final currentYear = selectedDay.year;

    final List<List<DateTime>> weeks = [];
    for (int i = 0; i < days.length; i += 7) {
      weeks.add(days.sublist(i, i + 7 > days.length ? days.length : i + 7));
    }

    return Column(
      spacing: 6,
      children: weeks
          .map((week) => _buildCalendarRow(week, currentMonth, currentYear))
          .toList(),
    );
  }

  Widget _buildCalendarRow(
    List<DateTime> weekDays,
    int currentMonth,
    int currentYear,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: weekDays.map((day) {
        final isCurrentMonth =
            day.month == currentMonth && day.year == currentYear;
        final isSelected = isSameDay(day, selectedDay);
        final isToday = isSameDay(day, DateTime.now());

        return Expanded(
          child: _buildDayCell(day, isCurrentMonth, isSelected, isToday),
        );
      }).toList(),
    );
  }

  Widget _buildDayCell(
    DateTime day,
    bool isCurrentMonth,
    bool isSelected,
    bool isToday,
  ) {
    return GestureDetector(
      onTap: () => onDateSelect(day),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4.0),
        height: 40,
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primary
              : isToday
              ? AppTheme.primary.withValues(alpha: 0.1)
              : Colors.transparent,
          border: Border.all(
            color: isCurrentMonth
                ? AppTheme.mutedForeground
                : AppTheme.mutedForeground.withValues(alpha: 0.5),
          ),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            '${day.day}',
            style: TextStyle(
              fontSize: 14,
              fontWeight: isSelected || isToday
                  ? FontWeight.w600
                  : FontWeight.normal,
              color: isSelected
                  ? AppTheme.primaryForeground
                  : isCurrentMonth
                  ? AppTheme.foreground
                  : Colors.transparent,
            ),
          ),
        ),
      ),
    );
  }
}
