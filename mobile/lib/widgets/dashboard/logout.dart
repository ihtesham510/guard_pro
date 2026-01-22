import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class LogOutButton extends StatelessWidget {
  const LogOutButton({super.key});

  Future<void> _handleLogout(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    try {
      await authProvider.logout();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Logged out successfully')),
        );
        context.go('/');
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error logging out: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        return ElevatedButton(
          onPressed: authProvider.isLoading
              ? null
              : () => _handleLogout(context),
          child: authProvider.isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : const Text('log out'),
        );
      },
    );
  }
}
