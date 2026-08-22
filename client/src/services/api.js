// API Service layer connecting React Native client with FastAPI backend
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:8001/api/v1`
  : 'http://localhost:8001/api/v1';

let authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export function setToken(token) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
}

export function getToken() {
  return authToken;
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function signup(signupData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Signup failed');
  }
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function getMe() {
  if (!authToken) return null;
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders()
  });
  if (!res.ok) {
    setToken(null);
    return null;
  }
  return await res.json();
}

export function logout() {
  setToken(null);
}

export async function fetchJobs(category = null, workType = null, search = '') {
  try {
    let url = `${API_BASE_URL}/jobs/`;
    const params = new URLSearchParams();
    if (category && category !== 'All Roles') params.append('category', category);
    if (workType) params.append('work_type', workType);
    if (search) params.append('search', search);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback seed data:', err.message);
    return getFallbackJobs(category);
  }
}

export async function fetchProfiles(role = null) {
  try {
    let url = `${API_BASE_URL}/profiles/`;
    if (role && role !== 'All Roles') {
      url += `?role=${encodeURIComponent(role)}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback profiles:', err.message);
    return getFallbackProfiles(role);
  }
}

export async function createJob(jobData) {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...jobData,
        platforms: Array.isArray(jobData.platforms) ? jobData.platforms : [jobData.platforms]
      })
    });
    if (!res.ok) {
      const errorDetail = await res.json();
      throw new Error(errorDetail.detail || 'Failed to create job');
    }
    return await res.json();
  } catch (err) {
    console.error('Error creating job:', err);
    throw err;
  }
}

export async function submitApplication(appData) {
  try {
    const res = await fetch(`${API_BASE_URL}/applications/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appData)
    });
    if (!res.ok) {
      const errorDetail = await res.json();
      throw new Error(errorDetail.detail || 'Failed to submit application');
    }
    return await res.json();
  } catch (err) {
    console.error('Error submitting application:', err);
    throw err;
  }
}

// Fallback seed data in case API server is loading
function getFallbackJobs(category) {
  const jobs = [
    {
      id: 1,
      title: "Lead YouTube & Reels Video Editor (Tech Channel)",
      role_category: "Video Editor",
      description: "We publish 2 full-length YouTube tech reviews per week + 4 Reels. Looking for an editor who understands quick jump cuts, crisp B-roll sync, motion graphics, and retention hooks.",
      budget: "₹40,000 - ₹60,000 / month",
      work_type: "Retainer",
      availability: "Full-time (30-40 hrs/wk)",
      platforms: ["YouTube", "Instagram Reels"],
      status: "open",
      applications_count: 4,
      creator: { full_name: "Tech Talkies India", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 2,
      title: "Short-Form Content Editor (4 Reels/Week)",
      role_category: "Video Editor",
      description: "Need a dedicated short-form editor for fitness/vlog content. High energy music transitions, clean subtitles, dynamic captions.",
      budget: "₹25,000 - ₹35,000 / month",
      work_type: "Part-time",
      availability: "15-20 hrs/wk",
      platforms: ["Instagram Reels", "YouTube Shorts"],
      status: "open",
      applications_count: 2,
      creator: { full_name: "FitLife with Kabir", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 3,
      title: "Social Media Manager & Growth Strategist",
      role_category: "Social Media Manager",
      description: "Manage posting schedule, optimize YouTube titles/thumbnails/tags, write engaging carousel copy for Instagram, and track analytics.",
      budget: "₹35,000 - ₹50,000 / month",
      work_type: "Retainer",
      availability: "20-25 hrs/wk",
      platforms: ["Instagram", "YouTube", "LinkedIn"],
      status: "open",
      applications_count: 5,
      creator: { full_name: "FinBytes India", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 4,
      title: "Executive Creator Operations Manager",
      role_category: "Creator Manager",
      description: "Looking for an experienced manager to oversee content calendar, coordinate video editors & designers, negotiate inbound brand deals, and keep production smooth.",
      budget: "₹60,000 - ₹90,000 / month",
      work_type: "Full-time",
      availability: "40 hrs/wk",
      platforms: ["YouTube", "Instagram", "Email/Ops"],
      status: "open",
      applications_count: 3,
      creator: { full_name: "Tech Talkies India", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    }
  ];

  if (category && category !== 'All Roles') {
    return jobs.filter(j => j.role_category.toLowerCase().includes(category.toLowerCase()));
  }
  return jobs;
}

function getFallbackProfiles(role) {
  const profiles = [
    {
      id: 1,
      primary_role: "Video Editor",
      bio: "4+ years editing fast-paced YouTube tech reviews and retention-focused Reels. Expert in Premiere Pro & DaVinci.",
      location: "Bengaluru, IN",
      experience_years: 4,
      skills: ["Premiere Pro", "DaVinci Resolve", "YouTube Retention Editing", "CapCut Pro"],
      rate_range: "₹35,000 - ₹55,000 / mo",
      rating: 4.9,
      completed_projects: 28,
      verified: true,
      user: { full_name: "Aarav Sharma", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 2,
      primary_role: "Video Editor",
      bio: "Specializing in 2D/3D Motion Graphics, Alex Hormozi style captions, and high-converting Shorts for top creators.",
      location: "Mumbai, IN",
      experience_years: 3,
      skills: ["After Effects", "Motion Graphics", "Sound Design", "Reels/Shorts"],
      rate_range: "₹25,000 - ₹40,000 / mo",
      rating: 4.8,
      completed_projects: 19,
      verified: true,
      user: { full_name: "Dev Patel", avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 3,
      primary_role: "Social Media Manager",
      bio: "Scaled 5 creator channels from 10K to 200K+ followers. Content strategy, posting schedules, and community management.",
      location: "Delhi NCR, IN",
      experience_years: 5,
      skills: ["Instagram Growth", "YouTube SEO", "Content Strategy", "Analytics"],
      rate_range: "₹30,000 - ₹50,000 / mo",
      rating: 5.0,
      completed_projects: 35,
      verified: true,
      user: { full_name: "Ananya Verma", avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    },
    {
      id: 4,
      primary_role: "Creator Manager",
      bio: "End-to-end ops for top 1% creators: Brand deal outreach, team coordination, logistics, and video production scheduling.",
      location: "Remote / Mumbai, IN",
      experience_years: 6,
      skills: ["Brand Sponsorship Negotiation", "Team Management", "Workflow Automation", "Contract Handling"],
      rate_range: "₹50,000 - ₹80,000 / mo",
      rating: 4.9,
      completed_projects: 14,
      verified: true,
      user: { full_name: "Rohan Gupta", avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" }
    }
  ];

  if (role && role !== 'All Roles') {
    return profiles.filter(p => p.primary_role.toLowerCase().includes(role.toLowerCase()));
  }
  return profiles;
}

export async function fetchApplications(jobId = null, applicantId = null) {
  try {
    let url = `${API_BASE_URL}/applications/`;
    const params = new URLSearchParams();
    if (jobId) params.append('job_id', jobId);
    if (applicantId) params.append('applicant_id', applicantId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return await res.json();
  } catch (err) {
    console.error('Error fetching applications:', err);
    throw err;
  }
}

export async function updateApplicationStatus(applicationId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/applications/${applicationId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to update application status');
    }
    return await res.json();
  } catch (err) {
    console.error('Error updating application status:', err);
    throw err;
  }
}

export async function fetchProfileByUserId(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/profiles/user/${userId}`);
    if (!res.ok) throw new Error('Profile not found');
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch profile for user ${userId}, using fallback:`, err.message);
    if (userId === 1 || userId === '1') {
      return {
        user: { id: 1, email: "creator.tech@creatoros.in", full_name: "Tech Talkies India", user_type: "creator", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
        profile: { id: 1, user_id: 1, bio: "Leading Tech & Gadget review channel with 450K subscribers across YouTube & Instagram.", niche: "Tech & Reviews", subscriber_count: "450K+", brand_name: "TechTalkies", instagram_handle: "@techtalkies" },
        working_partners: [
          { user_id: 4, full_name: "Aarav Sharma", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", role: "Video Editor", job_title: "Lead YouTube Editor" }
        ]
      };
    } else {
      return {
        user: { id: 4, email: "aarav.editor@creatoros.in", full_name: "Aarav Sharma", user_type: "professional", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
        profile: { id: 4, user_id: 4, primary_role: "Video Editor", bio: "4+ years editing fast-paced YouTube tech reviews and retention-focused Reels. Expert in Premiere Pro & DaVinci.", location: "Bengaluru, IN", experience_years: 4, skills: ["Premiere Pro", "DaVinci Resolve", "YouTube Retention Editing"], portfolio_links: ["https://youtube.com/showcase-aarav"], rate_range: "₹35,000 - ₹55,000 / mo", rating: 4.9, completed_projects: 28, verified: true, education: "B.A. in Digital Media, IIT Bombay" },
        working_partners: [
          { user_id: 1, full_name: "Tech Talkies India", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", role: "Creator / Hirer", job_title: "Lead YouTube Editor" }
        ]
      };
    }
  }
}

export async function updateMyProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE_URL}/profiles/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to update profile');
    }
    return await res.json();
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err;
  }
}
