import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../theme/colors';

export default function TalentCard({ profile, onHire }) {
  const name = profile.user?.full_name || 'Professional Talent';
  const avatarUrl = profile.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const handleOpenPortfolio = () => {
    if (profile.portfolio_links && profile.portfolio_links.length > 0) {
      Linking.openURL(profile.portfolio_links[0]).catch(() => alert('Could not open link'));
    } else {
      alert('Portfolio URL coming soon');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {profile.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.role}>{profile.primary_role}</Text>
          <Text style={styles.location}>📍 {profile.location || 'India / Remote'}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{profile.bio}</Text>

      <View style={styles.skillsContainer}>
        {profile.skills && profile.skills.map((skill, i) => (
          <View key={i} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>⭐ {profile.rating || 5.0}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.completed_projects || 0}</Text>
          <Text style={styles.statLabel}>Creator Contracts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.experience_years || 1} yrs</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.rateText}>{profile.rate_range || 'Rate on request'}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.portfolioBtn} onPress={handleOpenPortfolio}>
            <Text style={styles.portfolioBtnText}>Portfolio ↗</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.hireBtn} onPress={() => alert(`Initiating contract interview with ${name}`)}>
            <Text style={styles.hireBtnText}>Hire / Interview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  role: {
    color: colors.badgeText,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  location: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  bio: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  skillChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  rateText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  portfolioBtn: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  portfolioBtnText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  hireBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  hireBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
