import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/common/date_selector.dart';

class Weekly extends StatelessWidget {
  final DateTime selectedDay;
  final List<Map<String, dynamic>> shifts;
  final ValueChanged<DateTime> onDaySelected;
  final bool Function(DateTime) hasEvent;
  const Weekly({
    super.key,
    required this.shifts,
    required this.selectedDay,
    required this.onDaySelected,
    required this.hasEvent,
  });

  List<DateTime> generateWeekIntervals(DateTime startDate, DateTime endDate) {
    List<DateTime> intervals = [];
    DateTime current = startDate;

    while (current.isBefore(endDate) || current.isAtSameMomentAs(endDate)) {
      intervals.add(current);
      current = current.add(const Duration(days: 1));
    }

    return intervals;
  }

  DateTime _getMonday(DateTime date) {
    final dayOfWeek = date.weekday;
    return date.subtract(Duration(days: dayOfWeek - 1));
  }

  bool _isDayInOffDays(DateTime day, List<dynamic>? offDays) {
    if (offDays == null || offDays.isEmpty) return false;
    final dayName = format(day, 'EEEE').toLowerCase();
    return offDays.contains(dayName);
  }

  bool _isDayInExcludeDays(
    DateTime day,
    List<Map<String, dynamic>>? excludeDays,
  ) {
    if (excludeDays == null || excludeDays.isEmpty) return false;

    for (var exclude in excludeDays) {
      final from = DateTime.parse(exclude['from']);
      final to = exclude['to'] != null ? DateTime.parse(exclude['to']) : null;

      if (to != null) {
        if ((isSameDay(day, from) || day.isAfter(from)) &&
            (isSameDay(day, to) || day.isBefore(to))) {
          return true;
        }
      } else {
        if (isSameDay(day, from)) {
          return true;
        }
      }
    }
    return false;
  }

  bool _isDayInIncludeDays(
    DateTime day,
    List<Map<String, dynamic>>? includeDays,
  ) {
    if (includeDays == null || includeDays.isEmpty) return false;

    for (var include in includeDays) {
      final startDate = DateTime.parse(include['start_date']);
      final endDate = include['end_date'] != null
          ? DateTime.parse(include['end_date'])
          : null;

      if (endDate != null) {
        if ((isSameDay(day, startDate) || day.isAfter(startDate)) &&
            (isSameDay(day, endDate) || day.isBefore(endDate))) {
          return true;
        }
      } else {
        if (isSameDay(day, startDate)) {
          return true;
        }
      }
    }
    return false;
  }

  bool _isShiftActiveOnDay(Map<String, dynamic> shift, DateTime day) {
    final type = shift['type'];
    final startDate = DateTime.parse(shift['start_date']);
    final endDate = shift['end_date'] != null
        ? DateTime.parse(shift['end_date'])
        : null;
    final offDays = shift['off_days'] as List<dynamic>?;
    final excludeDays = (shift['shift_exclude_day'] as List<dynamic>?)
        ?.cast<Map<String, dynamic>>();

    final includeDays = (shift['shift_include_day'] as List<dynamic>?)
        ?.cast<Map<String, dynamic>>();
    final terminated = shift['terminated'] ?? false;

    if (terminated) return false;

    if (type == 'recurring') {
      if (_isDayInExcludeDays(day, excludeDays)) {
        return false;
      }

      if (_isDayInOffDays(day, offDays)) {
        return false;
      }

      if (day.isBefore(startDate) && !isSameDay(day, startDate)) {
        return false;
      }

      if (endDate != null && day.isAfter(endDate) && !isSameDay(day, endDate)) {
        return false;
      }

      return true;
    } else if (type == 'one_time') {
      if (_isDayInExcludeDays(day, excludeDays)) {
        return false;
      }

      if (_isDayInIncludeDays(day, includeDays)) {
        return true;
      }

      if (endDate != null) {
        return (isSameDay(day, startDate) || day.isAfter(startDate)) &&
            (isSameDay(day, endDate) || day.isBefore(endDate));
      } else {
        return isSameDay(day, startDate);
      }
    }

    return false;
  }

  List<Map<String, dynamic>> _getShiftsForDay(DateTime day) {
    return shifts.where((shift) => _isShiftActiveOnDay(shift, day)).toList();
  }

  int _getEventsForDay(DateTime day) {
    return _getShiftsForDay(day).length;
  }

  void _onDaySelected(DateTime day) {
    onDaySelected(day);
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
              Icon(
                FluentIcons.calendar_empty_24_regular,
                size: 64,
                color: AppTheme.mutedForeground,
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

    final monday = _getMonday(selectedDay);

    final weekIntervals = generateWeekIntervals(
      monday,
      monday.add(const Duration(days: 6)),
    );
    return SizedBox(
      height: 95,
      child: ListView.builder(
        itemBuilder: (context, index) {
          final day = weekIntervals[index];
          final isSameDate = isSameDay(day, selectedDay);
          final events = _getEventsForDay(day);
          final hasEvents = events > 0;

          return DateSelector(
            active: isSameDate,
            day: day,
            hasEvent: hasEvents,
            onTap: () {
              _onDaySelected(day);
            },
          );
        },
        itemCount: weekIntervals.length,
        scrollDirection: Axis.horizontal,
      ),
    );
  }
}
