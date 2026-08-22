import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import StatCard from '../components/StatCard';

export default function HomeScreen({ setActiveTab }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroBadge}>CREATOR OPERATING SYSTEM</Text>
        </View>
        <Text style={styles.heroTitle}>Build & Manage the Team Behind Your Content</Text>
        <Text style={styles.heroDescription}>
          The dedicated platform connecting content creators with vetted professionals who specialize in creator business operations—video editors, social media managers, and channel ops.
        </Text>
        
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('jobs')}>
            <Text style={styles.primaryBtnText}>Discover Creator Jobs 🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setActiveTab('post')}>
            <Text style={styles.secondaryBtnText}>Hire Team for My Channel +</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Metrics Row */}
      <Text style={styles.sectionTitle}>Platform Liquidity & Ecosystem</Text>
      <View style={styles.metricsGrid}>
        <StatCard title="Active Creator Jobs" value="142" change="+24% this week" icon="💼" />
        <StatCard title="Verified Talent" value="890+" change="Editors, SMMs, Ops" icon="⚡" />
        <StatCard title="Avg Time to Hire" value="48 hrs" change="3x faster than generic platforms" icon="⏱️" />
        <StatCard title="Retention Rate" value="94%" change="Recurring creator retainers" icon="📈" />
      </View>

      {/* Recommended Initial Wedge */}
      <View style={styles.wedgeSection}>
        <View style={styles.wedgeTitleRow}>
          <Text style={styles.wedgeTitle}>Recommended Initial Wedge</Text>
          <Text style={styles.wedgeSub}>Targeting High-Frequency Roles in Creator Economy</Text>
        </View>

        <View style={styles.rolesGrid}>
          <TouchableOpacity style={styles.roleCard} onPress={() => setActiveTab('talent')}>
            <Text style={styles.roleIcon}>🎬</Text>
            <Text style={styles.roleCardTitle}>Video Editors</Text>
            <Text style={styles.roleCardDesc}>Retention editing, YouTube long-form, Reels, Shorts & Motion Graphics.</Text>
            <Text style={styles.roleCount}>340+ Verified Editors</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.roleCard} onPress={() => setActiveTab('talent')}>
            <Text style={styles.roleIcon}>📱</Text>
            <Text style={styles.roleCardTitle}>Social Media Managers</Text>
            <Text style={styles.roleCardDesc}>Channel growth, algorithm optimization, posting schedules & analytics.</Text>
            <Text style={styles.roleCount}>210+ Growth Managers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.roleCard} onPress={() => setActiveTab('talent')}>
            <Text style={styles.roleIcon}>👑</Text>
            <Text style={styles.roleCardTitle}>Creator Managers</Text>
            <Text style={styles.roleCardDesc}>Brand sponsorship negotiation, ops, calendar scheduling & team leadership.</Text>
            <Text style={styles.roleCount}>120+ Channel Ops</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Journey Section */}
      <View style={styles.journeyCard}>
        <Text style={styles.journeyTitle}>How It Works for Creator Businesses</Text>
        
        <View style={styles.stepsRow}>
          <View style={styles.stepBox}>
            <Text style={styles.stepNum}>01</Text>
            <Text style={styles.stepHeader}>Post Workflow Needs</Text>
            <Text style={styles.stepBody}>"Publishing 4 Reels & 2 YouTube videos/wk needing a retention editor"</Text>
          </View>

          <View style={styles.stepBox}>
            <Text style={styles.stepNum}>02</Text>
            <Text style={styles.stepHeader}>Vetted Applications</Text>
            <Text style={styles.stepBody}>Review matched candidates with creator-specific performance ratings</Text>
          </View>

          <View style={styles.stepBox}>
            <Text style={styles.stepNum}>03</Text>
            <Text style={styles.stepHeader}>Streamlined Retainer</Text>
            <Text style={styles.stepBody}>Hire on project or recurring monthly retainer with built-in review workflow</Text>
          </View>
        </View>
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
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 28,
    marginBottom: 28,
    backgroundImage: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
  },
  heroHeader: {
    marginBottom: 12,
  },
  heroBadge: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 12,
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 700,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 32,
  },
  wedgeSection: {
    marginBottom: 32,
  },
  wedgeTitleRow: {
    marginBottom: 16,
  },
  wedgeTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  wedgeSub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  rolesGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  roleCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  roleCardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  roleCardDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  roleCount: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  journeyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  journeyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  stepBox: {
    flex: 1,
    minWidth: 220,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  stepNum: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  stepHeader: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepBody: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
