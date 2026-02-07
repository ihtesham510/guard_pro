import 'package:flutter/material.dart';

class DiagonalLinesPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double spacing;

  DiagonalLinesPainter({
    this.color = Colors.black,
    this.strokeWidth = 1.0,
    required this.spacing,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    for (double i = -size.height; i < size.width; i += spacing) {
      canvas.drawLine(
        Offset(i, 0),
        Offset(i + size.height, size.height),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
