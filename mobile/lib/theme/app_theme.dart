import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color background = Color(0xFFF2F3F4);

  static const Color foreground = Color(0xFF1C1C1C);

  static const Color card = Color(0xFFFFFFFF);

  static const Color cardForeground = Color(0xFF1C1C1C);

  static const Color primary = Color(0xFFFF8C00);

  static const Color primaryForeground = Color(0xFF000000);

  static const Color secondary = Color(0xFFFFC107);

  static const Color border = Color(0xFFE0E0E0);

  static const Color muted = Color(0xFFE0E0E0);

  static const Color mutedForeground = Color(0xFF757575);

  static const Color accent = Color(0xFFBDBDBD);

  static const Color destructive = Color(0xFFEF4444);

  static const Color ring = Color(0xFFFFC107);

  static ThemeData get darkTheme {
    const borderRadius = 12.0;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: primary,
        onPrimaryContainer: primaryForeground,
        secondary: secondary,
        surface: card,
        error: destructive,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
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
        fillColor: card,
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
          foregroundColor: Colors.white,
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
        contentTextStyle: const TextStyle(color: cardForeground),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
