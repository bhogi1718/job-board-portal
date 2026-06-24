import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-mark">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 11L7 3L12 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 8H10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              Talentflow
            </Link>
            <p>Connecting exceptional people with companies building something worth joining.</p>
          </div>
          <div className="footer-links">
            <h4>Candidates</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/register?role=candidate">Create Account</Link>
            <Link to="/dashboard/candidate">My Applications</Link>
          </div>
          <div className="footer-links">
            <h4>Employers</h4>
            <Link to="/post-job">Post a Job</Link>
            <Link to="/register?role=employer">Create Account</Link>
            <Link to="/dashboard/employer">Manage Listings</Link>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Talentflow. All rights reserved.</span>
          <span>Built for job seekers everywhere</span>
        </div>
      </div>
    </footer>
  );
}