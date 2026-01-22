import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color background = Color(0xFF1E1E1E);

  static const Color foreground = Color(0xFFCFCFCF);

  static const Color card = Color(0xFF2E2E2E);

  static const Color primary = Color(0xFFFF8C00);

  static const Color primaryForeground = Color(0xFF000000);

  static const Color secondary = Color(0xFFFFB400);

  static const Color border = Color(0xFF404040);

  static const Color muted = Color(0xFF404040);

  static const Color mutedForeground = Color(0xFFA0A0A0);

  static const Color accent = Color(0xFF525252);

  static const Color destructive = Color(0xFFEF4444);

  static const Color ring = Color(0xFFFFB84D);

  static ThemeData get darkTheme {
    const borderRadius = 12.0;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        onPrimaryContainer: primaryForeground,
        secondary: secondary,
        surface: card,
        error: destructive,
        onPrimary: background,
        onSecondary: background,
        onSurface: foreground,
        onError: Colors.white,
        outline: border,
      ),
      scaffoldBackgroundColor: background,
      cardColor: card,
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          side: const BorderSide(color: border, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        fillColor: background,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: const BorderSide(color: border, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: const BorderSide(color: border, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: const BorderSide(color: ring, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: const BorderSide(color: destructive, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          borderSide: const BorderSide(color: destructive, width: 2),
        ),
        labelStyle: const TextStyle(color: mutedForeground),
        hintStyle: const TextStyle(color: mutedForeground),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: background,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0,
          ),
        ),
      ),
      textTheme: GoogleFonts.poppinsTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: foreground),
          displayMedium: TextStyle(color: foreground),
          displaySmall: TextStyle(color: foreground),
          headlineLarge: TextStyle(color: foreground),
          headlineMedium: TextStyle(color: foreground),
          headlineSmall: TextStyle(
            color: foreground,
            fontSize: 24,
            fontWeight: FontWeight.w600,
          ),
          titleLarge: TextStyle(color: foreground),
          titleMedium: TextStyle(color: foreground),
          titleSmall: TextStyle(color: foreground),
          bodyLarge: TextStyle(color: foreground),
          bodyMedium: TextStyle(color: foreground),
          bodySmall: TextStyle(color: mutedForeground),
          labelLarge: TextStyle(color: foreground),
          labelMedium: TextStyle(color: foreground),
          labelSmall: TextStyle(color: mutedForeground),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: card,
        contentTextStyle: const TextStyle(color: foreground),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
