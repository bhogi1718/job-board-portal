import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const STATUS_INFO = {
  pending:     { label: 'Pending',     color: 'status-pending' },
  reviewing:   { label: 'Reviewing',   color: 'status-reviewing' },
  shortlisted: { label: 'Shortlisted', color: 'status-shortlisted' },
  interview:   { label: 'Interview',   color: 'status-interview' },
  offered:     { label: 'Offered! 🎉', color: 'status-offered' },
  rejected:    { label: 'Rejected',    color: 'status-rejected' },
  withdrawn:   { label: 'Withdrawn',   color: 'status-withdrawn' },
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(r => setApplications(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications(prev => prev.filter(a => a._id !== appId));
      toast.success('Application withdrawn');
    } catch { toast.error('Failed to withdraw'); }
  };

  const grouped = {
    active:   applications.filter(a => ['pending','reviewing','shortlisted','interview'].includes(a.status)),
    positive: applications.filter(a => a.status === 'offered'),
    closed:   applications.filter(a => ['rejected','withdrawn'].includes(a.status)),
  };

  const AppCard = ({ app }) => {
    const si = STATUS_INFO[app.status] || STATUS_INFO.pending;
    return (
      <div className="capp-card">
        <div className="capp-logo">
          {app.job?.companyLogo ? <img src={app.job.companyLogo} alt={app.job?.companyName} /> : <span>{(app.job?.companyName || 'C')[0]}</span>}
        </div>
        <div className="capp-main">
          <Link to={`/jobs/${app.job?._id}`} className="capp-title">{app.job?.title}</Link>
          <div className="capp-company">{app.job?.companyName}</div>
          <div className="capp-meta">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {app.job?.location}
            </span>
            <span>{app.job?.jobType}</span>
          </div>
        </div>
        <div className="capp-right">
          <span className={`badge ${si.color}`}>{si.label}</span>
          <div className="capp-date">{formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}</div>
          {['pending','reviewing'].includes(app.status) && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, fontSize: 12 }} onClick={() => withdraw(app._id)}>Withdraw</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>{user?.name} · {user?.email}</p>
          </div>
          <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs →</Link>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div><div className="dsc-value">{applications.length}</div><div className="dsc-label">Total Applied</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-gold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div><div className="dsc-value">{grouped.active.length}</div><div className="dsc-label">In Progress</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div><div className="dsc-value">{applications.filter(a => a.status === 'interview').length}</div><div className="dsc-label">Interviews</div></div>
          </div>
          <div className="dash-stat-card">
            <div className="dsc-icon dsc-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <div><div className="dsc-value">{grouped.positive.length}</div><div className="dsc-label">Offers</div></div>
          </div>
        </div>

        {!user?.resumeUrl && (
          <div className="profile-banner">
            <div>
              <strong>Complete your profile</strong>
              <span>Upload your resume to apply faster</span>
            </div>
            <Link to="/profile" className="btn btn-primary btn-sm">Complete Profile →</Link>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}</div>
        ) : applications.length === 0 ? (
          <div className="empty-dash">
            <div style={{ fontSize: 48 }}>🎯</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs that match your skills</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <>
            {grouped.positive.length > 0 && (
              <section className="app-section">
                <h2 className="app-section-title offers">🎉 Offers Received</h2>
                <div className="candidate-apps">{grouped.positive.map(a => <AppCard key={a._id} app={a} />)}</div>
              </section>
            )}
            {grouped.active.length > 0 && (
              <section className="app-section">
                <h2 className="app-section-title">Active Applications</h2>
                <div className="candidate-apps">{grouped.active.map(a => <AppCard key={a._id} app={a} />)}</div>
              </section>
            )}
            {grouped.closed.length > 0 && (
              <section className="app-section">
                <h2 className="app-section-title closed">Closed</h2>
                <div className="candidate-apps">{grouped.closed.map(a => <AppCard key={a._id} app={a} />)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}