import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/shared/JobCard';
import './Jobs.css';

const CATEGORIES = ['Engineering','Design','Marketing','Finance','Sales','Product','Data & AI','Healthcare','Legal','Operations'];
const JOB_TYPES  = ['full-time','part-time','contract','internship','freelance'];
const EXP_LEVELS = ['entry','mid','senior','lead','executive'];

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    search:          searchParams.get('search') || '',
    location:        searchParams.get('location') || '',
    category:        searchParams.get('category') || '',
    jobType:         '',
    experienceLevel: '',
    isRemote:        false,
    salaryMin:       '',
  });

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 12, ...filters };
      if (!params.search) delete params.search;
      Object.keys(params).forEach(k => { if (!params[k] && params[k] !== false) delete params[k]; });
      const { data } = await api.get('/jobs', { params });
      setJobs(data.data);
      setTotal(data.total);
      setPages(data.pages);
      setPage(pg);
    } catch {}
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchJobs(1); }, [fetchJobs]);

  const handleFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const clearFilters = () => setFilters({ search: '', location: '', category: '', jobType: '', experienceLevel: '', isRemote: false, salaryMin: '' });
  const activeCount = Object.values(filters).filter(v => v && v !== false).length;

  return (
    <div className="jobs-page">
      <div className="jobs-header container">
        <div>
          <h1>Browse Jobs</h1>
          <p>{total.toLocaleString()} positions available</p>
        </div>
        <div className="search-inline">
          <div className="search-inline-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search jobs..." value={filters.search} onChange={e => handleFilter('search', e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchJobs(1)} />
          </div>
          <div className="search-inline-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input placeholder="Location..." value={filters.location} onChange={e => handleFilter('location', e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchJobs(1)} />
          </div>
          <button className="btn btn-primary" onClick={() => fetchJobs(1)}>Search</button>
        </div>
      </div>

      <div className="jobs-layout container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters {activeCount > 0 && <span className="filter-count">{activeCount}</span>}</h3>
            {activeCount > 0 && <button onClick={clearFilters} className="clear-btn">Clear all</button>}
          </div>
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              {CATEGORIES.map(c => (
                <button key={c} className={`filter-option ${filters.category === c ? 'active' : ''}`} onClick={() => handleFilter('category', filters.category === c ? '' : c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Job Type</label>
            <div className="filter-options">
              {JOB_TYPES.map(t => (
                <button key={t} className={`filter-option ${filters.jobType === t ? 'active' : ''}`} onClick={() => handleFilter('jobType', filters.jobType === t ? '' : t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <div className="filter-options">
              {EXP_LEVELS.map(e => (
                <button key={e} className={`filter-option ${filters.experienceLevel === e ? 'active' : ''}`} onClick={() => handleFilter('experienceLevel', filters.experienceLevel === e ? '' : e)}>{e}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Min Salary (USD/yr)</label>
            <select className="form-input" value={filters.salaryMin} onChange={e => handleFilter('salaryMin', e.target.value)}>
              <option value="">Any</option>
              <option value="40000">$40,000+</option>
              <option value="60000">$60,000+</option>
              <option value="80000">$80,000+</option>
              <option value="100000">$100,000+</option>
              <option value="150000">$150,000+</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-toggle">
              <input type="checkbox" checked={filters.isRemote} onChange={e => handleFilter('isRemote', e.target.checked)} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
              Remote Only
            </label>
          </div>
        </aside>

        <div className="jobs-results">
          {loading ? (
            <div className="jobs-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 240 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-outline">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="results-count">Showing <strong>{jobs.length}</strong> of <strong>{total}</strong> results</div>
              <div className="jobs-grid">
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-ghost btn-sm" onClick={() => fetchJobs(page - 1)} disabled={page === 1}>← Prev</button>
                  <div className="page-nums">
                    {[...Array(Math.min(pages, 7))].map((_, i) => (
                      <button key={i+1} className={`page-num ${i+1 === page ? 'active' : ''}`} onClick={() => fetchJobs(i+1)}>{i+1}</button>
                    ))}
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => fetchJobs(page + 1)} disabled={page === pages}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}