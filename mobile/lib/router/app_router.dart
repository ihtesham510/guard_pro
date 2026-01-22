import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../pages/auth.dart';
import '../pages/dashboard.dart';
import '../pages/home_tab.dart';
import '../pages/payments_tab.dart';
import '../pages/profile_tab.dart';
import '../pages/shifts_tab.dart';
import '../providers/auth_provider.dart';

GoRouter createAppRouter(AuthProvider authProvider) {
  return GoRouter(
    initialLocation: '/home',
    refreshListenable: authProvider,
    routes: [
      GoRoute(
        path: '/',
        name: 'login',
        redirect: (context, state) {
          if (authProvider.isAuthenticated) {
            return '/home';
          }
          return null;
        },
        builder: (context, state) => const AuthScreen(),
      ),
      GoRoute(path: '/dashboard', redirect: (context, state) => '/home'),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return Dashboard(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                name: 'home',
                redirect: (context, state) {
                  if (!authProvider.isAuthenticated) {
                    return '/';
                  }
                  return null;
                },
                builder: (context, state) => const HomeTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/shifts',
                name: 'shifts',
                redirect: (context, state) {
                  if (!authProvider.isAuthenticated) {
                    return '/';
                  }
                  return null;
                },
                builder: (context, state) => const ShiftsTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/payments',
                name: 'payments',
                redirect: (context, state) {
                  if (!authProvider.isAuthenticated) {
                    return '/';
                  }
                  return null;
                },
                builder: (context, state) => const PaymentsTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                name: 'profile',
                redirect: (context, state) {
                  if (!authProvider.isAuthenticated) {
                    return '/';
                  }
                  return null;
                },
                builder: (context, state) => const ProfileTab(),
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) =>
        Scaffold(body: Center(child: Text('Error: ${state.error}'))),
  );
}
