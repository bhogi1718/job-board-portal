import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './PostJob.css';

const CATEGORIES = ['Engineering','Design','Marketing','Finance','Sales','Product','Data & AI','Healthcare','Legal','Operations','Customer Support','Other'];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => {
        const j = r.data.data;
        setForm({ ...j, skills: (j.skills || []).join(', '), tags: (j.tags || []).join(', '), applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '' });
      })
      .catch(() => { toast.error('Job not found'); navigate('/dashboard/employer'); })
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        tags:   form.tags.split(',').map(t => t.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      await api.put(`/jobs/${id}`, payload);
      toast.success('Job updated!');
      navigate('/dashboard/employer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  if (fetching) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}><div className="spinner" style={{ width:40, height:40 }} /></div>;
  if (!form) return null;

  return (
    <div className="postjob-page">
      <div className="container">
        <div className="postjob-header">
          <h1>Edit Job Listing</h1>
          <p>Update your job posting details</p>
        </div>
        <form className="postjob-card" onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
          <div className="edit-section">
            <h2>Basic Info</h2>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Job Title *</label>
                <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-input" value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                  {['full-time','part-time','contract','internship','freelance'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-input" value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}>
                  {['entry','mid','senior','lead','executive'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="edit-section">
            <h2>Description</h2>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Job Description *</label>
              <textarea className="form-input" style={{ minHeight: 160 }} value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Responsibilities</label>
              <textarea className="form-input" style={{ minHeight: 120 }} value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Requirements</label>
              <textarea className="form-input" style={{ minHeight: 120 }} value={form.requirements} onChange={e => set('requirements', e.target.value)} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input className="form-input" value={form.skills} onChange={e => set('skills', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="edit-section">
            <h2>Compensation</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Min Salary</label>
                <input className="form-input" type="number" value={form.salaryMin || ''} onChange={e => set('salaryMin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary</label>
                <input className="form-input" type="number" value={form.salaryMax || ''} onChange={e => set('salaryMax', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={form.applicationDeadline} onChange={e => set('applicationDeadline', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="step-nav">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard/employer')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><div className="spinner" />Saving...</> : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}