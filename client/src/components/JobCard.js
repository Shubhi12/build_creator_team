import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { submitApplication } from '../services/api';

export default function JobCard({ job, onApplied, currentUser, setActiveTab, navigateToProfile }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyClick = () => {
    if (!currentUser) {
      alert('Please sign in to apply for this job.');
      setActiveTab('auth');
      return;
    }
    if (currentUser.user_type !== 'professional') {
      alert('Only professionals/talent can apply to jobs.');
      return;
    }
    setModalVisible(true);
  };

  const handleApplySubmit = async () => {
    if (!coverNote) {
      alert('Please enter a short cover note or portfolio breakdown');
      return;
    }
    setSubmitting(true);
    try {
      await submitApplication({
        job_id: job.id,
        cover_note: coverNote,
        portfolio_link: portfolio,
        proposed_rate: proposedRate || job.budget
      });
      setApplied(true);
      setModalVisible(false);
      if (onApplied) onApplied();
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const creatorName = job.creator?.full_name || 'Verified Creator';
  const avatarUrl = job.creator?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.creatorInfo} onPress={() => navigateToProfile && navigateToProfile(job.creator_id)}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.creatorName}>{creatorName} ↗</Text>
            <Text style={styles.categoryBadge}>{job.role_category}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{job.work_type}</Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.description} numberOfLines={3}>{job.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Budget</Text>
          <Text style={styles.metaValue}>{job.budget}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Availability</Text>
          <Text style={styles.metaValue}>{job.availability}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Applicants</Text>
          <Text style={styles.metaValue}>{job.applications_count || 0} applied</Text>
        </View>
      </View>

      {job.platforms && job.platforms.length > 0 && (
        <View style={styles.platformsRow}>
          {job.platforms.map((platform, idx) => (
            <View key={idx} style={styles.platformTag}>
              <Text style={styles.platformTagText}>▶ {platform}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.applyButton, applied && styles.appliedButton]}
          disabled={applied}
          onPress={handleApplyClick}
        >
          <Text style={styles.applyButtonText}>
            {applied ? '✓ Application Submitted' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Apply Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply for {job.title}</Text>
            <Text style={styles.modalSub}>Posting by {creatorName} • Budget: {job.budget}</Text>

            <Text style={styles.inputLabel}>Portfolio / Showreel Link *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. https://drive.google.com/... or Vimeo/YouTube link"
              placeholderTextColor={colors.textMuted}
              value={portfolio}
              onChangeText={setPortfolio}
            />

            <Text style={styles.inputLabel}>Proposed Rate</Text>
            <TextInput
              style={styles.input}
              placeholder={`e.g. ${job.budget}`}
              placeholderTextColor={colors.textMuted}
              value={proposedRate}
              onChangeText={setProposedRate}
            />

            <Text style={styles.inputLabel}>Why are you a fit for this creator? *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mention turnaround times, past experience with creators, software proficiency..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={coverNote}
              onChangeText={setCoverNote}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleApplySubmit}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
  },
  creatorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    color: colors.badgeText,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  jobTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  metaItem: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  metaValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  platformsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  platformTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  platformTagText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  appliedButton: {
    backgroundColor: colors.accent,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
