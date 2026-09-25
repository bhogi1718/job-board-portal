<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- 
  ================================================================
  JobBoard Admin Panel - index.jsp
  ================================================================
  This JSP page renders the admin dashboard.
  In a real deployment, replace API_BASE with your backend URL
  and wire up session-based auth via HttpSession / JSTL.
  For demo purposes this page self-contained with JS fetch calls.
  ================================================================
--%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobBoard Admin Panel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:       #060A12;
      --bg-2:     #0C1220;
      --surface:  #111827;
      --surface-2:#18243A;
      --border:   rgba(99,140,198,0.14);
      --border-2: rgba(99,140,198,0.26);
      --accent:   #3B82F6;
      --accent-2: #60A5FA;
      --gold:     #F59E0B;
      --green:    #10B981;
      --red:      #EF4444;
      --purple:   #8B5CF6;
      --text:     #F0F4FF;
      --text-2:   #94A3B8;
      --text-3:   #4B6280;
      --font-d: 'Syne', sans-serif;
      --font-b: 'DM Sans', sans-serif;
      --r: 12px; --rl: 18px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-b); background: var(--bg); color: var(--text); min-height: 100vh; display: flex; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: var(--font-b); }

    /* SIDEBAR */
    .sidebar {
      width: 240px;
      background: var(--bg-2);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      min-height: 100vh;
      position: fixed; top: 0; left: 0; bottom: 0;
      z-index: 50;
    }
    .sidebar-logo {
      padding: 24px 20px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
      font-family: var(--font-d);
      font-size: 18px; font-weight: 800;
    }
    .logo-icon {
      width: 34px; height: 34px;
      background: rgba(59,130,246,0.15);
      border: 1px solid rgba(59,130,246,0.3);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .admin-badge {
      margin-left: auto;
      background: rgba(245,158,11,0.15);
      border: 1px solid rgba(245,158,11,0.3);
      color: #FCD34D;
      font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 100px;
      letter-spacing: 0.06em;
    }
    .nav-section { padding: 20px 12px 8px; }
    .nav-label { font-size: 10px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.1em; padding: 0 8px; margin-bottom: 8px; }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: var(--r);
      font-size: 14px; font-weight: 500; color: var(--text-2);
      transition: all 0.15s; cursor: pointer; border: none; background: none; width: 100%; text-align: left;
    }
    .nav-item:hover { background: var(--surface); color: var(--text); }
    .nav-item.active { background: rgba(59,130,246,0.12); color: var(--accent-2); }
    .nav-item svg { flex-shrink: 0; opacity: 0.7; }
    .nav-item.active svg { opacity: 1; }
    .nav-count {
      margin-left: auto;
      background: var(--surface-2);
      border-radius: 100px;
      padding: 1px 8px;
      font-size: 11px; font-weight: 700; color: var(--text-3);
    }
    .nav-item.active .nav-count { background: rgba(59,130,246,0.2); color: var(--accent-2); }
    .sidebar-footer { margin-top: auto; padding: 16px 12px; border-top: 1px solid var(--border); }
    .admin-user { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: var(--r); background: var(--surface); }
    .admin-avatar { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--purple)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
    .admin-info { flex: 1; }
    .admin-name { font-size: 13px; font-weight: 600; }
    .admin-role-tag { font-size: 11px; color: var(--text-3); }

    /* MAIN CONTENT */
    .main { margin-left: 240px; flex: 1; padding: 0; }
    .topbar {
      background: rgba(6,10,18,0.8);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      padding: 16px 32px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 40;
    }
    .topbar-title { font-family: var(--font-d); font-size: 20px; font-weight: 700; }
    .topbar-actions { display: flex; gap: 10px; align-items: center; }
    .topbar-search {
      display: flex; align-items: center; gap: 8px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); padding: 8px 14px;
    }
    .topbar-search input { background: none; border: none; outline: none; color: var(--text); font-size: 14px; width: 200px; font-family: var(--font-b); }
    .topbar-search input::placeholder { color: var(--text-3); }

    .content { padding: 28px 32px; }

    /* STATS */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--rl);
      padding: 22px;
      display: flex; flex-direction: column; gap: 12px;
      position: relative; overflow: hidden;
      transition: border-color 0.2s;
    }
    .stat-card:hover { border-color: var(--border-2); }
    .stat-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .stat-icon { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
    .si-blue   { background: rgba(59,130,246,0.12); color: var(--accent-2); }
    .si-green  { background: rgba(16,185,129,0.12); color: #34D399; }
    .si-purple { background: rgba(139,92,246,0.12); color: #A78BFA; }
    .si-gold   { background: rgba(245,158,11,0.12); color: #FCD34D; }
    .stat-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
    .trend-up { color: #34D399; }
    .trend-down { color: #FCA5A5; }
    .stat-val { font-family: var(--font-d); font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; }
    .stat-lbl { font-size: 13px; color: var(--text-2); }
    .stat-glow {
      position: absolute; width: 150px; height: 150px;
      border-radius: 50%; filter: blur(40px);
      top: -50px; right: -30px;
      pointer-events: none;
    }
    .sg-blue   { background: rgba(59,130,246,0.06); }
    .sg-green  { background: rgba(16,185,129,0.06); }
    .sg-purple { background: rgba(139,92,246,0.06); }
    .sg-gold   { background: rgba(245,158,11,0.06); }

    /* PANELS */
    .panels-row { display: grid; grid-template-columns: 1fr 360px; gap: 20px; margin-bottom: 24px; }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--rl);
      overflow: hidden;
    }
    .panel-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .panel-header h3 { font-family: var(--font-d); font-size: 15px; }
    .panel-action { font-size: 13px; color: var(--accent-2); cursor: pointer; transition: color 0.2s; }
    .panel-action:hover { color: var(--text); }

    /* TABLES */
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th {
      padding: 11px 20px;
      text-align: left;
      font-size: 11px; font-weight: 700; color: var(--text-3);
      text-transform: uppercase; letter-spacing: 0.08em;
      background: rgba(0,0,0,0.2);
      border-bottom: 1px solid var(--border);
    }
    .admin-table td { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: middle; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tbody tr { transition: background 0.15s; }
    .admin-table tbody tr:hover { background: rgba(255,255,255,0.02); }

    .cell-user { display: flex; align-items: center; gap: 10px; }
    .cell-avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--purple));
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .cell-name { font-weight: 600; font-size: 14px; }
    .cell-email { font-size: 12px; color: var(--text-2); }

    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.03em;
    }
    .badge-candidate { background: rgba(16,185,129,0.1); color: #34D399; border: 1px solid rgba(16,185,129,0.25); }
    .badge-employer  { background: rgba(59,130,246,0.1);  color: #93C5FD; border: 1px solid rgba(59,130,246,0.25); }
    .badge-admin     { background: rgba(245,158,11,0.1);  color: #FCD34D; border: 1px solid rgba(245,158,11,0.25); }
    .badge-active    { background: rgba(16,185,129,0.1); color: #34D399; border: 1px solid rgba(16,185,129,0.2); }
    .badge-paused    { background: rgba(245,158,11,0.1); color: #FCD34D; border: 1px solid rgba(245,158,11,0.2); }
    .badge-closed    { background: rgba(239,68,68,0.1);  color: #FCA5A5; border: 1px solid rgba(239,68,68,0.2); }
    .badge-inactive  { background: rgba(148,163,184,0.08); color: var(--text-2); border: 1px solid var(--border); }

    .action-btn {
      background: none; border: 1px solid var(--border);
      border-radius: 7px; padding: 5px 12px;
      font-size: 12px; font-weight: 600; color: var(--text-2);
      transition: all 0.15s; cursor: pointer;
    }
    .action-btn:hover { border-color: var(--accent); color: var(--accent-2); }
    .action-btn.danger:hover { border-color: var(--red); color: #FCA5A5; }
    .action-btn.success:hover { border-color: var(--green); color: #34D399; }

    /* Activity feed */
    .activity-list { padding: 8px 0; }
    .activity-item { padding: 14px 24px; display: flex; gap: 12px; align-items: flex-start; border-bottom: 1px solid var(--border); }
    .activity-item:last-child { border-bottom: none; }
    .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .ad-blue   { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
    .ad-green  { background: var(--green); box-shadow: 0 0 8px var(--green); }
    .ad-gold   { background: var(--gold); box-shadow: 0 0 8px var(--gold); }
    .ad-purple { background: var(--purple); box-shadow: 0 0 8px var(--purple); }
    .activity-text { font-size: 13px; color: var(--text-2); line-height: 1.5; }
    .activity-text strong { color: var(--text); }
    .activity-time { font-size: 11px; color: var(--text-3); margin-top: 3px; }

    /* Chart placeholder */
    .chart-area {
      padding: 24px;
      height: 200px;
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }
    .chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .chart-bar {
      width: 100%;
      background: rgba(59,130,246,0.2);
      border: 1px solid rgba(59,130,246,0.3);
      border-radius: 4px 4px 0 0;
      transition: all 0.3s;
      position: relative;
    }
    .chart-bar:hover { background: rgba(59,130,246,0.4); }
    .chart-bar.highlight { background: var(--accent); border-color: var(--accent-2); box-shadow: 0 0 16px rgba(59,130,246,0.4); }
    .chart-label { font-size: 10px; color: var(--text-3); }

    /* Tabs */
    .tab-bar { display: flex; gap: 4px; padding: 16px 24px 0; border-bottom: 1px solid var(--border); }
    .tab-btn { padding: 8px 16px; background: none; border: none; border-bottom: 2px solid transparent; font-size: 13px; font-weight: 600; color: var(--text-2); cursor: pointer; transition: all 0.2s; margin-bottom: -1px; font-family: var(--font-b); }
    .tab-btn:hover { color: var(--text); }
    .tab-btn.active { color: var(--accent-2); border-bottom-color: var(--accent); }

    /* Toast */
    .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface); border: 1px solid var(--border-2); border-radius: var(--rl); padding: 14px 20px; font-size: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 999; animation: slideIn 0.3s ease; min-width: 260px; display: flex; align-items: center; gap: 10px; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .toast.success { border-color: rgba(16,185,129,0.3); }
    .toast.error   { border-color: rgba(239,68,68,0.3); }

    /* Loader */
    .loading { display: flex; justify-content: center; padding: 48px; }
    .spinner { width: 24px; height: 24px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .section-title { font-family: var(--font-d); font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; }

    .empty { padding: 48px; text-align: center; color: var(--text-2); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease; }
  </style>
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <div class="logo-icon">
      <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
        <path d="M7 20L14 8L21 20" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9.5 16H18.5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    JobBoard
    <span class="admin-badge">ADMIN</span>
  </div>

  <div class="nav-section">
    <div class="nav-label">Overview</div>
    <button class="nav-item active" onclick="showSection('dashboard')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      Dashboard
    </button>
  </div>

  <div class="nav-section">
    <div class="nav-label">Management</div>
    <button class="nav-item" onclick="showSection('users')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      Users
      <span class="nav-count" id="nav-users">...</span>
    </button>
    <button class="nav-item" onclick="showSection('jobs')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      Job Listings
      <span class="nav-count" id="nav-jobs">...</span>
    </button>
    <button class="nav-item" onclick="showSection('applications')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
      Applications
    </button>
  </div>

  <div class="nav-section">
    <div class="nav-label">Analytics</div>
    <button class="nav-item" onclick="showSection('analytics')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      Analytics
    </button>
  </div>

  <div class="sidebar-footer">
    <div class="admin-user">
      <div class="admin-avatar">A</div>
      <div class="admin-info">
        <div class="admin-name">Admin User</div>
        <div class="admin-role-tag">Super Admin</div>
      </div>
    </div>
  </div>
</aside>

<!-- MAIN -->
<main class="main">
  <div class="topbar">
    <div class="topbar-title" id="page-title">Dashboard</div>
    <div class="topbar-actions">
      <div class="topbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search..." id="global-search">
      </div>
      <a href="/" target="_blank" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);color:var(--accent-2);border-radius:var(--r);padding:8px 14px;font-size:13px;font-weight:600;">
        View Site ↗
      </a>
    </div>
  </div>

  <div class="content">

    <!-- DASHBOARD SECTION -->
    <div id="section-dashboard" class="fade-in">
      <div class="stats-row" id="stats-row">
        <div style="height:100px" class="skeleton" style="border-radius:18px"></div>
        <div style="height:100px" class="skeleton" style="border-radius:18px"></div>
        <div style="height:100px" class="skeleton" style="border-radius:18px"></div>
        <div style="height:100px" class="skeleton" style="border-radius:18px"></div>
      </div>

      <div class="panels-row">
        <div class="panel">
          <div class="panel-header">
            <h3>Applications This Week</h3>
            <span class="panel-action" onclick="showSection('applications')">View all →</span>
          </div>
          <div class="chart-area" id="chart-area">
            <div class="loading"><div class="spinner"></div></div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><h3>Recent Activity</h3></div>
          <div class="activity-list" id="activity-list">
            <div class="loading"><div class="spinner"></div></div>
          </div>
        </div>
      </div>

      <div class="panels-row" style="grid-template-columns:1fr 1fr">
        <div class="panel">
          <div class="panel-header">
            <h3>Recent Users</h3>
            <span class="panel-action" onclick="showSection('users')">View all →</span>
          </div>
          <div id="recent-users-table"><div class="loading"><div class="spinner"></div></div></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3>Recent Jobs</h3>
            <span class="panel-action" onclick="showSection('jobs')">View all →</span>
          </div>
          <div id="recent-jobs-table"><div class="loading"><div class="spinner"></div></div></div>
        </div>
      </div>
    </div>

    <!-- USERS SECTION -->
    <div id="section-users" style="display:none" class="fade-in">
      <h2 class="section-title">User Management</h2>
      <div class="panel">
        <div class="tab-bar">
          <button class="tab-btn active" onclick="filterUsers('all', this)">All Users</button>
          <button class="tab-btn" onclick="filterUsers('candidate', this)">Candidates</button>
          <button class="tab-btn" onclick="filterUsers('employer', this)">Employers</button>
        </div>
        <div id="users-table"><div class="loading"><div class="spinner"></div></div></div>
      </div>
    </div>

    <!-- JOBS SECTION -->
    <div id="section-jobs" style="display:none" class="fade-in">
      <h2 class="section-title">Job Listings</h2>
      <div class="panel">
        <div class="tab-bar">
          <button class="tab-btn active" onclick="filterJobs('all', this)">All Jobs</button>
          <button class="tab-btn" onclick="filterJobs('active', this)">Active</button>
          <button class="tab-btn" onclick="filterJobs('paused', this)">Paused</button>
          <button class="tab-btn" onclick="filterJobs('closed', this)">Closed</button>
        </div>
        <div id="jobs-table"><div class="loading"><div class="spinner"></div></div></div>
      </div>
    </div>

    <!-- APPLICATIONS SECTION -->
    <div id="section-applications" style="display:none" class="fade-in">
      <h2 class="section-title">Applications</h2>
      <p style="color:var(--text-2);margin-bottom:24px">View applications via the job listings panel or employer dashboard.</p>
      <div class="panel" style="padding:48px;text-align:center;color:var(--text-2)">
        <div style="font-size:48px;margin-bottom:12px">📋</div>
        <p>Select a job from <span class="panel-action" onclick="showSection('jobs')">Job Listings</span> to view its applications.</p>
      </div>
    </div>

    <!-- ANALYTICS SECTION -->
    <div id="section-analytics" style="display:none" class="fade-in">
      <h2 class="section-title">Analytics Overview</h2>
      <div id="analytics-content"><div class="loading"><div class="spinner"></div></div></div>
    </div>

  </div>
</main>

<script>
  const API = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  let allUsers = [];
  let allJobs  = [];
  let stats    = {};

  async function apiFetch(path) {
    const r = await fetch(API + path, { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error('API error ' + r.status);
    return r.json();
  }

  // ── Nav ──────────────────────────────────────────────
  function showSection(name) {
    document.querySelectorAll('[id^="section-"]').forEach(el => el.style.display = 'none');
    document.getElementById('section-' + name).style.display = 'block';
    document.getElementById('section-' + name).classList.add('fade-in');
    document.getElementById('page-title').textContent = name.charAt(0).toUpperCase() + name.slice(1);
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    event?.currentTarget?.classList?.add('active');

    if (name === 'users' && allUsers.length === 0) loadUsers();
    if (name === 'jobs'  && allJobs.length === 0)  loadJobs();
    if (name === 'analytics') loadAnalytics();
  }

  // ── Dashboard ─────────────────────────────────────────
  async function loadDashboard() {
    try {
      const { data } = await apiFetch('/admin/stats');
      stats = data;

      // Update nav counts
      document.getElementById('nav-users').textContent = data.totalUsers;
      document.getElementById('nav-jobs').textContent  = data.totalJobs;

      // Stats cards
      document.getElementById('stats-row').innerHTML = `
        ${statCard('Total Users', data.totalUsers, 'si-blue', 'sg-blue', userIcon(), '+12%', true)}
        ${statCard('Active Jobs', data.activeJobs, 'si-green', 'sg-green', jobIcon(), '+8%', true)}
        ${statCard('Applications', data.totalApplications, 'si-purple', 'sg-purple', appIcon(), '+24%', true)}
        ${statCard('Employers', data.employers, 'si-gold', 'sg-gold', empIcon(), '+5%', true)}
      `;

      // Chart
      renderChart();

      // Activity
      renderActivity(data.recentUsers, data.recentJobs);

      // Recent tables
      renderMiniUserTable(data.recentUsers);
      renderMiniJobTable(data.recentJobs);

    } catch (e) {
      console.error(e);
      showToast('Could not connect to API. Start the backend server.', 'error');
      renderMockDashboard();
    }
  }

  function statCard(label, value, iconClass, glowClass, icon, trend, up) {
    return `<div class="stat-card">
      <div class="stat-glow ${glowClass}"></div>
      <div class="stat-card-top">
        <div class="stat-icon ${iconClass}">${icon}</div>
        <div class="stat-trend ${up ? 'trend-up' : 'trend-down'}">${up ? '↑' : '↓'} ${trend}</div>
      </div>
      <div class="stat-val">${(value||0).toLocaleString()}</div>
      <div class="stat-lbl">${label}</div>
    </div>`;
  }

  function renderChart() {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const data = [12,19,8,25,32,14,28];
    const max = Math.max(...data);
    document.getElementById('chart-area').innerHTML = days.map((d, i) => `
      <div class="chart-bar-wrap">
        <div class="chart-bar ${i === 6 ? 'highlight' : ''}" style="height:${(data[i]/max)*140}px" title="${data[i]} applications"></div>
        <div class="chart-label">${d}</div>
      </div>`).join('');
  }

  function renderActivity(users, jobs) {
    const items = [
      ...(users||[]).slice(0,3).map(u => ({ dot:'ad-blue', text:`<strong>${u.name}</strong> registered as ${u.role}`, time:'Just now' })),
      ...(jobs||[]).slice(0,3).map(j => ({ dot:'ad-green', text:`<strong>${j.employer?.companyName||'A company'}</strong> posted <strong>${j.title}</strong>`, time:'Recently' })),
    ];
    if (!items.length) items.push({ dot:'ad-gold', text:'No recent activity', time:'' });
    document.getElementById('activity-list').innerHTML = items.map(i => `
      <div class="activity-item">
        <div class="activity-dot ${i.dot}"></div>
        <div>
          <div class="activity-text">${i.text}</div>
          <div class="activity-time">${i.time}</div>
        </div>
      </div>`).join('');
  }

  function renderMiniUserTable(users) {
    if (!users?.length) { document.getElementById('recent-users-table').innerHTML = '<div class="empty">No users yet</div>'; return; }
    document.getElementById('recent-users-table').innerHTML = `
      <table class="admin-table">
        <thead><tr><th>User</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>${users.map(u => `
          <tr>
            <td><div class="cell-user"><div class="cell-avatar">${u.name[0]}</div><div><div class="cell-name">${u.name}</div><div class="cell-email">${u.email}</div></div></div></td>
            <td><span class="badge badge-${u.role}">${u.role}</span></td>
            <td><span class="badge ${u.isActive ? 'badge-active' : 'badge-inactive'}">${u.isActive ? 'Active' : 'Inactive'}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderMiniJobTable(jobs) {
    if (!jobs?.length) { document.getElementById('recent-jobs-table').innerHTML = '<div class="empty">No jobs yet</div>'; return; }
    document.getElementById('recent-jobs-table').innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Job</th><th>Status</th><th>Apps</th></tr></thead>
        <tbody>${jobs.map(j => `
          <tr>
            <td><div class="cell-name">${j.title}</div><div class="cell-email">${j.companyName}</div></td>
            <td><span class="badge badge-${j.status}">${j.status}</span></td>
            <td>${j.applicationCount||0}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  // ── Users ─────────────────────────────────────────────
  async function loadUsers() {
    try {
      const { data } = await apiFetch('/admin/users');
      allUsers = data;
      renderUsers(allUsers);
    } catch { renderUsers([]); }
  }

  function renderUsers(users) {
    if (!users.length) { document.getElementById('users-table').innerHTML = '<div class="empty">No users found</div>'; return; }
    document.getElementById('users-table').innerHTML = `
      <table class="admin-table">
        <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${users.map(u => `
          <tr>
            <td><div class="cell-user"><div class="cell-avatar">${u.name[0]}</div><div><div class="cell-name">${u.name}</div><div class="cell-email">${u.email}</div></div></div></td>
            <td><span class="badge badge-${u.role}">${u.role}</span></td>
            <td style="color:var(--text-2);font-size:13px">${new Date(u.createdAt).toLocaleDateString()}</td>
            <td><span class="badge ${u.isActive ? 'badge-active' : 'badge-inactive'}">${u.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>
              <button class="action-btn ${u.isActive ? 'danger' : 'success'}" onclick="toggleUser('${u._id}', ${u.isActive})">
                ${u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function filterUsers(role, btn) {
    document.querySelectorAll('#section-users .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderUsers(role === 'all' ? allUsers : allUsers.filter(u => u.role === role));
  }

  async function toggleUser(id, isActive) {
    try {
      const { data } = await apiFetch('/admin/users/' + id + '/toggle');
      const idx = allUsers.findIndex(u => u._id === id);
      if (idx >= 0) allUsers[idx].isActive = data.isActive;
      renderUsers(allUsers);
      showToast('User ' + (data.isActive ? 'activated' : 'deactivated'));
    } catch { showToast('Failed to update user', 'error'); }
  }

  // ── Jobs ──────────────────────────────────────────────
  async function loadJobs() {
    try {
      const { data } = await apiFetch('/admin/jobs');
      allJobs = data;
      renderJobs(allJobs);
    } catch { renderJobs([]); }
  }

  function renderJobs(jobs) {
    if (!jobs.length) { document.getElementById('jobs-table').innerHTML = '<div class="empty">No jobs found</div>'; return; }
    document.getElementById('jobs-table').innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Job</th><th>Company</th><th>Type</th><th>Apps</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${jobs.map(j => `
          <tr>
            <td><div class="cell-name">${j.title}</div><div class="cell-email">${j.category}</div></td>
            <td style="color:var(--text-2)">${j.employer?.companyName || j.companyName}</td>
            <td style="text-transform:capitalize;font-size:13px;color:var(--text-2)">${j.jobType}</td>
            <td>${j.applicationCount||0}</td>
            <td><span class="badge badge-${j.status}">${j.status}</span></td>
            <td style="display:flex;gap:6px">
              <button class="action-btn success" onclick="featureJob('${j._id}')">${j.featured ? '★ Unfeature' : '☆ Feature'}</button>
              <button class="action-btn danger" onclick="deleteJob('${j._id}')">Delete</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function filterJobs(status, btn) {
    document.querySelectorAll('#section-jobs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderJobs(status === 'all' ? allJobs : allJobs.filter(j => j.status === status));
  }

  async function featureJob(id) {
    try {
      await apiFetch('/admin/jobs/' + id + '/feature');
      const j = allJobs.find(j => j._id === id);
      if (j) j.featured = !j.featured;
      renderJobs(allJobs);
      showToast('Job updated');
    } catch { showToast('Failed', 'error'); }
  }

  async function deleteJob(id) {
    if (!confirm('Delete this job?')) return;
    try {
      await fetch(API + '/admin/jobs/' + id, { method:'DELETE', headers:{ Authorization: 'Bearer ' + token } });
      allJobs = allJobs.filter(j => j._id !== id);
      renderJobs(allJobs);
      showToast('Job deleted');
    } catch { showToast('Failed', 'error'); }
  }

  // ── Analytics ─────────────────────────────────────────
  function loadAnalytics() {
    document.getElementById('analytics-content').innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
        ${analyticsCard('Candidate to Employer Ratio', stats.candidates + ' : ' + stats.employers)}
        ${analyticsCard('Avg Applications / Job', stats.totalJobs ? Math.round(stats.totalApplications / stats.totalJobs) : 0)}
        ${analyticsCard('Active Job Fill Rate', '72%')}
      </div>
      <div class="panel" style="padding:24px">
        <h3 style="margin-bottom:16px;font-family:var(--font-d)">Platform Health</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${healthBar('User Acquisition', 78)}
          ${healthBar('Job Listing Quality', 91)}
          ${healthBar('Application Conversion', 64)}
          ${healthBar('Employer Satisfaction', 85)}
        </div>
      </div>`;
  }

  function analyticsCard(label, value) {
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:24px">
      <div style="font-size:2rem;font-family:var(--font-d);font-weight:800;letter-spacing:-0.03em">${value}</div>
      <div style="font-size:13px;color:var(--text-2);margin-top:6px">${label}</div>
    </div>`;
  }

  function healthBar(label, pct) {
    return `<div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
        <span style="color:var(--text-2)">${label}</span>
        <span style="font-weight:700">${pct}%</span>
      </div>
      <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;transition:width 1s ease"></div>
      </div>
    </div>`;
  }

  // ── Mock fallback (no backend) ─────────────────────────
  function renderMockDashboard() {
    document.getElementById('stats-row').innerHTML = `
      ${statCard('Total Users', 1842, 'si-blue', 'sg-blue', userIcon(), '+12%', true)}
      ${statCard('Active Jobs', 427, 'si-green', 'sg-green', jobIcon(), '+8%', true)}
      ${statCard('Applications', 9310, 'si-purple', 'sg-purple', appIcon(), '+24%', true)}
      ${statCard('Employers', 214, 'si-gold', 'sg-gold', empIcon(), '+5%', true)}
    `;
    renderChart();
    document.getElementById('activity-list').innerHTML = `
      <div class="activity-item"><div class="activity-dot ad-blue"></div><div><div class="activity-text"><strong>Sarah Chen</strong> registered as candidate</div><div class="activity-time">2 mins ago</div></div></div>
      <div class="activity-item"><div class="activity-dot ad-green"></div><div><div class="activity-text"><strong>TechCorp</strong> posted <strong>Senior React Developer</strong></div><div class="activity-time">14 mins ago</div></div></div>
      <div class="activity-item"><div class="activity-dot ad-gold"></div><div><div class="activity-text"><strong>James Liu</strong> applied to <strong>Product Manager</strong></div><div class="activity-time">1 hour ago</div></div></div>
      <div class="activity-item"><div class="activity-dot ad-purple"></div><div><div class="activity-text"><strong>StartupXYZ</strong> registered as employer</div><div class="activity-time">3 hours ago</div></div></div>
    `;
    document.getElementById('recent-users-table').innerHTML = '<div class="empty" style="color:var(--text-3);font-size:13px">Connect backend to see live data</div>';
    document.getElementById('recent-jobs-table').innerHTML  = '<div class="empty" style="color:var(--text-3);font-size:13px">Connect backend to see live data</div>';
    document.getElementById('nav-users').textContent = '1842';
    document.getElementById('nav-jobs').textContent  = '427';
  }

  // ── Icons ─────────────────────────────────────────────
  function userIcon() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`; }
  function jobIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`; }
  function appIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`; }
  function empIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`; }

  // ── Toast ─────────────────────────────────────────────
  function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ── Init ──────────────────────────────────────────────
  loadDashboard();
</script>
</body>
</html>
