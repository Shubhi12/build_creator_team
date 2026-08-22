import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import RoleFilter from '../components/RoleFilter';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';

export default function JobsScreen({ currentUser, setActiveTab, navigateToProfile }) {
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs(selectedRole, null, search);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [selectedRole]);

  const handleSearchSubmit = () => {
    loadJobs();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerArea}>
        <Text style={styles.title}>Creator Job Board</Text>
        <Text style={styles.subtitle}>Discover long-term retainers & project work from top content creators</Text>
      </View>

      <RoleFilter selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      {/* Search Input */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs by role, software skill, or creator..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearchSubmit}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs Feed */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching active creator listings...</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matching job posts found</Text>
          <Text style={styles.emptySub}>Try selecting a different category or clearing search terms.</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.resultsCount}>Showing {jobs.length} open creator opportunities</Text>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplied={loadJobs}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              navigateToProfile={navigateToProfile}
            />
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
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
    marginTop: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  resultsCount: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '600',
  },
});
