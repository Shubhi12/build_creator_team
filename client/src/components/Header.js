import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';

export default function Header({ activeTab, setActiveTab, currentUser, onLogout }) {
  const tabs = [
    { key: 'home', label: 'Overview' },
  ];
  
  if (!currentUser || currentUser.user_type === 'creator') {
    tabs.push({ key: 'talent', label: 'Find Talent' });
    tabs.push({ key: 'post', label: 'Post a Role' });
  }
  
  if (!currentUser || currentUser.user_type === 'professional') {
    tabs.push({ key: 'jobs', label: 'Explore Jobs' });
  }

  tabs.push({ key: 'dashboard', label: 'Dashboard' });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>CreatorTeam OS</Text>
            <Text style={styles.brandSubtitle}>Operating Infrastructure for Content Businesses</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.wedgeTag}>
            <Text style={styles.wedgeTagText}>⚡ Initial Wedge: Editors • SMM • Managers</Text>
          </View>

          {currentUser ? (
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }}
                style={styles.avatar}
              />
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{currentUser.full_name}</Text>
                <Text style={styles.profileRole}>
                  {currentUser.user_type === 'creator' ? '👑 Creator' : '🎬 Talent'}
                </Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                <Text style={styles.logoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.loginBtn, activeTab === 'auth' && styles.loginBtnActive]}
              onPress={() => setActiveTab('auth')}
            >
              <Text style={styles.loginBtnText}>Sign In 🚀</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.navRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  wedgeTag: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderColor: colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wedgeTagText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  profileTextContainer: {
    justifyContent: 'center',
  },
  profileName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  profileRole: {
    color: colors.textMuted,
    fontSize: 10,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  logoutBtnText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginBtnActive: {
    backgroundColor: colors.primaryHover,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
    overflowX: 'auto',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
