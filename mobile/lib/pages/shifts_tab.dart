import 'package:flutter/material.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:mobile/widgets/shifts/tabs/monthly.dart';
import 'package:mobile/widgets/shifts/tabs/requests.dart';
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
            : DefaultTabController(
                length: 3,
                child: Column(
                  children: [
                    if (shifts != null && leaveRequest != null)
                      TabBar(
                        dividerColor: AppTheme.muted,
                        indicatorSize: TabBarIndicatorSize.label,
                        indicatorColor: AppTheme.primary,
                        indicatorWeight: 3,
                        labelColor: AppTheme.primary,
                        labelStyle: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                        unselectedLabelStyle: const TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                        tabs: const [
                          Tab(text: 'Monthly'),
                          Tab(text: 'Weekly'),
                          Tab(text: 'Request'),
                        ],
                      ),
                    if (shifts != null && leaveRequest != null)
                      Expanded(
                        child: TabBarView(
                          children: [
                            Monthly(shifts: shifts!),
                            Weekly(shifts: shifts!),
                            Requests(),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
      ),
    );
  }
}
