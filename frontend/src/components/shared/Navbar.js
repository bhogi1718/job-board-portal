import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); toast.success('Signed out'); navigate('/'); };
  const dashLink = user?.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <div className="nav-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 11L7 3L12 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 8H10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          Talentflow
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/jobs" className={location.pathname === '/jobs' ? 'active' : ''}>Find Jobs</Link>
          {user && <Link to={dashLink} className={location.pathname.includes('/dashboard') ? 'active' : ''}>Dashboard</Link>}
          {user?.role === 'employer' && <Link to="/post-job" className={location.pathname === '/post-job' ? 'active' : ''}>Post a Job</Link>}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar">
                <div className="avatar-circle">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className={`role-pill role-${user.role}`}>{user.role}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm logout-btn">Sign out</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}