import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'providers/auth_provider.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  await dotenv.load(fileName: '.env');
  final String? supabaseUrl = dotenv.env['SUPABASE_URL'];
  final String? supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY'];
  if (supabaseAnonKey != null && supabaseUrl != null) {
    await Supabase.initialize(url: supabaseUrl, anonKey: supabaseAnonKey);
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          final router = createAppRouter(authProvider);
          return MaterialApp.router(
            title: 'Flutter Demo',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.darkTheme,
            darkTheme: AppTheme.darkTheme,
            routerConfig: router,
          );
        },
      ),
    );
  }
}
