import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/common/date_selector.dart';

class UpComingShifts extends StatefulWidget {
  final List<Map<String, dynamic>> shifts;
  const UpComingShifts({super.key, required this.shifts});

  @override
  State<UpComingShifts> createState() => _UpComingShiftsState();
}

class _UpComingShiftsState extends State<UpComingShifts> {
  late final shifts = widget.shifts;
  DateTime selectedDate = DateTime.now();

  bool isInInterval(DateTime start, DateTime end, DateTime? current) {
    final now = current ?? DateTime.now();
    return !now.isBefore(start) && !now.isAfter(end);
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

  List<Map<String, dynamic>> getShiftsByDay(DateTime date) {
    final List<Map<String, dynamic>> todaysShifts = [];
    for (var shift in shifts) {
      DateTime shiftStartDate = DateTime.parse(shift['start_date']);
      DateTime? shiftEndDate = shift['end_date'] != null
          ? DateTime.parse(shift['end_date'])
          : null;
      if (shift['type'] == 'one_time' && shiftEndDate != null) {
        if (isInInterval(shiftStartDate, shiftEndDate, date)) {
          todaysShifts.add(shift);
        }
      }
      if (shift['type'] == 'recurring') {
        if (isBefore(shiftStartDate, date) || isSameDay(shiftStartDate, date)) {
          if (!shift['off_days'].contains(format(date, 'EEEE').toLowerCase())) {
            todaysShifts.add(shift);
          }
        }
      }
    }
    return todaysShifts;
  }

  @override
  Widget build(BuildContext context) {
    final startOfTheWeek = startOfWeek(DateTime.now());
    final endOfTheWeek = endOfWeek(DateTime.now());
    final weekIntervals = generateWeekIntervals(startOfTheWeek, endOfTheWeek);
    final currentShifts = getShiftsByDay(selectedDate);
    return Container(
      padding: EdgeInsetsGeometry.symmetric(vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 14,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Upcoming Shifts - This Week",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                SizedBox(height: 6),
                Text(
                  'Range ${format(startOfTheWeek, 'MMM d')} - ${format(endOfTheWeek, 'MMM d')}',
                  style: TextStyle(color: AppTheme.mutedForeground),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: SizedBox(
              height: 95,
              child: ListView.builder(
                itemBuilder: (context, index) {
                  final day = weekIntervals[index];
                  final isSameDate = isSameDay(day, selectedDate);
                  return DateSelector(
                    onTap: (){
                      setState(() {
                        selectedDate = day;
                      });
                    },
                    active: isSameDate,
                    day: day,
                    hasEvent: false,
                  );
                },
                itemCount: weekIntervals.length,
                scrollDirection: Axis.horizontal,
              ),
            ),
          ),
          if (currentShifts.isNotEmpty)
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: currentShifts.length,
              itemBuilder: (context, index) {
                final current = currentShifts[index];
                final date = selectedDate;
                final timing =
                    '${current['start_time']} - ${current['end_time']}';
                final siteName =
                    current['site']['name'] as String? ?? 'No Site Name';

                return Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 4,
                    vertical: 6,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(6.0),
                    child: Row(
                      children: [
                        Container(
                          width: 55,
                          height: 55,
                          decoration: BoxDecoration(
                            color: AppTheme.primary,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppTheme.primary),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                format(date, 'MMM'), // "Jan", "Feb"
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.primaryForeground,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                format(date, 'd'), // "1", "2"
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryForeground,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                siteName,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                timing,
                                style: TextStyle(
                                  color: AppTheme.mutedForeground,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios,
                          size: 16,
                          color: Colors.grey,
                        ),
                      ],
                    ),
                  ),
                );
              },
            )
          else
            SizedBox(
              height: 150,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      FluentIcons.calendar_cancel_24_regular,
                      size: 32,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 8),
                    const Text('No shifts scheduled for this day.'),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
