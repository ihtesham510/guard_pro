import 'package:date_kit/date_kit.dart';
import 'package:flutter/material.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/widgets/common/overlays/shift_details.dart';
import 'package:mobile/widgets/home/header.dart';
import 'package:mobile/widgets/home/no_shift.dart';
import 'package:mobile/widgets/home/no_shift_card.dart';
import 'package:mobile/widgets/home/overlays/check_in.dart';
import 'package:mobile/widgets/home/overlays/messages.dart';
import 'package:mobile/widgets/home/overlays/notifications.dart';
import 'package:mobile/widgets/home/shift_info.dart';
import 'package:mobile/widgets/home/upcoming_shifts.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with SingleTickerProviderStateMixin {
  OverlayEntry? _overlayEntry;
  late final AnimationController _animationController;
  late final Animation<Offset> _offsetAnimation;
  bool hasLoadedShift = false;
  String? shiftType;

  List<Map<String, dynamic>>? shifts;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _offsetAnimation = Tween<Offset>(begin: Offset(1.0, 0.0), end: Offset.zero)
        .animate(
          CurvedAnimation(
            parent: _animationController,
            curve: Curves.easeInOut,
          ),
        );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _getShift();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _hideOverlay();
    super.dispose();
  }

  bool get _isOverlayShown => _overlayEntry != null;

  void _hideOverlay() {
    if (_isOverlayShown) {
      _animationController.reverse().then((_) {
        _overlayEntry?.remove();
        _overlayEntry = null;
      });
    }
  }

  void _showOverlay(Widget overlayChild) {
    if (_isOverlayShown) {
      return;
    }

    _overlayEntry = OverlayEntry(
      builder: (context) {
        return SlideTransition(position: _offsetAnimation, child: overlayChild);
      },
    );

    Overlay.of(context).insert(_overlayEntry!);
    _animationController.forward();
  }

  TimeOfDay _parseTimeOfDay(String? timeString) {
    if (timeString == null) return const TimeOfDay(hour: 0, minute: 0);
    try {
      final parts = timeString.split(':');
      final hour = int.parse(parts[0]);
      final minute = int.parse(parts[1]);
      return TimeOfDay(hour: hour, minute: minute);
    } catch (e) {
      return const TimeOfDay(hour: 0, minute: 0);
    }
  }

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

  Future<void> _getShift() async {
    final supabase = Supabase.instance.client;
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final id = user?['id'];

    if (user == null || id == null) {
      setState(() {
        shifts = null;
        hasLoadedShift = true;
        shiftType = null;
      });
      return;
    }
    final assignments = await supabase
        .from('shift_assignment')
        .select(
          '*, shift(*,shift_include_day(*),shift_exclude_day(*),timeEntry(*),site(*,address(*)))',
        )
        .eq('employee_id', id);
    final List<Map<String, dynamic>> shiftsResponse = assignments
        .map((assignment) => assignment['shift'])
        .where((shift) => shift != null)
        .cast<Map<String, dynamic>>()
        .toList();

    setState(() {
      shifts = shiftsResponse;
      hasLoadedShift = true;
    });
  }

  List<Map<String, dynamic>> getShiftsByDay(DateTime date) {
    final List<Map<String, dynamic>> todaysShifts = [];
    if (shifts != null) {
      for (var shift in shifts!) {
        DateTime shiftStartDate = DateTime.parse(shift['start_date']);
        DateTime? shiftEndDate = shift['end_date'] != null
            ? DateTime.parse(shift['end_date'])
            : null;

        final dayOfWeek = format(date, 'EEEE').toLowerCase();

        if (shift['type'] == 'one_time' && shiftEndDate != null) {
          if (isInInterval(shiftStartDate, shiftEndDate, date)) {
            todaysShifts.add(shift);
          }
        }

        if (shift['type'] == 'recurring') {
          if (!shiftStartDate.isAfter(date)) {
            final excludeDay = (shift['shift_exclude_day'] as List<dynamic>?)
                ?.cast<Map<String, dynamic>>();

            final includeDay = (shift['shift_include_day'] as List<dynamic>?)
                ?.cast<Map<String, dynamic>>();

            if (includeDay != null && includeDay.isNotEmpty) {
              final isIncluded = includeDay.any(
                (day) =>
                    day['day_of_week'].toString().toLowerCase() == dayOfWeek,
              );
              if (isIncluded) {
                todaysShifts.add(shift);
              }
            } else if (excludeDay != null && excludeDay.isNotEmpty) {
              final isExcluded = excludeDay.any(
                (day) =>
                    day['day_of_week'].toString().toLowerCase() == dayOfWeek,
              );
              if (!isExcluded) {
                todaysShifts.add(shift);
              }
            } else {
              todaysShifts.add(shift);
            }
          }
        }
      }
    }
    return todaysShifts;
  }

  Map<String, dynamic>? getCurrentShiftsForToday() {
    if (shifts == null || shifts!.isEmpty) return null;

    final now = DateTime.now();
    final todaysShifts = getShiftsByDay(now);

    if (todaysShifts.isEmpty) return null;

    todaysShifts.sort((a, b) {
      final timeA = _parseTimeOfDay(a['start_time']);
      final timeB = _parseTimeOfDay(b['start_time']);

      final dateTimeA = DateTime(
        now.year,
        now.month,
        now.day,
        timeA.hour,
        timeA.minute,
      );
      final dateTimeB = DateTime(
        now.year,
        now.month,
        now.day,
        timeB.hour,
        timeB.minute,
      );

      return dateTimeA.compareTo(dateTimeB);
    });

    for (var shift in todaysShifts) {
      final startTime = _parseTimeOfDay(shift['start_time']);
      final endTime = _parseTimeOfDay(shift['end_time']);

      var startDateTime = DateTime(
        now.year,
        now.month,
        now.day,
        startTime.hour,
        startTime.minute,
      );
      var endDateTime = DateTime(
        now.year,
        now.month,
        now.day,
        endTime.hour,
        endTime.minute,
      );

      // Handle overnight shifts
      if (endDateTime.isBefore(startDateTime)) {
        endDateTime = endDateTime.add(const Duration(days: 1));
      }

      // If current time is within shift or shift is upcoming
      if ((now.isAfter(startDateTime) && now.isBefore(endDateTime)) ||
          startDateTime.isAfter(now)) {
        return shift;
      }
    }
    return null;
  }

  Map<String, dynamic>? getNextDayShift() {
    if (shifts == null || shifts!.isEmpty) return null;

    final now = DateTime.now();

    for (int i = 1; i <= 30; i++) {
      final nextDay = now.add(Duration(days: i));
      final shiftsOnThatDay = getShiftsByDay(nextDay);

      if (shiftsOnThatDay.isNotEmpty) {
        shiftsOnThatDay.sort((a, b) {
          final timeA = _parseTimeOfDay(a['start_time']);
          final timeB = _parseTimeOfDay(b['start_time']);
          final dateTimeA = DateTime(
            nextDay.year,
            nextDay.month,
            nextDay.day,
            timeA.hour,
            timeA.minute,
          );
          final dateTimeB = DateTime(
            nextDay.year,
            nextDay.month,
            nextDay.day,
            timeB.hour,
            timeB.minute,
          );
          return dateTimeA.compareTo(dateTimeB);
        });

        return {'date': nextDay, ...shiftsOnThatDay.first};
      }
    }

    return null;
  }

  Map<String, dynamic>? getCurrentOrNextShift() {
    if (shifts == null || shifts!.isEmpty) return null;

    final todaysShift = getCurrentShiftsForToday();

    if (todaysShift != null) {
      return {'date': DateTime.now(), ...todaysShift};
    } else {
      return getNextDayShift();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final nextShift = getCurrentOrNextShift();
    debugPrint(nextShift.toString());
    if (!hasLoadedShift) {
      return Scaffold(
        body: SafeArea(child: Center(child: CircularProgressIndicator())),
      );
    }
    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _getShift,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  HomeHeader(
                    user: user,
                    onMessagesPressed: () {
                      _showOverlay(MessagesOverlay(onClose: _hideOverlay));
                    },
                    onNotificationsPressed: () {
                      _showOverlay(NotificationsOverlay(onClose: _hideOverlay));
                    },
                  ),
                  if (shifts == null || shifts!.isEmpty)
                    NoShiftMessage()
                  else
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(height: 14),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 6),
                          child: const Text(
                            "Welcome Back! Here's your upcoming schedules.",
                          ),
                        ),
                        SizedBox(height: 8),
                        if (nextShift != null)
                          ShiftInfoCard(
                            shift: nextShift,
                            onCheckIn: () {
                              _showOverlay(
                                CheckInOverlay(
                                  shift: nextShift,
                                  onClose: _hideOverlay,
                                ),
                              );
                            },
                            onViewDetails: () {
                              if (shifts != null) {
                                _showOverlay(
                                  ShiftDetailsOverlay(
                                    onClose: _hideOverlay,
                                    shift: nextShift,
                                  ),
                                );
                              }
                            },
                          )
                        else
                          NoShiftCard(),
                        if (shifts != null) UpComingShifts(shifts: shifts!),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
