import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'candidate') return toast.error('Only candidates can apply');
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      fd.append('coverLetter', coverLetter);
      if (resumeFile) fd.append('resume', resumeFile);
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted! 🎉');
      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  const salary = job?.salaryMin && job?.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k / ${job.salaryPeriod}`
    : 'Competitive';

  if (loading) return <div className="job-detail-loading"><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  if (!job) return null;

  return (
    <div className="job-detail-page">
      <div className="container">
        <button onClick={() => navigate('/jobs')} className="back-btn">← Back to Jobs</button>
        <div className="job-detail-layout">
          <article className="job-detail-main">
            <div className="job-detail-header card">
              <div className="jd-company-row">
                <div className="jd-logo">
                  {job.employer?.companyLogo ? <img src={job.employer.companyLogo} alt={job.companyName} /> : <span>{(job.companyName || 'C')[0]}</span>}
                </div>
                <div>
                  <p className="jd-company">{job.companyName}</p>
                  {job.employer?.companyWebsite && <a href={job.employer.companyWebsite} target="_blank" rel="noreferrer" className="jd-website">{job.employer.companyWebsite} ↗</a>}
                </div>
              </div>
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-meta-row">
                <span className="jd-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </span>
                <span className="jd-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                  {job.jobType}
                </span>
                <span className="jd-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="jd-badges">
                <span className="badge badge-blue">{job.jobType}</span>
                <span className="badge badge-gold">{job.experienceLevel}</span>
                {job.isRemote && <span className="badge badge-purple">🌍 Remote</span>}
                {job.featured && <span className="badge badge-green">⭐ Featured</span>}
              </div>
            </div>

            <div className="jd-section card">
              <h2>About the Role</h2>
              <div className="jd-text">{job.description}</div>
            </div>
            {job.responsibilities && <div className="jd-section card"><h2>Responsibilities</h2><div className="jd-text">{job.responsibilities}</div></div>}
            {job.requirements && <div className="jd-section card"><h2>Requirements</h2><div className="jd-text">{job.requirements}</div></div>}
            {job.skills?.length > 0 && (
              <div className="jd-section card">
                <h2>Skills</h2>
                <div className="skills-list">{job.skills.map(s => <span key={s} className="skill-pill">{s}</span>)}</div>
              </div>
            )}
          </article>

          <aside className="job-detail-sidebar">
            <div className="apply-card card">
              <div className="apply-salary">
                <div className="salary-label">Compensation</div>
                <div className="salary-amount">{salary}</div>
              </div>
              <div className="apply-stats">
                <div className="apply-stat"><span className="astat-val">{job.applicationCount}</span><span className="astat-lbl">Applied</span></div>
                <div className="apply-stat"><span className="astat-val">{job.views}</span><span className="astat-lbl">Views</span></div>
              </div>
              {applied ? (
                <div className="applied-badge">✓ Application Submitted</div>
              ) : user?.role === 'candidate' ? (
                <button className="btn btn-primary btn-lg apply-btn" onClick={() => setShowApplyModal(true)}>Apply Now</button>
              ) : !user ? (
                <button className="btn btn-primary btn-lg apply-btn" onClick={() => navigate('/login')}>Sign In to Apply</button>
              ) : null}
              {job.applicationDeadline && <p className="deadline">⏰ Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>}
            </div>
            <div className="company-card card">
              <h3>About {job.companyName}</h3>
              {job.employer?.industry && <p className="company-detail"><strong>Industry:</strong> {job.employer.industry}</p>}
              {job.employer?.companySize && <p className="company-detail"><strong>Size:</strong> {job.employer.companySize}</p>}
              {job.employer?.location && <p className="company-detail"><strong>Location:</strong> {job.employer.location}</p>}
              {job.employer?.companyWebsite && (
                <a href={job.employer.companyWebsite} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>Visit Website ↗</a>
              )}
            </div>
          </aside>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Letter</label>
              <textarea className="form-input" placeholder="Tell us why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ minHeight: 160 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Resume (PDF/DOC, max 5MB)</label>
              <div className="file-drop" onClick={() => document.getElementById('resume-upload').click()}>
                <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} style={{ display: 'none' }} />
                {resumeFile ? <><span>📄</span><span>{resumeFile.name}</span></> : user?.resumeName ? <><span>📋</span><span>Use existing: {user.resumeName}</span></> : <><span>📁</span><span>Click to upload resume</span></>}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                {applying ? <><div className="spinner" />Submitting...</> : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}