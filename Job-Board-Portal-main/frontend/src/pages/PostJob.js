import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './PostJob.css';

const CATEGORIES = ['Engineering','Design','Marketing','Finance','Sales','Product','Data & AI','Healthcare','Legal','Operations','Customer Support','Other'];

const Field = ({ label, required, children }) => (
  <div className="form-group">
    <label className="form-label">{label}{required && <span className="req">*</span>}</label>
    {children}
  </div>
);

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', responsibilities: '',
    category: '', location: '', isRemote: false,
    jobType: 'full-time', experienceLevel: 'mid',
    salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryPeriod: 'yearly',
    skills: '', tags: '', applicationDeadline: '', status: 'active',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.location) {
      return toast.error('Please fill in all required fields');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        tags:   form.tags.split(',').map(t => t.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      const { data } = await api.post('/jobs', payload);
      toast.success('Job posted successfully! 🎉');
      navigate(`/jobs/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
    setLoading(false);
  };

  return (
    <div className="postjob-page">
      <div className="container">
        <div className="postjob-header">
          <h1>Post a New Job</h1>
          <p>Reach thousands of qualified candidates</p>
        </div>

        <div className="steps">
          {['Basic Info', 'Details', 'Compensation'].map((s, i) => (
            <div key={s} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
              {i < 2 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        <div className="postjob-card">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-step fade-in">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <Field label="Job Title" required>
                  <input
                    className="form-input"
                    placeholder="e.g. Senior React Developer"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                  />
                </Field>

                <Field label="Category" required>
                  <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Job Type" required>
                  <select className="form-input" value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                    {['full-time','part-time','contract','internship','freelance'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Experience Level" required>
                  <select className="form-input" value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}>
                    {['entry','mid','senior','lead','executive'].map(l => (
                      <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Location" required>
                  <input
                    className="form-input"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                  />
                </Field>

                <div className="form-group">
                  <label className="remote-toggle">
                    <input
                      type="checkbox"
                      checked={form.isRemote}
                      onChange={e => set('isRemote', e.target.checked)}
                    />
                    <span className="toggle-track"><span className="toggle-thumb" /></span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>Remote Position</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)' }}>This role can be done from anywhere</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="step-nav">
                <div />
                <button className="btn btn-primary" onClick={() => {
                  if (!form.title || !form.category || !form.location) return toast.error('Fill required fields');
                  setStep(2);
                }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-step fade-in">
              <h2>Job Details</h2>

              <Field label="Job Description" required>
                <textarea
                  className="form-input"
                  placeholder="Describe the role, your company culture, and what makes this opportunity exciting..."
                  style={{ minHeight: 180 }}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </Field>

              <Field label="Responsibilities">
                <textarea
                  className="form-input"
                  placeholder="Key responsibilities and day-to-day tasks..."
                  style={{ minHeight: 140 }}
                  value={form.responsibilities}
                  onChange={e => set('responsibilities', e.target.value)}
                />
              </Field>

              <Field label="Requirements">
                <textarea
                  className="form-input"
                  placeholder="Required qualifications, skills, and experience..."
                  style={{ minHeight: 140 }}
                  value={form.requirements}
                  onChange={e => set('requirements', e.target.value)}
                />
              </Field>

              <div className="form-grid">
                <Field label="Required Skills">
                  <input
                    className="form-input"
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                    value={form.skills}
                    onChange={e => set('skills', e.target.value)}
                  />
                </Field>

                <Field label="Tags">
                  <input
                    className="form-input"
                    placeholder="startup, remote-first, equity (comma-separated)"
                    value={form.tags}
                    onChange={e => set('tags', e.target.value)}
                  />
                </Field>
              </div>

              <div className="step-nav">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!form.description) return toast.error('Job description is required');
                  setStep(3);
                }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-step fade-in">
              <h2>Compensation & Publishing</h2>
              <div className="form-grid">
                <Field label="Minimum Salary">
                  <input
                    className="form-input"
                    type="number"
                    placeholder="60000"
                    value={form.salaryMin}
                    onChange={e => set('salaryMin', e.target.value)}
                  />
                </Field>

                <Field label="Maximum Salary">
                  <input
                    className="form-input"
                    type="number"
                    placeholder="90000"
                    value={form.salaryMax}
                    onChange={e => set('salaryMax', e.target.value)}
                  />
                </Field>

                <Field label="Currency">
                  <select className="form-input" value={form.salaryCurrency} onChange={e => set('salaryCurrency', e.target.value)}>
                    {['USD','EUR','GBP','INR','CAD','AUD'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Pay Period">
                  <select className="form-input" value={form.salaryPeriod} onChange={e => set('salaryPeriod', e.target.value)}>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>

                <Field label="Application Deadline">
                  <input
                    className="form-input"
                    type="date"
                    value={form.applicationDeadline}
                    onChange={e => set('applicationDeadline', e.target.value)}
                  />
                </Field>

                <Field label="Publish Status">
                  <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Publish Now</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </Field>
              </div>

              <div className="job-preview">
                <h3>Preview</h3>
                <div className="preview-content">
                  <strong>{form.title || 'Job Title'}</strong>
                  <span>·</span>
                  <span>{form.location}</span>
                  {form.salaryMin && form.salaryMax && (
                    <span className="preview-salary">
                      ${(form.salaryMin / 1000).toFixed(0)}k – ${(form.salaryMax / 1000).toFixed(0)}k
                    </span>
                  )}
                </div>
              </div>

              <div className="step-nav">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><div className="spinner" />Publishing...</> : '🚀 Publish Job'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}