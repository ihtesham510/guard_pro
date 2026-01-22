import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class Auth {
  static const String _userKey = 'user_id';
  Future<void> saveUserId(String userId) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, userId);
  }

  Future<Map<String, dynamic>?> getUser() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? res = prefs.getString(_userKey);
    if (res == null) {
      return null;
    }
    return await Supabase.instance.client
        .from('employee')
        .select()
        .eq('id', res)
        .single();
  }

  Future<void> removeSession() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }
}
