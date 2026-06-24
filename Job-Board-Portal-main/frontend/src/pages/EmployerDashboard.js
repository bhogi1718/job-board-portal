import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const STATUS_COLORS = {
  active: 'badge-green', paused: 'badge-gold', closed: 'badge-red', draft: 'badge-gray',
};

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    api.get('/jobs/employer/my-listings')
      .then(r => setJobs(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    setActiveTab('applications');
    setAppsLoading(true);
    try {
      const { data } = await api.get(`/applications/job/${job._id}`);
      setApplications(data.data);
    } catch { toast.error('Failed to load applications'); }
    setAppsLoading(false);
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const toggleJob = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus}`);
    } catch { toast.error('Failed to update job'); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete job'); }
  };

  const totalApplications = jobs.reduce((s, j) => s + (j.applicationCount || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'active').length;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p>{user?.companyName || user?.name} · {user?.email}</p>
          </div>
          <Link to="/post-job" className="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Post New Job
          </Link>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
            </div>
            <div><div className="dsc-value">{jobs.length}</div><div className="dsc-label">Total Listings</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div><div className="dsc-value">{activeJobs}</div><div className="dsc-label">Active Jobs</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div><div className="dsc-value">{totalApplications}</div><div className="dsc-label">Applications</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-gold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div><div className="dsc-value">{jobs.reduce((s, j) => s + (j.views || 0), 0)}</div><div className="dsc-label">Total Views</div></div>
          </div>
        </div>

        <div className="dash-tabs">
          <button className={`dash-tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>
            My Listings <span className="tab-badge">{jobs.length}</span>
          </button>
          {selectedJob && (
            <button className={`dash-tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
              Applications for "{selectedJob.title}" <span className="tab-badge">{applications.length}</span>
            </button>
          )}
        </div>

        {activeTab === 'listings' && (
          <div className="dash-content">
            {loading ? (
              <div className="loading-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}</div>
            ) : jobs.length === 0 ? (
              <div className="empty-dash">
                <div style={{ fontSize: 48 }}>📋</div>
                <h3>No job listings yet</h3>
                <p>Post your first job and start receiving applications</p>
                <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
              </div>
            ) : (
              <div className="jobs-table">
                {jobs.map(job => (
                  <div key={job._id} className="job-row">
                    <div className="job-row-main">
                      <div className="job-row-title">
                        <h3>{job.title}</h3>
                        <div className="job-row-meta">
                          <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                          <span className="meta-dot">{job.jobType}</span>
                          <span className="meta-dot">{job.location}</span>
                          <span className="meta-dot">Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="job-row-counters">
                        <div className="counter"><div className="counter-val">{job.applicationCount}</div><div className="counter-lbl">Applied</div></div>
                        <div className="counter"><div className="counter-val">{job.views}</div><div className="counter-lbl">Views</div></div>
                      </div>
                    </div>
                    <div className="job-row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => viewApplications(job)}>View Applications</button>
                      <Link to={`/edit-job/${job._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button className={`btn btn-sm ${job.status === 'active' ? 'btn-outline' : 'btn-success'}`} onClick={() => toggleJob(job._id, job.status)}>
                        {job.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && selectedJob && (
          <div className="dash-content">
            {appsLoading ? (
              <div className="loading-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}</div>
            ) : applications.length === 0 ? (
              <div className="empty-dash">
                <div style={{ fontSize: 48 }}>📭</div>
                <h3>No applications yet</h3>
                <p>Applications for this job will appear here</p>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map(app => (
                  <div key={app._id} className="app-card">
                    <div className="app-card-top">
                      <div className="app-candidate">
                        <div className="candidate-avatar">{app.candidate?.name?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <div className="candidate-name">{app.candidate?.name}</div>
                          <div className="candidate-email">{app.candidate?.email}</div>
                        </div>
                      </div>
                      <div className="app-card-right">
                        <span className={`badge ${app.status}`}>{app.status}</span>
                        <span className="app-date">{formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    {app.candidate?.skills?.length > 0 && (
                      <div className="app-skills">
                        {app.candidate.skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    )}
                    {app.coverLetter && (
                      <p className="app-cover">"{app.coverLetter.slice(0, 200)}{app.coverLetter.length > 200 ? '...' : ''}"</p>
                    )}
                    <div className="app-actions">
                      {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📄 View Resume</a>}
                      <select className="status-select" value={app.status} onChange={e => updateStatus(app._id, e.target.value)}>
                        {['pending','reviewing','shortlisted','interview','offered','rejected'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}