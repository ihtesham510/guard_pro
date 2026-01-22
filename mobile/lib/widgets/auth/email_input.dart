import 'package:flutter/material.dart';

class EmailInputWidget extends StatelessWidget {
  final TextEditingController emailController;
  final bool loading;
  final VoidCallback onCheckEmail;

  const EmailInputWidget({
    super.key,
    required this.emailController,
    required this.loading,
    required this.onCheckEmail,
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
            'Welcome',
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8.0),
          Text(
            'Enter your email to continue',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32.0),
          TextField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => loading ? null : onCheckEmail(),
            decoration: const InputDecoration(
              labelText: 'Email',
              hintText: 'Enter your email address',
            ),
            enabled: !loading,
          ),
          const SizedBox(height: 24.0),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: loading ? null : onCheckEmail,
              child: loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Continue'),
            ),
          ),
        ],
      ),
    );
  }
}
