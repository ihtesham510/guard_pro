import 'package:fluentui_system_icons/fluentui_system_icons.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:mobile/theme/app_theme.dart';

class Dashboard extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const Dashboard({super.key, required this.navigationShell});

  void _onTap(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.card,
          border: Border(top: BorderSide(color: AppTheme.border, width: 1)),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 12),
            child: GNav(
              color: Colors.white,
              backgroundColor: Colors.transparent,
              activeColor: AppTheme.primary,
              tabBackgroundColor: AppTheme.muted.withValues(alpha: 1),
              gap: 8,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              selectedIndex: navigationShell.currentIndex,
              onTabChange: _onTap,
              tabs: const [
                GButton(icon: FluentIcons.home_16_regular, text: 'Home'),
                GButton(icon: FluentIcons.clock_16_regular, text: 'Shifts'),
                GButton(icon: FluentIcons.money_16_regular, text: 'Payments'),
                GButton(icon: FluentIcons.person_16_regular, text: 'You'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
