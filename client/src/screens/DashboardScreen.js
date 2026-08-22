import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';
import StatCard from '../components/StatCard';

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    jobTitle: 'Lead YouTube & Reels Video Editor (Tech Channel)',
    applicantName: 'Aarav Sharma',
    role: 'Video Editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    experience: '4 yrs exp • 28 Projects',
    portfolio: 'https://youtube.com/showcase-aarav',
    proposedRate: '₹45,000 / month',
    note: 'Hey! I have edited over 100+ tech videos with retention rates averaging 65%. Check out my sample tech review edit.',
    status: 'Shortlisted'
  },
  {
    id: 2,
    jobTitle: 'Short-Form Content Editor (4 Reels/Week)',
    applicantName: 'Dev Patel',
    role: 'Video Editor',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    experience: '3 yrs exp • 19 Projects',
    portfolio: 'https://behance.net/devpatel-edits',
    proposedRate: '₹28,000 / month',
    note: 'Hi Kabir! I specialize in high-energy fitness reels with motion titles and upbeat pacing.',
    status: 'Submitted'
  },
  {
    id: 3,
    jobTitle: 'Social Media Manager & Growth Strategist',
    applicantName: 'Ananya Verma',
    role: 'Social Media Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    experience: '5 yrs exp • 35 Projects',
    portfolio: 'https://notion.so/ananya-smm-case-studies',
    proposedRate: '₹40,000 / month',
    note: "I've grown 3 finance creators on Instagram by analyzing retention drop-offs and crafting hook-heavy carousels.",
    status: 'Submitted'
  }
];

export default function DashboardScreen() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  const handleStatusChange = (id, newStatus) => {
    setApplications(apps =>
      apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Creator Team Operations Dashboard</Text>
        <Text style={styles.subtitle}>Shortlisting pipeline, interview status & active contracts</Text>
      </View>

      {/* Metrics */}
      <View style={styles.statsRow}>
        <StatCard title="Active Listings" value="4" icon="📋" />
        <StatCard title="Total Applications" value="12" icon="📬" />
        <StatCard title="Shortlisted Candidates" value="3" icon="⭐" />
        <StatCard title="Active Retainers" value="2" icon="🤝" />
      </View>

      {/* Applicant Shortlisting Table / List */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Applicant Pipeline & Shortlisting</Text>
        
        {applications.map((app) => (
          <View key={app.id} style={styles.appCard}>
            <View style={styles.appHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: app.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{app.applicantName}</Text>
                  <Text style={styles.jobAppliedFor}>Applied for: <Text style={styles.jobHighlight}>{app.jobTitle}</Text></Text>
                  <Text style={styles.exp}>{app.experience}</Text>
                </View>
              </View>

              <View style={[
                styles.statusBadge,
                app.status === 'Shortlisted' ? styles.statusShortlisted :
                app.status === 'Hired' ? styles.statusHired : styles.statusSubmitted
              ]}>
                <Text style={styles.statusText}>{app.status}</Text>
              </View>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Pitch / Cover Note:</Text>
              <Text style={styles.noteText}>"{app.note}"</Text>
            </View>

            <View style={styles.appFooter}>
              <Text style={styles.proposedRate}>Proposed Rate: <Text style={styles.rateHighlight}>{app.proposedRate}</Text></Text>

              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={styles.actionBtnSec}
                  onPress={() => handleStatusChange(app.id, 'Shortlisted')}
                >
                  <Text style={styles.actionBtnSecText}>⭐ Shortlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnPri}
                  onPress={() => handleStatusChange(app.id, 'Hired')}
                >
                  <Text style={styles.actionBtnPriText}>🤝 Hire Candidate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  appCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  jobAppliedFor: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  jobHighlight: {
    color: colors.secondary,
    fontWeight: '600',
  },
  exp: {
    color: colors.badgeText,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusSubmitted: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
  },
  statusShortlisted: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusHired: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  noteLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteText: {
    color: colors.text,
    fontSize: 13,
    fontStyle: 'italic',
  },
  appFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  proposedRate: {
    color: colors.textMuted,
    fontSize: 12,
  },
  rateHighlight: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnSec: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionBtnSecText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnPri: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionBtnPriText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
