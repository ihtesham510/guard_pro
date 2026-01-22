import 'package:flutter/material.dart';
import 'package:mobile/utils/auth.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthProvider extends ChangeNotifier {
  final Auth _auth = Auth();
  final supabase = Supabase.instance.client;

  Map<String, dynamic>? _user;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  bool _hasEmail = false;
  bool _hasPassword = false;
  String? _employeeEmail;

  // Getters
  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  bool get hasEmail => _hasEmail;
  bool get hasPassword => _hasPassword;
  String? get employeeEmail => _employeeEmail;

  AuthProvider() {
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final savedUser = await _auth.getUser();
      if (savedUser != null) {
        _user = savedUser;
        _isAuthenticated = true;
        _employeeEmail = savedUser['email'] as String?;
        _hasEmail = _employeeEmail != null;
        _hasPassword =
            savedUser['password'] != null &&
            savedUser['password'].toString().isNotEmpty;
      }
    } catch (e) {
      // Handle error silently on initialization
      debugPrint('Error initializing auth: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> checkEmail(String email) async {
    if (email.isEmpty) return;

    _isLoading = true;
    notifyListeners();

    try {
      final employee = await Supabase.instance.client
          .from('employee')
          .select()
          .eq('email', email)
          .single();

      _hasEmail = employee['email'] != null;
      _hasPassword =
          employee['password'] != null &&
          employee['password'].toString().isNotEmpty;
      _employeeEmail = email;

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> setPassword(String password, String confirmPassword) async {
    if (password.isEmpty || confirmPassword.isEmpty) {
      throw Exception('Please fill in all fields');
    }

    if (password != confirmPassword) {
      throw Exception('Passwords do not match');
    }

    _isLoading = true;
    notifyListeners();

    try {
      if (_employeeEmail != null) {
        await Supabase.instance.client
            .from('employee')
            .update({'password': password})
            .eq('email', _employeeEmail!);
      }

      _hasPassword = true;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> login(String password) async {
    if (password.isEmpty) {
      throw Exception('Please enter your password');
    }

    if (_employeeEmail == null) {
      throw Exception('Email not found. Please check your email first.');
    }

    _isLoading = true;
    notifyListeners();

    try {
      // Verify password by checking employee record
      final employee = await Supabase.instance.client
          .from('employee')
          .select()
          .eq('email', _employeeEmail!)
          .single();

      if (employee['password'] != password) {
        throw Exception('Invalid password');
      }

      // Save user session
      await _auth.saveUserId(employee['id'].toString());

      _user = employee;
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _auth.removeSession();

      _user = null;
      _isAuthenticated = false;
      _hasEmail = false;
      _hasPassword = false;
      _employeeEmail = null;

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  void resetAuthFlow() {
    _hasEmail = false;
    _hasPassword = false;
    _employeeEmail = null;
    notifyListeners();
  }
}
