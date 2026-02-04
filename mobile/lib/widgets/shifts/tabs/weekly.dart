import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/common/date_selector.dart';

class Weekly extends StatefulWidget {
  final List<Map<String, dynamic>> shifts;
  const Weekly({super.key, required this.shifts});

  @override
  State<Weekly> createState() => _WeeklyState();
}

class _WeeklyState extends State<Weekly> {
  late final List<Map<String, dynamic>> shifts = widget.shifts;
  DateTime selectedDay = DateTime.now();

  @override
  void initState() {
    super.initState();
  }

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

  List<DateTime> _getWeekDays(DateTime monday) {
    final startOfTheWeek = startOfWeek(selectedDay);
    final endOfTheWeek = endOfWeek(selectedDay);
    return generateWeekIntervals(startOfTheWeek, endOfTheWeek);
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
        // Range exclusion
        if ((isSameDay(day, from) || day.isAfter(from)) &&
            (isSameDay(day, to) || day.isBefore(to))) {
          return true;
        }
      } else {
        // Single day exclusion
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
    setState(() {
      selectedDay = day;
    });
  }

  void _previousWeek() {
    setState(() {
      selectedDay = selectedDay.subtract(const Duration(days: 7));
    });
  }

  void _nextWeek() {
    setState(() {
      selectedDay = selectedDay.add(const Duration(days: 7));
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
    final weekDays = _getWeekDays(monday);
    final weekRange =
        '${format(weekDays.first, 'MMM dd')} - ${format(weekDays.last, 'MMM dd')}';

    final weekIntervals = generateWeekIntervals(
      monday,
      monday.add(const Duration(days: 6)),
    );

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 20),
              Text(
                format(selectedDay, 'EEEE, MMMM d'),
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.foreground,
                ),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    weekRange,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.foreground,
                    ),
                  ),
                  Row(
                    spacing: 8,
                    children: [
                      GestureDetector(
                        onTap: _previousWeek,
                        child: Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.card,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            FluentIcons.chevron_left_24_regular,
                            color: AppTheme.cardForeground,
                            size: 16,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: _nextWeek,
                        child: Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.card,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            FluentIcons.chevron_right_24_regular,
                            color: AppTheme.cardForeground,
                            size: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 20),
              SizedBox(
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
              ),
              SizedBox(height: 24),
              _buildEventsList(),
              SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEventsList() {
    final shiftsForDay = _getShiftsForDay(selectedDay);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (shiftsForDay.isEmpty)
          Container(
            padding: const EdgeInsets.all(40),
            decoration: BoxDecoration(
              color: AppTheme.card,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    FluentIcons.calendar_cancel_24_regular,
                    size: 48,
                    color: AppTheme.mutedForeground,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'No shifts scheduled',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
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
            final site = shift['site'];
            final siteName = site?['name'] ?? 'Unknown Site';
            final address = site?['address'];
            final addressText = address != null
                ? '${address['address_line_1']}, ${address['city']}'
                : 'No address';
            final startTime = shift['start_time'] ?? 'N/A';
            final endTime = shift['end_time'] ?? 'N/A';
            final shiftName = shift['name'] ?? 'Unnamed Shift';
            final payRate = shift['pay_rate'];

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: AppTheme.card,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(12),
                        topRight: Radius.circular(12),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            FluentIcons.calendar_clock_24_filled,
                            size: 20,
                            color: AppTheme.primary,
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                shiftName,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.cardForeground,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                siteName,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: AppTheme.mutedForeground,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Details
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      children: [
                        _buildDetailRow(
                          FluentIcons.clock_24_filled,
                          'Time',
                          '$startTime - $endTime',
                        ),
                        SizedBox(height: 10),
                        _buildDetailRow(
                          FluentIcons.location_24_filled,
                          'Location',
                          addressText,
                        ),
                        if (payRate != null) ...[
                          SizedBox(height: 10),
                          _buildDetailRow(
                            FluentIcons.money_24_regular,
                            'Pay Rate',
                            '\$$payRate/hr',
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppTheme.background,
            borderRadius: BorderRadius.circular(12),
          ),
          padding: EdgeInsets.all(4),
          child: Icon(icon, size: 18, color: AppTheme.mutedForeground),
        ),
        SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.mutedForeground,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: AppTheme.cardForeground,
                  fontWeight: FontWeight.w500,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
