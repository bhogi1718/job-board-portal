import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/shared/JobCard';
import './Home.css';

const CATEGORIES = [
  { emoji: '💻', name: 'Engineering',  value: 'Engineering' },
  { emoji: '🎨', name: 'Design',       value: 'Design' },
  { emoji: '📊', name: 'Marketing',    value: 'Marketing' },
  { emoji: '💰', name: 'Finance',      value: 'Finance' },
  { emoji: '🤝', name: 'Sales',        value: 'Sales' },
  { emoji: '📱', name: 'Product',      value: 'Product' },
  { emoji: '🔬', name: 'Data & AI',    value: 'Data & AI' },
  { emoji: '⚕️', name: 'Healthcare',   value: 'Healthcare' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest jobs
    api.get('/jobs?limit=6&sort=-createdAt')
      .then(r => {
        setJobs(r.data.data);
        setTotalJobs(r.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch count per category
    CATEGORIES.forEach(cat => {
      api.get(`/jobs?category=${cat.value}&limit=1`)
        .then(r => {
          setCategoryCounts(prev => ({
            ...prev,
            [cat.value]: r.data.total || 0
          }));
        })
        .catch(() => {});
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params}`);
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient-1" />
          <div className="hero-gradient-2" />
          <div className="hero-grid-lines" />
        </div>

        <div className="container" style={{ width: '100%' }}>
          <div className="hero-inner">

            <div className="hero-left">
              <div className="hero-tag">
                <span className="tag-dot" />
                {totalJobs > 0 ? `${totalJobs.toLocaleString()} roles available now` : 'Roles updated daily'}
              </div>

              <h1 className="hero-h1">
                Where <em>great careers</em><br />
                are built, not found.
              </h1>

              <p className="hero-sub">
                Skip the job board noise. Talentflow connects you
                directly with hiring managers at companies that
                are genuinely excited to meet you.
              </p>

              <div className="hero-btns">
                <button onClick={() => navigate('/jobs')} className="btn btn-primary btn-lg">
                  Browse Open Roles
                </button>
                <button onClick={() => navigate('/register?role=employer')} className="btn btn-ghost btn-lg">
                  Post a Job →
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="search-panel">
                <div className="panel-label">Find your next role</div>
                <form onSubmit={handleSearch}>
                  <div className="search-row">
                    <div className="s-field">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Job title, skill, or company..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="s-field">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="City, country, or Remote..."
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary search-go">Search Jobs</button>
                </form>

                <div className="trending">
                  <div className="trending-label">Trending</div>
                  <div className="trending-tags">
                    {['React', 'Product Manager', 'Data Science', 'Remote', 'Fintech'].map(t => (
                      <button key={t} className="t-tag" onClick={() => { setSearch(t); navigate(`/jobs?search=${t}`); }}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-strip-inner">
            {[
              { num: totalJobs > 0 ? totalJobs.toLocaleString() : '0', lbl: 'Active listings' },
              { num: '4,200+',  lbl: 'Verified companies' },
              { num: '98k+',    lbl: 'Registered candidates' },
              { num: '87%',     lbl: 'Placement rate' },
            ].map(s => (
              <div key={s.lbl} className="strip-stat">
                <div className="strip-num">{s.num}</div>
                <div className="strip-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="container">
          <div className="sec-header">
            <div className="sec-eyebrow">Explore by field</div>
            <h2 className="sec-title">Every industry,<br />one platform.</h2>
          </div>
          <div className="cats-grid">
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat.value] || 0;
              return (
                <button
                  key={cat.value}
                  className="cat-card"
                  onClick={() => navigate(`/jobs?category=${cat.value}`)}
                >
                  <div className="cat-icon-wrap">{cat.emoji}</div>
                  <div className="cat-info">
                    <div className="cat-name">{cat.name}</div>
                    <div className="cat-count">
                      {count > 0 ? `${count.toLocaleString()} open ${count === 1 ? 'role' : 'roles'}` : 'No roles yet'}
                    </div>
                  </div>
                  <div className="cat-arrow">→</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="jobs-section">
        <div className="container">
          <div className="jobs-sec-header">
            <div>
              <div className="sec-eyebrow">Fresh listings</div>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>Just posted</h2>
            </div>
            <button onClick={() => navigate('/jobs')} className="btn btn-outline">View all jobs →</button>
          </div>
          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)' }}>
              <p style={{ marginBottom: 16 }}>No jobs posted yet.</p>
              <button onClick={() => navigate('/register?role=employer')} className="btn btn-primary">Post the First Job</button>
            </div>
          ) : (
            <div className="grid-3">
              {jobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-wrap">
            <div className="cta-text">
              <h2>Ready to find your next great hire?</h2>
              <p>Post a job in under 5 minutes and start receiving applications from qualified candidates immediately.</p>
            </div>
            <div className="cta-action">
              <button onClick={() => navigate('/register?role=employer')} className="btn btn-primary btn-lg">
                Post a Job Free →
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}