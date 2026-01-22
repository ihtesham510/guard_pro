import 'package:date_kit/date_kit.dart';
import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class Date extends StatelessWidget {
  final DateTime date;
  const Date({super.key, required this.date});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: AppTheme.muted),
      child: Column(
        children: [Text(format(date, 'E')), Text(format(date, 'd'))],
      ),
    );
  }
}
