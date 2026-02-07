import 'package:date_kit/date_kit.dart';
import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/utils/shifts.dart';
import 'package:mobile/widgets/shifts/shift_for_day.dart';
import 'package:mobile/widgets/shifts/tabs/monthly.dart';
import 'package:mobile/widgets/shifts/tabs/weekly.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ShiftsTab extends StatefulWidget {
  const ShiftsTab({super.key});

  @override
  State<ShiftsTab> createState() => _ShiftsTabState();
}

class _ShiftsTabState extends State<ShiftsTab> {
  List<Map<String, dynamic>>? shifts;
  List<Map<String, dynamic>>? leaveRequest;
  DateTime selectedDay = DateTime.now();
  bool weekView = true;
  bool hasLoadedData = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _getShift();
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

  bool _hasShiftsForDay(DateTime day) {
    if (shifts != null) {
      final Shifts shift = Shifts(shifts!);
      final shiftsForDay = shift.getShiftsForDay(day);
      return shiftsForDay.isNotEmpty;
    } else {
      return false;
    }
  }

  void _previous() {
    setState(() {
      selectedDay = selectedDay.subtract(Duration(days: weekView ? 7 : 30));
    });
  }

  void _next() {
    setState(() {
      selectedDay = selectedDay.add(Duration(days: weekView ? 7 : 30));
    });
  }

  void _getShift() async {
    final supabase = Supabase.instance.client;
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final id = user?['id'];

    final shiftsRes = await supabase
        .from('shift_assignment')
        .select(
          '*, shift(*,shift_include_day(*),shift_exclude_day(*),timeEntry(*),site(*,address(*)))',
        )
        .eq('employee_id', id);
    final leaveRes = await supabase
        .from('leave_request')
        .select('*')
        .eq('employee_id', id);
    final List<Map<String, dynamic>> shiftsResponse = shiftsRes
        .map((assignment) => assignment['shift'])
        .where((shift) => shift != null)
        .cast<Map<String, dynamic>>()
        .toList();
    debugPrint('shifts: $shiftsResponse');
    setState(() {
      leaveRequest = leaveRes;
      shifts = shiftsResponse;
      hasLoadedData = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: !hasLoadedData
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Column(
                  children: [
                    if (shifts != null && leaveRequest != null)
                      _showSchedules(shifts!),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _switchView() {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: AppTheme.card,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildTab('Weeks', weekView, () {
              setState(() {
                weekView = true;
              });
            }),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _buildTab('Months', !weekView, () {
              setState(() {
                weekView = false;
              });
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(String label, bool isSelected, GestureTapCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.background : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            color: AppTheme.foreground,
          ),
        ),
      ),
    );
  }

  Widget _showSchedules(List<Map<String, dynamic>> shifts) {
    final weekStart = startOfWeek(selectedDay, weekStartsOn: DateTime.monday);
    final weekEnd = endOfWeek(selectedDay, weekStartsOn: DateTime.monday);
    final monthStart = startOfMonth(selectedDay);
    final monthEnd = endOfMonth(selectedDay);
    final range = weekView
        ? '${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}'
        : '${format(monthStart, 'MMM dd')} - ${format(monthEnd, 'MMM dd')}';

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 20),
            _switchView(),
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
                  range,
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
                      onTap: _previous,
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
                      onTap: _next,
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
            weekView
                ? Weekly(
                    shifts: shifts,
                    selectedDay: selectedDay,
                    hasEvent: (day) {
                      return _hasShiftsForDay(day);
                    },
                    onDaySelected: (day) {
                      setState(() {
                        selectedDay = day;
                      });
                    },
                  )
                : Monthly(
                    shifts: shifts,
                    selectedDay: selectedDay,
                    hasEvent: (day) {
                      return _hasShiftsForDay(day);
                    },
                    onDaySelected: (day) {
                      setState(() {
                        selectedDay = day;
                      });
                    },
                  ),
            SizedBox(height: 24),
            ShiftForDay(shifts: shifts, selectedDay: selectedDay),
            SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
