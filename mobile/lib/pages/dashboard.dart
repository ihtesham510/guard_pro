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
    final int activeIndex = navigationShell.currentIndex;
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.card,
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 12),
            child: GNav(
              color: AppTheme.mutedForeground,
              backgroundColor: Colors.transparent,
              activeColor: AppTheme.primary,
              gap: 8,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              selectedIndex: navigationShell.currentIndex,
              onTabChange: _onTap,
              tabs: [
                GButton(
                  icon: activeIndex == 0
                      ? FluentIcons.home_16_filled
                      : FluentIcons.home_16_regular,
                ),
                GButton(
                  icon: activeIndex == 1
                      ? FluentIcons.clock_16_filled
                      : FluentIcons.clock_16_regular,
                ),
                GButton(
                  icon: activeIndex == 2
                      ? FluentIcons.money_16_filled
                      : FluentIcons.money_16_regular,
                ),
                GButton(
                  icon: activeIndex == 3
                      ? FluentIcons.person_16_filled
                      : FluentIcons.person_16_regular,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
