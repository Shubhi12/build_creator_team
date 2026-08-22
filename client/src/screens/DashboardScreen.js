import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import StatCard from '../components/StatCard';
import { fetchApplications, updateApplicationStatus, fetchJobs } from '../services/api';

export default function DashboardScreen({ currentUser, setActiveTab, navigateToProfile }) {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (currentUser.user_type === 'creator') {
        // Fetch all jobs and all applications
        const [allJobs, allApps] = await Promise.all([
          fetchJobs(),
          fetchApplications()
        ]);
        
        // Filter jobs posted by this creator
        const creatorJobs = allJobs.filter(j => j.creator_id === currentUser.id);
        const creatorJobIds = creatorJobs.map(j => j.id);
        
        // Filter applications sent to this creator's jobs
        const creatorApps = allApps.filter(app => creatorJobIds.includes(app.job_id));
        
        setJobs(creatorJobs);
        setApplications(creatorApps);
      } else {
        // Professional: Fetch applications they submitted
        const myApps = await fetchApplications(null, currentUser.id);
        setApplications(myApps);
      }
    } catch (err) {
      console.warn('Error fetching dashboard data:', err);
      setErrorMsg('Failed to load live data. Displaying local demo items.');
      // Use fallback
      if (currentUser.user_type === 'creator') {
        setApplications(getDemoCreatorApps());
      } else {
        setApplications(getDemoTalentApps());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(appId, newStatus);
      setApplications(prev =>
        prev.map(app => app.id === appId ? { ...app, status: updated.status } : app)
      );
      alert(`Candidate status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getDemoCreatorApps = () => [
    {
      id: 1,
      job: { title: 'Lead YouTube & Reels Video Editor (Tech Channel)', budget: '₹45,000 / month' },
      applicant: {
        full_name: 'Aarav Sharma',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      },
      cover_note: 'Hey! I have edited over 100+ tech videos with retention rates averaging 65%. Check out my sample tech review edit.',
      portfolio_link: 'https://youtube.com/showcase-aarav',
      proposed_rate: '₹45,000 / month',
      status: 'shortlisted'
    },
    {
      id: 2,
      job: { title: 'Short-Form Content Editor (4 Reels/Week)', budget: '₹28,000 / month' },
      applicant: {
        full_name: 'Dev Patel',
        avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      },
      cover_note: 'Hi Kabir! I specialize in high-energy fitness reels with motion titles and upbeat pacing.',
      portfolio_link: 'https://behance.net/devpatel-edits',
      proposed_rate: '₹28,000 / month',
      status: 'submitted'
    }
  ];

  const getDemoTalentApps = () => [
    {
      id: 1,
      job: { title: 'Lead YouTube & Reels Video Editor (Tech Channel)', budget: '₹45,000 / month', creator: { full_name: 'Tech Talkies India' } },
      cover_note: 'Applied to edit tech product walkthroughs and setup reviews.',
      status: 'shortlisted',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      job: { title: 'Executive Creator Operations Manager', budget: '₹60,000 - ₹90,000 / month', creator: { full_name: 'FinBytes India' } },
      cover_note: 'Offered help in planning and coordinating editing sprint pipelines.',
      status: 'submitted',
      created_at: new Date().toISOString()
    }
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard metrics & pipeline...</Text>
      </View>
    );
  }

  // Render logic for Creator Dashboard
  if (currentUser.user_type === 'creator') {
    const totalApps = applications.length;
    const shortlistedApps = applications.filter(a => a.status === 'shortlisted').length;
    const hiredApps = applications.filter(a => a.status === 'hired').length;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Creator Team Operations Dashboard</Text>
          <Text style={styles.subtitle}>Shortlisting pipeline, interview status & active talent hires</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Metrics */}
        <View style={styles.statsRow}>
          <StatCard title="Active Listings" value={jobs.length || "4"} icon="📋" />
          <StatCard title="Total Applications" value={totalApps || "12"} icon="📬" />
          <StatCard title="Shortlisted Candidates" value={shortlistedApps || "3"} icon="⭐" />
          <StatCard title="Active Hires" value={hiredApps || "2"} icon="🤝" />
        </View>

        {/* Applicant Shortlisting Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Applicant Pipeline ({applications.length})</Text>
          
          {applications.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No candidates have applied yet</Text>
              <Text style={styles.emptyText}>When editors or SMMs apply to your listings, they will show up here.</Text>
            </View>
          ) : (
            applications.map((app) => {
              const name = app.applicant?.full_name || 'Anonymous Applicant';
              const avatar = app.applicant?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
              const jobTitle = app.job?.title || 'Job Listing';
              
              return (
                <View key={app.id} style={styles.appCard}>
                  <View style={styles.appHeader}>
                    <View style={styles.userInfo}>
                      <TouchableOpacity 
                        style={styles.userInfoClickable}
                        onPress={() => navigateToProfile && navigateToProfile(app.applicant_id)}
                      >
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <View>
                          <Text style={styles.name}>{name} ↗</Text>
                          <Text style={styles.jobAppliedFor}>
                            Applied for: <Text style={styles.jobHighlight}>{jobTitle}</Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {app.portfolio_link ? (
                        <TouchableOpacity style={{ marginTop: 6, marginLeft: 60 }} onPress={() => window.open && window.open(app.portfolio_link, '_blank')}>
                          <Text style={styles.portfolioLink}>🔗 Portfolio: {app.portfolio_link}</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    <View style={[
                      styles.statusBadge,
                      app.status === 'shortlisted' ? styles.statusShortlisted :
                      app.status === 'hired' ? styles.statusHired : styles.statusSubmitted
                    ]}>
                      <Text style={styles.statusText}>{app.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>Pitch / Cover Note:</Text>
                    <Text style={styles.noteText}>"{app.cover_note}"</Text>
                  </View>

                  <View style={styles.appFooter}>
                    <Text style={styles.proposedRate}>
                      Proposed Rate: <Text style={styles.rateHighlight}>{app.proposed_rate || app.job?.budget || 'N/A'}</Text>
                    </Text>

                    {app.status !== 'hired' && (
                      <View style={styles.actionBtns}>
                        {app.status !== 'shortlisted' && (
                          <TouchableOpacity
                            style={styles.actionBtnSec}
                            onPress={() => handleStatusChange(app.id, 'shortlisted')}
                          >
                            <Text style={styles.actionBtnSecText}>⭐ Shortlist</Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={styles.actionBtnPri}
                          onPress={() => handleStatusChange(app.id, 'hired')}
                        >
                          <Text style={styles.actionBtnPriText}>🤝 Hire Candidate</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    );
  }

  // Render logic for Professional (Talent) Dashboard
  const submittedCount = applications.filter(a => a.status === 'submitted').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Professional Work Dashboard</Text>
        <Text style={styles.subtitle}>Track your submissions, shortlists, and active contract offers</Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Metrics */}
      <View style={styles.statsRow}>
        <StatCard title="Applications Sent" value={applications.length} icon="✉️" />
        <StatCard title="Under Review" value={submittedCount} icon="⏳" />
        <StatCard title="Shortlisted" value={shortlistedCount} icon="⭐️" />
        <StatCard title="Hires / Contracts" value={hiredCount} icon="🎉" />
      </View>

      {/* Application Status Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Your Job Applications</Text>

        {applications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>You haven't applied to any roles yet</Text>
            <Text style={styles.emptyText}>Explore active creator opportunities on the Job Board and send your pitch!</Text>
          </View>
        ) : (
          applications.map((app) => {
            const jobTitle = app.job?.title || 'Unknown Job Listing';
            const creatorName = app.job?.creator?.full_name || 'Verified Creator';
            const budget = app.job?.budget || 'N/A';
            
            return (
              <View key={app.id} style={styles.appCard}>
                <View style={styles.appHeader}>
                  <View>
                    <Text style={styles.jobTitleText}>{jobTitle}</Text>
                    <TouchableOpacity onPress={() => navigateToProfile && navigateToProfile(app.job?.creator_id)}>
                      <Text style={styles.creatorNameText}>Creator: {creatorName} ↗</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateText}>
                      Applied on: {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>

                  <View style={[
                    styles.statusBadge,
                    app.status === 'shortlisted' ? styles.statusShortlisted :
                    app.status === 'hired' ? styles.statusHired : styles.statusSubmitted
                  ]}>
                    <Text style={styles.statusText}>{app.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.noteBox}>
                  <Text style={styles.noteLabel}>Your Sent Pitch:</Text>
                  <Text style={styles.noteText}>"{app.cover_note}"</Text>
                </View>

                <View style={styles.appFooter}>
                  <Text style={styles.proposedRate}>
                    Offered Budget: <Text style={styles.rateHighlight}>{budget}</Text>
                  </Text>
                  <Text style={styles.proposedRate}>
                    Your Proposed Rate: <Text style={styles.rateHighlight}>{app.proposed_rate || budget}</Text>
                  </Text>
                </View>
              </View>
            );
          })
        )}
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
    backgroundColor: colors.surfaceLight,
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
  portfolioLink: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
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
  // Professional dashboard specific styles
  jobTitleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  creatorNameText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  emptyCard: {
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
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 40,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 12,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  userInfoClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
