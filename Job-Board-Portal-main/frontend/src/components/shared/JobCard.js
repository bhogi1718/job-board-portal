import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './JobCard.css';

const JOB_TYPE_COLORS = {
  'full-time': 'badge-green',
  'part-time': 'badge-blue',
  'contract':  'badge-gold',
  'internship':'badge-purple',
  'freelance': 'badge-gray',
};

const EXP_COLORS = {
  entry:     'badge-green',
  mid:       'badge-blue',
  senior:    'badge-gold',
  lead:      'badge-purple',
  executive: 'badge-red',
};

export default function JobCard({ job }) {
  const salary = job.salaryMin && job.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
    : job.salaryMin ? `From $${(job.salaryMin / 1000).toFixed(0)}k` : null;

  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      {job.featured && <div className="featured-ribbon">⭐ Featured</div>}
      <div className="job-card-header">
        <div className="company-logo">
          {job.companyLogo
            ? <img src={job.companyLogo} alt={job.companyName} />
            : <span>{(job.companyName || 'C')[0]}</span>}
        </div>
        <div className="job-card-meta">
          <p className="company-name">{job.companyName}</p>
          <p className="posted-time">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
        </div>
        {salary && <div className="salary-tag">{salary}</div>}
      </div>

      <h3 className="job-title">{job.title}</h3>

      <div className="job-card-tags">
        <span className={`badge ${JOB_TYPE_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
        <span className={`badge ${EXP_COLORS[job.experienceLevel] || 'badge-gray'}`}>{job.experienceLevel}</span>
        {job.isRemote && <span className="badge badge-purple">Remote</span>}
      </div>

      <div className="job-card-info">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {job.location}
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          {job.applicationCount} applied
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 4).map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="skill-tag skill-more">+{job.skills.length - 4}</span>}
        </div>
      )}
    </Link>
  );
}