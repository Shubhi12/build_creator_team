import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { fetchProfileByUserId, updateMyProfile } from '../services/api';

export default function ProfileScreen({ currentUser, profileUserId, setActiveTab, setProfileUserId }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editFields, setEditFields] = useState({
    bio: '',
    location: '',
    brand_name: '',
    instagram_handle: '',
    niche: '',
    subscriber_count: '',
    primary_role: '',
    experience_years: '1',
    skills: '',
    portfolio_links: '',
    rate_range: '',
    education: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const targetId = profileUserId || currentUser?.id;
  const isOwnProfile = !profileUserId || String(profileUserId) === String(currentUser?.id);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!targetId) {
        setError('Please sign in to view your profile.');
        setLoading(false);
        return;
      }
      const data = await fetchProfileByUserId(targetId);
      setProfileData(data);
      
      const p = data.profile || {};
      setEditFields({
        bio: p.bio || '',
        location: p.location || '',
        brand_name: p.brand_name || '',
        instagram_handle: p.instagram_handle || '',
        niche: p.niche || '',
        subscriber_count: p.subscriber_count || '',
        primary_role: p.primary_role || '',
        experience_years: String(p.experience_years ?? 1),
        skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
        portfolio_links: Array.isArray(p.portfolio_links) ? p.portfolio_links.join(', ') : '',
        rate_range: p.rate_range || '',
        education: p.education || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [profileUserId, currentUser]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      // Clean and split arrays
      const skillsArray = editFields.skills
        ? editFields.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const portfolioArray = editFields.portfolio_links
        ? editFields.portfolio_links.split(',').map(l => l.trim()).filter(Boolean)
        : [];

      const payload = {
        user_id: currentUser.id,
        bio: editFields.bio,
        location: editFields.location,
        brand_name: editFields.brand_name || null,
        instagram_handle: editFields.instagram_handle || null,
        niche: editFields.niche || null,
        subscriber_count: editFields.subscriber_count || null,
        primary_role: editFields.primary_role || null,
        experience_years: parseInt(editFields.experience_years) || 1,
        skills: skillsArray,
        portfolio_links: portfolioArray,
        rate_range: editFields.rate_range || null,
        education: editFields.education || null
      };

      const updated = await updateMyProfile(payload);
      setProfileData(prev => ({
        ...prev,
        profile: updated
      }));
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        {!currentUser && (
          <TouchableOpacity style={styles.authBtn} onPress={() => setActiveTab('auth')}>
            <Text style={styles.authBtnText}>Sign In / Register</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const { user, profile, working_partners } = profileData;
  const isCreator = user.user_type === 'creator';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Info */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar_url ? (
            <Text style={styles.avatarEmoji}>{isCreator ? '👑' : '⚡'}</Text>
          ) : (
            <Text style={styles.avatarText}>{user.full_name[0]}</Text>
          )}
        </View>
        <View style={styles.headerDetails}>
          <Text style={styles.name}>{user.full_name}</Text>
          <View style={styles.badgesRow}>
            <Text style={[styles.roleBadge, isCreator ? styles.creatorBadge : styles.talentBadge]}>
              {isCreator ? 'Creator / Hirer' : (profile?.primary_role || 'Professional')}
            </Text>
            {profile?.location && (
              <Text style={styles.locationBadge}>📍 {profile.location}</Text>
            )}
          </View>
        </View>
        
        {isOwnProfile && !isEditing && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Text style={styles.editBtnText}>Edit Profile ✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Editing Form */}
      {isEditing ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit My Profile Details</Text>
          {saveError && <Text style={styles.formError}>⚠️ {saveError}</Text>}
          
          <Text style={styles.inputLabel}>Bio / About Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editFields.bio}
            onChangeText={t => setEditFields(prev => ({ ...prev, bio: t }))}
            placeholder="Write a short description about yourself or your brand..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            value={editFields.location}
            onChangeText={t => setEditFields(prev => ({ ...prev, location: t }))}
            placeholder="e.g. Bengaluru, IN"
            placeholderTextColor={colors.textMuted}
          />

          {isCreator ? (
            <>
              <Text style={styles.inputLabel}>Brand / Channel Name</Text>
              <TextInput
                style={styles.input}
                value={editFields.brand_name}
                onChangeText={t => setEditFields(prev => ({ ...prev, brand_name: t }))}
                placeholder="e.g. TechTalkies"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Niche</Text>
              <TextInput
                style={styles.input}
                value={editFields.niche}
                onChangeText={t => setEditFields(prev => ({ ...prev, niche: t }))}
                placeholder="e.g. Tech & Reviews"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Subscriber / Follower Count</Text>
              <TextInput
                style={styles.input}
                value={editFields.subscriber_count}
                onChangeText={t => setEditFields(prev => ({ ...prev, subscriber_count: t }))}
                placeholder="e.g. 500K+"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Instagram Handle</Text>
              <TextInput
                style={styles.input}
                value={editFields.instagram_handle}
                onChangeText={t => setEditFields(prev => ({ ...prev, instagram_handle: t }))}
                placeholder="e.g. @techtalkies"
                placeholderTextColor={colors.textMuted}
              />
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Primary Role</Text>
              <TextInput
                style={styles.input}
                value={editFields.primary_role}
                onChangeText={t => setEditFields(prev => ({ ...prev, primary_role: t }))}
                placeholder="e.g. Video Editor"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Years of Experience</Text>
              <TextInput
                style={styles.input}
                value={editFields.experience_years}
                onChangeText={t => setEditFields(prev => ({ ...prev, experience_years: t.replace(/[^0-9]/g, '') }))}
                placeholder="e.g. 3"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Education Background</Text>
              <TextInput
                style={styles.input}
                value={editFields.education}
                onChangeText={t => setEditFields(prev => ({ ...prev, education: t }))}
                placeholder="e.g. B.A. in Filmmaking, IIT Bombay"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Skills (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={editFields.skills}
                onChangeText={t => setEditFields(prev => ({ ...prev, skills: t }))}
                placeholder="Premiere Pro, DaVinci, CapCut"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Portfolio Links (comma separated)</Text>
              <TextInput
                style={styles.input}
                value={editFields.portfolio_links}
                onChangeText={t => setEditFields(prev => ({ ...prev, portfolio_links: t }))}
                placeholder="https://youtube.com/my-work"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.inputLabel}>Rate Range / Retainer expectation</Text>
              <TextInput
                style={styles.input}
                value={editFields.rate_range}
                onChangeText={t => setEditFields(prev => ({ ...prev, rate_range: t }))}
                placeholder="e.g. ₹30,000 - ₹50,000 / month"
                placeholderTextColor={colors.textMuted}
              />
            </>
          )}

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes ✅</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Display Mode */
        <>
          {/* Main Details Section */}
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>About & Brand Identity</Text>
            <Text style={styles.bioText}>
              {profile?.bio || (isOwnProfile ? "No description added yet. Add details about your work!" : "No details provided.")}
            </Text>

            {isCreator ? (
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Brand Name</Text>
                  <Text style={styles.gridValue}>{profile?.brand_name || 'Personal Brand'}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Content Niche</Text>
                  <Text style={styles.gridValue}>{profile?.niche || 'General Content'}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Reach / Subscribers</Text>
                  <Text style={styles.gridValue}>{profile?.subscriber_count || '10K+'}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Instagram Handle</Text>
                  <Text style={styles.gridValue}>{profile?.instagram_handle || 'Not added'}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Primary Role</Text>
                  <Text style={styles.gridValue}>{profile?.primary_role || 'Generalist'}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Experience</Text>
                  <Text style={styles.gridValue}>{profile?.experience_years || 1} Years</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Rate Range</Text>
                  <Text style={styles.gridValue}>{profile?.rate_range || 'Flexible'}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Education</Text>
                  <Text style={styles.gridValue}>{profile?.education || 'Not added'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Applicant Specific Sections: Skills & Portfolio */}
          {!isCreator && (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionHeader}>Expertise & Skills</Text>
                <View style={styles.skillsRow}>
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No skills listed yet.</Text>
                  )}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionHeader}>Portfolio Links</Text>
                {profile?.portfolio_links && profile.portfolio_links.length > 0 ? (
                  profile.portfolio_links.map((link, index) => (
                    <TouchableOpacity key={index} style={styles.portfolioLinkCard}>
                      <Text style={styles.portfolioLinkText}>🔗 {link}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No portfolio links listed yet.</Text>
                )}
              </View>
            </>
          )}

          {/* Working Associations Section */}
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>
              {isCreator ? 'People Currently Working With' : 'Creators Worked Under'}
            </Text>
            {working_partners && working_partners.length > 0 ? (
              <View style={styles.partnersList}>
                {working_partners.map((partner, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.partnerCard}
                    onPress={() => setProfileUserId(partner.user_id)}
                  >
                    <View style={styles.partnerAvatar}>
                      <Text style={styles.partnerAvatarEmoji}>
                        {partner.role === 'Creator / Hirer' ? '👑' : '👤'}
                      </Text>
                    </View>
                    <View style={styles.partnerInfo}>
                      <Text style={styles.partnerName}>{partner.full_name}</Text>
                      <Text style={styles.partnerSub}>
                        {partner.role} • {partner.job_title}
                      </Text>
                    </View>
                    <Text style={styles.arrowIcon}>chevron_right</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {isCreator 
                    ? 'No active contracted talent found on the platform.' 
                    : 'No hired contracts recorded on the platform.'
                  }
                </Text>
              </View>
            )}
          </View>
        </>
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
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.text,
    marginTop: 15,
    fontSize: 16,
  },
  errorText: {
    color: colors.warning,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  authBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  authBtnText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  headerDetails: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  creatorBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818CF8',
  },
  talentBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    color: '#38BDF8',
  },
  locationBadge: {
    color: colors.textMuted,
    fontSize: 12,
  },
  editBtn: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionHeader: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
    marginBottom: 12,
  },
  bioText: {
    color: colors.text,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  gridLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  gridValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  skillText: {
    color: colors.text,
    fontSize: 13,
  },
  portfolioLinkCard: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  portfolioLinkText: {
    color: colors.secondary,
    fontSize: 13,
  },
  partnersList: {
    gap: 10,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
  },
  partnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerAvatarEmoji: {
    fontSize: 18,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  partnerSub: {
    color: colors.textMuted,
    fontSize: 12,
  },
  arrowIcon: {
    color: colors.textMuted,
    fontSize: 14,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptyText: {
    color: colors.textMuted,
    fontStyle: 'italic',
    fontSize: 13,
  },
  // Form Styles
  inputLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formError: {
    color: colors.warning,
    marginBottom: 15,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
