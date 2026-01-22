import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/widgets/auth/email_input.dart';
import 'package:mobile/widgets/auth/login.dart';
import 'package:mobile/widgets/auth/password_setup.dart';
import 'package:provider/provider.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _checkEmail() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    try {
      await authProvider.checkEmail(_emailController.text);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Employee not found: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _setPassword() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    try {
      await authProvider.setPassword(
        _passwordController.text,
        _confirmPasswordController.text,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Password set successfully')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  Future<void> _login() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    try {
      await authProvider.login(_passwordController.text);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Login successful')));
        // Redirect to home after successful login
        context.go('/home');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        // Show loading indicator while initializing
        if (authProvider.isLoading &&
            !authProvider.hasEmail &&
            authProvider.employeeEmail == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Redirect to dashboard if authenticated (handled by router redirect, but this prevents showing login widget)
        if (authProvider.isAuthenticated) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) {
              context.go('/home');
            }
          });
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Show appropriate auth flow widget
        return Scaffold(
          body: SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (!authProvider.hasEmail)
                        EmailInputWidget(
                          emailController: _emailController,
                          loading: authProvider.isLoading,
                          onCheckEmail: _checkEmail,
                        )
                      else if (authProvider.hasEmail &&
                          !authProvider.hasPassword)
                        PasswordSetupWidget(
                          passwordController: _passwordController,
                          confirmPasswordController: _confirmPasswordController,
                          loading: authProvider.isLoading,
                          onSetPassword: _setPassword,
                        )
                      else if (authProvider.hasEmail &&
                          authProvider.hasPassword)
                        LoginWidget(
                          passwordController: _passwordController,
                          loading: authProvider.isLoading,
                          onLogin: _login,
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
