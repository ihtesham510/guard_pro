import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';

class Requests extends StatelessWidget {
  const Requests({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Icon(
        FluentIcons.arrow_flow_diagonal_up_right_32_filled,
        size: 150,
      ),
    );
  }
}
