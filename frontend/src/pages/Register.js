import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: searchParams.get('role') || 'candidate', companyName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.role === 'employer' && !form.companyName) return toast.error('Company name is required');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created! Welcome aboard 🚀');
      navigate(user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb" /><div className="auth-grid" /></div>
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#3B82F6" opacity="0.2"/>
            <path d="M7 20L14 8L21 20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 16H18.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>JobBoard</span>
        </div>
        <h1>Create your account</h1>
        <p className="auth-sub">Join thousands of professionals today</p>
        <div className="role-toggle">
          <button className={`role-tab ${form.role === 'candidate' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'candidate' }))}>👤 I'm a Candidate</button>
          <button className={`role-tab ${form.role === 'employer' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'employer' }))}>🏢 I'm an Employer</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          {form.role === 'employer' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-input" placeholder="Acme Corp" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <><div className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in →</Link></p>
      </div>
    </div>
  );
}