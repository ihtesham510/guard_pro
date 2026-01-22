import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart';

class Avatar extends StatelessWidget {
  const Avatar({
    super.key,
    this.imageUrl,
    this.size = 48.0,
    this.placeholder,
    this.onTap,
  });

  final String? imageUrl;
  final double size;
  final Widget? placeholder;

  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: GestureDetector(
        onTap: onTap,
        child: ClipOval(
          child: (imageUrl != null && imageUrl!.isNotEmpty)
              ? Image.network(
                  imageUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return placeholder ??
                        Container(
                          color: AppTheme.muted,
                          child: const Icon(Icons.person),
                        );
                  },
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Center(
                      child: CircularProgressIndicator(
                        value: loadingProgress.expectedTotalBytes != null
                            ? loadingProgress.cumulativeBytesLoaded /
                                  loadingProgress.expectedTotalBytes!
                            : null,
                      ),
                    );
                  },
                )
              : Container(
                  color: AppTheme.muted,
                  child: placeholder ?? const Icon(Icons.person),
                ),
        ),
      ),
    );
  }
}
