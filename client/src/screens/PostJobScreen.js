import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { createJob } from '../services/api';

const CATEGORIES = ['Video Editor', 'Social Media Manager', 'Creator Manager', 'Thumbnail Designer'];
const WORK_TYPES = ['Retainer', 'Project', 'Full-time', 'Part-time'];

export default function PostJobScreen({ setActiveTab }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Video Editor');
  const [workType, setWorkType] = useState('Retainer');
  const [budget, setBudget] = useState('₹35,000 - ₹50,000 / month');
  const [availability, setAvailability] = useState('20 hrs/week');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('YouTube, Instagram Reels');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !budget) {
      alert('Please fill out all required fields (Title, Description, Budget).');
      return;
    }

    setSubmitting(true);
    try {
      await createJob({
        title,
        role_category: category,
        work_type: workType,
        budget,
        availability,
        description,
        platforms: platform.split(',').map(p => p.trim())
      });
      alert('Job posted successfully! Candidates can now apply.');
      if (setActiveTab) setActiveTab('jobs');
    } catch (err) {
      alert('Error posting job. Make sure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.formTitle}>Post Creator Team Requirement</Text>
        <Text style={styles.formSubtitle}>Find dedicated operating talent for your content channel</Text>

        <Text style={styles.label}>Job Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lead YouTube Editor for Tech Channel (2 Videos + 4 Reels/Wk)"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Role Category *</Text>
        <View style={styles.optionsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.optionChip, category === cat && styles.optionChipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.optionText, category === cat && styles.optionTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Engagement Type *</Text>
        <View style={styles.optionsRow}>
          {WORK_TYPES.map((wt) => (
            <TouchableOpacity
              key={wt}
              style={[styles.optionChip, workType === wt && styles.optionChipSelected]}
              onPress={() => setWorkType(wt)}
            >
              <Text style={[styles.optionText, workType === wt && styles.optionTextSelected]}>
                {wt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.label}>Budget / Compensation Range *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ₹30,000 - ₹50,000 / mo"
              placeholderTextColor={colors.textMuted}
              value={budget}
              onChangeText={setBudget}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Time Commitment / Availability</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 15-20 hrs/week"
              placeholderTextColor={colors.textMuted}
              value={availability}
              onChangeText={setAvailability}
            />
          </View>
        </View>

        <Text style={styles.label}>Target Platforms (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="YouTube, Instagram Reels, Shorts"
          placeholderTextColor={colors.textMuted}
          value={platform}
          onChangeText={setPlatform}
        />

        <Text style={styles.label}>Job Description & Deliverables *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe weekly publishing schedule, editing style required, software tools (Premiere, DaVinci), and key responsibilities..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? 'Publishing Job...' : 'Publish Job Listing 🚀'}
          </Text>
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
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
  },
  formTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  formSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 20,
    marginTop: 4,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
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
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
  },
  optionChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  col: {
    flex: 1,
    minWidth: 200,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
