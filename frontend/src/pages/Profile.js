import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    name:           user?.name || '',
    bio:            user?.bio || '',
    location:       user?.location || '',
    skills:         (user?.skills || []).join(', '),
    linkedIn:       user?.linkedIn || '',
    portfolio:      user?.portfolio || '',
    companyName:    user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    companySize:    user?.companySize || '',
    industry:       user?.industry || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resumeFile) fd.append('resume', resumeFile);
      const { data } = await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-avatar-card">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <h2>{user?.name}</h2>
              <span className={`role-pill role-${user?.role}`}>{user?.role}</span>
              <p className="profile-email">{user?.email}</p>
            </div>
            {user?.role === 'candidate' && (
              <div className="resume-card">
                <div className="resume-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
                  </svg>
                  <span>Resume</span>
                </div>
                {user?.resumeName ? (
                  <div className="resume-file">
                    <span>📄 {user.resumeName}</span>
                    <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View</a>
                  </div>
                ) : (
                  <p className="no-resume">No resume uploaded yet</p>
                )}
              </div>
            )}
          </aside>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="City, Country" value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" placeholder="Tell us about yourself..." style={{ minHeight: 100 }} value={form.bio} onChange={e => set('bio', e.target.value)} />
                </div>
              </div>
            </div>

            {user?.role === 'candidate' && (
              <div className="profile-section">
                <h2>Candidate Details</h2>
                <div className="form-grid-2">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Skills (comma-separated)</label>
                    <input className="form-input" placeholder="React, Python, Machine Learning..." value={form.skills} onChange={e => set('skills', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input className="form-input" placeholder="https://linkedin.com/in/..." value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio / Website</label>
                    <input className="form-input" placeholder="https://yoursite.com" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Resume (PDF/DOC, max 5MB)</label>
                    <div className="file-upload-area" onClick={() => document.getElementById('profile-resume').click()}>
                      <input id="profile-resume" type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} style={{ display: 'none' }} />
                      <div className="upload-icon">📁</div>
                      <div>{resumeFile ? resumeFile.name : user?.resumeName ? `Current: ${user.resumeName} (click to change)` : 'Click to upload resume'}</div>
                      <div className="upload-hint">PDF, DOC, or DOCX up to 5MB</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'employer' && (
              <div className="profile-section">
                <h2>Company Details</h2>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input className="form-input" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input className="form-input" placeholder="Technology, Finance..." value={form.industry} onChange={e => set('industry', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Website</label>
                    <input className="form-input" placeholder="https://company.com" value={form.companyWebsite} onChange={e => set('companyWebsite', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Size</label>
                    <select className="form-input" value={form.companySize} onChange={e => set('companySize', e.target.value)}>
                      <option value="">Select size</option>
                      {['1-10','11-50','51-200','201-500','501-1000','1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <><div className="spinner" /> Saving...</> : '💾 Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}