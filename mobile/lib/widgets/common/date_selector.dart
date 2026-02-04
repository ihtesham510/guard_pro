import "package:date_kit/date_kit.dart";
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:mobile/theme/app_theme.dart";

class DateSelector extends StatelessWidget {
  final DateTime day;
  final bool active;
  final GestureTapCallback onTap;
  final bool hasEvent;

  const DateSelector({
    super.key,
    required this.day,
    required this.active,
    required this.onTap,
    required this.hasEvent,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 72,
        margin: const EdgeInsets.symmetric(horizontal: 4),
        clipBehavior: Clip.none,
        decoration: BoxDecoration(
          color: active
              ? AppTheme.primary
              : hasEvent ?AppTheme.card : AppTheme.background.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(40),
          border: Border.all(
            color: active ? AppTheme.background : hasEvent  ? AppTheme.card : AppTheme.border,
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                Text(
                  format(day, 'd'),
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.w800,
                    fontSize: 32,
                    color: active
                        ? AppTheme.background
                        : AppTheme.foreground,
                  ),
                ),
                if (hasEvent)
                  Positioned(
                    top: 6,
                    right: -7,
                    child: Container(
                      height: 6,
                      width: 6,
                      decoration: BoxDecoration(
                        color: active
                            ? AppTheme.background
                            : AppTheme.primary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            Text(
              format(day, 'EEE'),
              style: GoogleFonts.inter(
                fontWeight: active ? FontWeight.w600 :  FontWeight.w800,
                fontSize: 11,
                color: active
                    ? AppTheme.background
                    : AppTheme.foreground,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
