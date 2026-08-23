import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { login, signup } from '../services/api';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('creator'); // 'creator' or 'professional'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email || !password || (!isLogin && !fullName)) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login(email, password);
        onAuthSuccess(response.user, response.session_id);
      } else {
        const response = await signup({
          email,
          full_name: fullName,
          password,
          user_type: userType,
          avatar_url: `https://images.unsplash.com/photo-${userType === 'creator' ? '1534528741775-53994a69daeb' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&w=200&q=80`
        });
        onAuthSuccess(response.user, response.session_id);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {/* Toggle tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.tabActive]}
            onPress={() => { setIsLogin(true); setErrorMsg(''); }}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.tabActive]}
            onPress={() => { setIsLogin(false); setErrorMsg(''); }}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Join CreatorTeam OS'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Access your creator business tools and dashboard'
            : 'Get started with hiring or finding work in the creator economy'}
        </Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        {/* Signup-only Fields */}
        {!isLogin && (
          <>
            <Text style={styles.label}>Select Your Role</Text>
            <View style={styles.roleSelectionRow}>
              <TouchableOpacity
                style={[styles.roleBtn, userType === 'creator' && styles.roleBtnActive]}
                onPress={() => setUserType('creator')}
              >
                <Text style={styles.roleIcon}>👑</Text>
                <Text style={[styles.roleBtnText, userType === 'creator' && styles.roleBtnTextActive]}>
                  I am a Creator / Hirer
                </Text>
                <Text style={styles.roleSubtext}>Want to hire editors, SMMs, managers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, userType === 'professional' && styles.roleBtnActive]}
                onPress={() => setUserType('professional')}
              >
                <Text style={styles.roleIcon}>🎬</Text>
                <Text style={[styles.roleBtnText, userType === 'professional' && styles.roleBtnTextActive]}>
                  I am a Professional / Talent
                </Text>
                <Text style={styles.roleSubtext}>Want to work with creators</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kabir Dev"
              placeholderTextColor={colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
          </>
        )}

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. kabir@creatoros.in"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isLogin ? 'Sign In 🚀' : 'Create Account 🚀'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    maxWidth: 550,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 13,
    marginBottom: 4,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  roleIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  roleBtnText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  roleBtnTextActive: {
    color: colors.primary,
  },
  roleSubtext: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
