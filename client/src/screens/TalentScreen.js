import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import RoleFilter from '../components/RoleFilter';
import TalentCard from '../components/TalentCard';
import { fetchProfiles } from '../services/api';

export default function TalentScreen() {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      try {
        const data = await fetchProfiles(selectedRole);
        setProfiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, [selectedRole]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Verified Creator Talent Directory</Text>
        <Text style={styles.subtitle}>Discover editors, channel managers, and social strategists with verified creator experience</Text>
      </View>

      <RoleFilter selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading verified talent profiles...</Text>
        </View>
      ) : profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No talent profiles found for this role</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.resultsCount}>{profiles.length} Verified Professionals Available</Text>
          {profiles.map((profile) => (
            <TalentCard key={profile.id} profile={profile} />
          ))}
        </View>
      )}
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
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 12,
    fontSize: 13,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  resultsCount: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '600',
  },
});
