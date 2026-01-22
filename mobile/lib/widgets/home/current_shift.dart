import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class CurrentShift extends StatefulWidget {
  const CurrentShift({super.key});

  @override
  State<CurrentShift> createState() => _CurrentShiftState();
}

class _CurrentShiftState extends State<CurrentShift> {
  Map<String, dynamic>? shift;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getShift();
  }

  Future<void> _getShift() async {
    try {
      final data = await Supabase.instance.client
          .from('shift')
          .select()
          .limit(1)
          .maybeSingle();

      if (mounted) {
        setState(() {
          shift = data;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 24),
        if (_isLoading)
          const SizedBox(
            height: 460,
            child: Center(child: CircularProgressIndicator()),
          )
        else if (shift != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: CurrentShift(),
          )
        else
          SizedBox(
            height: 460,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(
                    FluentIcons.clock_dismiss_20_regular,
                    size: 42,
                    color: AppTheme.primary,
                  ),
                  const SizedBox(height: 12),
                  const Text('No Schedules Found'),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
