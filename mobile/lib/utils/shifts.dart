import 'package:date_kit/date_kit.dart';

class Shifts {
  List<Map<String, dynamic>> shifts;
  Shifts(this.shifts);

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

  bool _isDayInOffDays(DateTime day, List<dynamic>? offDays) {
    if (offDays == null || offDays.isEmpty) return false;
    final dayName = format(day, 'EEEE').toLowerCase();
    return offDays.contains(dayName);
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

  List<Map<String, dynamic>> getShiftsForDay(DateTime day) {
    return shifts.where((shift) => _isShiftActiveOnDay(shift, day)).toList();
  }
}
