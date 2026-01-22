import 'package:flutter/material.dart';

class LoginWidget extends StatelessWidget {
  final TextEditingController passwordController;
  final bool loading;
  final VoidCallback onLogin;

  const LoginWidget({
    super.key,
    required this.passwordController,
    required this.loading,
    required this.onLogin,
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
            'Welcome back',
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8.0),
          Text(
            'Enter your password to continue',
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
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => loading ? null : onLogin(),
            decoration: const InputDecoration(
              labelText: 'Password',
              hintText: 'Enter your password',
            ),
            enabled: !loading,
          ),
          const SizedBox(height: 24.0),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: loading ? null : onLogin,
              child: loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Login'),
            ),
          ),
        ],
      ),
    );
  }
}
