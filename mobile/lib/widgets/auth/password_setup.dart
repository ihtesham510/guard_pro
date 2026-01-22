import 'package:flutter/material.dart';

class PasswordSetupWidget extends StatelessWidget {
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final bool loading;
  final VoidCallback onSetPassword;

  const PasswordSetupWidget({
    super.key,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.loading,
    required this.onSetPassword,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Set your password',
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8.0),
          Text(
            'Create a secure password for your account',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32.0),
          TextField(
            controller: passwordController,
            obscureText: true,
            textInputAction: TextInputAction.next,
            decoration: const InputDecoration(
              labelText: 'Password',
              hintText: 'Enter your password',
            ),
            enabled: !loading,
          ),
          const SizedBox(height: 16.0),
          TextField(
            controller: confirmPasswordController,
            obscureText: true,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => loading ? null : onSetPassword(),
            decoration: const InputDecoration(
              labelText: 'Confirm Password',
              hintText: 'Re-enter your password',
            ),
            enabled: !loading,
          ),
          const SizedBox(height: 24.0),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: loading ? null : onSetPassword,
              child: loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Set Password'),
            ),
          ),
        ],
      ),
    );
  }
}
