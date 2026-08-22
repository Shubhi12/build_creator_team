import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from './src/theme/colors';
import Header from './src/components/Header';
import HomeScreen from './src/screens/HomeScreen';
import JobsScreen from './src/screens/JobsScreen';
import TalentScreen from './src/screens/TalentScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AuthScreen from './src/screens/AuthScreen';
import { getMe, logout } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check active session on startup
  useEffect(() => {
    async function loadSession() {
      try {
        const user = await getMe();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn('Failed to load active session:', err.message);
      } finally {
        setAuthLoading(false);
      }
    }
    loadSession();
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  // decorator-equivalent pattern in React to check active user sessions or redirect them
  const withAuth = (Component, allowedRoles = []) => {
    return (props) => {
      if (authLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }
      
      if (!currentUser) {
        return (
          <AuthScreen
            onAuthSuccess={(user, token) => {
              setCurrentUser(user);
              // Keeps the user on the tab they attempted to visit after success
              setActiveTab(activeTab);
            }}
          />
        );
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.user_type)) {
        return (
          <View style={styles.restrictedContainer}>
            <Text style={styles.restrictedEmoji}>🚫</Text>
            <Text style={styles.restrictedTitle}>Access Restricted</Text>
            <Text style={styles.restrictedText}>
              This section is only available for {allowedRoles.join(' or ')} profiles.
            </Text>
            <TouchableOpacity style={styles.restrictedBtn} onPress={() => setActiveTab('home')}>
              <Text style={styles.restrictedBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return <Component {...props} currentUser={currentUser} setActiveTab={setActiveTab} />;
    };
  };

  const ProtectedPostJobScreen = withAuth(PostJobScreen, ['creator']);
  const ProtectedDashboardScreen = withAuth(DashboardScreen);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen setActiveTab={setActiveTab} currentUser={currentUser} />;
      case 'jobs':
        return <JobsScreen currentUser={currentUser} setActiveTab={setActiveTab} />;
      case 'talent':
        return <TalentScreen currentUser={currentUser} />;
      case 'post':
        return <ProtectedPostJobScreen />;
      case 'dashboard':
        return <ProtectedDashboardScreen />;
      case 'auth':
        return (
          <AuthScreen
            onAuthSuccess={(user, token) => {
              setCurrentUser(user);
              setActiveTab('home');
            }}
          />
        );
      default:
        return <HomeScreen setActiveTab={setActiveTab} currentUser={currentUser} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <View style={styles.body}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  restrictedEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  restrictedTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  restrictedText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
    lineHeight: 20,
  },
  restrictedBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restrictedBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
