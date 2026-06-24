import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
        <h1>Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Your password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <div className="auth-demo">
          <p className="auth-demo-title">Demo Accounts</p>
          <div className="demo-buttons">
            <button className="demo-btn" onClick={() => setForm({ email: 'candidate@demo.com', password: 'demo123' })}>👤 Candidate Demo</button>
            <button className="demo-btn" onClick={() => setForm({ email: 'employer@demo.com', password: 'demo123' })}>🏢 Employer Demo</button>
          </div>
        </div>
        <p className="auth-footer">Don't have an account? <Link to="/register">Create one →</Link></p>
      </div>
    </div>
  );
}