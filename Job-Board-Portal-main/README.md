# JobBoard Portal

A full-stack job board application with role-based auth, resume uploads, email notifications, and an admin panel.

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Backend  | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Frontend | React 18 + React Router v6 |
| Auth     | JWT (JSON Web Tokens) |
| Files    | Multer (resume uploads) |
| Email    | Nodemailer |
| Admin    | JSP (standalone HTML/JS panel) |

---

## Project Structure

```
jobboard/
├── backend/
│   ├── server.js                  # Entry point
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── email.js               # Nodemailer config & templates
│   ├── models/
│   │   ├── User.js                # User schema (candidate/employer/admin)
│   │   ├── Job.js                 # Job listing schema
│   │   └── Application.js         # Application schema
│   ├── routes/
│   │   ├── auth.js                # /api/auth
│   │   ├── jobs.js                # /api/jobs
│   │   ├── applications.js        # /api/applications
│   │   ├── users.js               # /api/users
│   │   └── admin.js               # /api/admin
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + authorize
│   │   └── upload.js              # Multer resume upload
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── App.js                 # Routes + providers
│       ├── index.css              # Global design system
│       ├── context/
│       │   └── AuthContext.js     # Auth state + login/logout
│       ├── utils/
│       │   └── api.js             # Axios instance + interceptors
│       ├── components/shared/
│       │   ├── Navbar.js / .css
│       │   ├── Footer.js / .css
│       │   └── JobCard.js / .css
│       └── pages/
│           ├── Home.js / .css         # Landing page with hero + search
│           ├── Jobs.js / .css         # Browse + filter listings
│           ├── JobDetail.js / .css    # Full job view + apply modal
│           ├── Login.js               # Login page
│           ├── Register.js            # Register (candidate/employer)
│           ├── Auth.css               # Shared auth styles
│           ├── EmployerDashboard.js   # Manage listings + review apps
│           ├── CandidateDashboard.js  # Track applications
│           ├── Dashboard.css          # Shared dashboard styles
│           ├── PostJob.js / .css      # 3-step job post wizard
│           ├── EditJob.js             # Edit existing listing
│           └── Profile.js / .css     # Edit profile + resume upload
│
└── admin/
    └── index.jsp                  # Admin panel (JSP + JS fetch)
```

---

## Quick Start

### 1. MongoDB
Make sure MongoDB is running locally:
```bash
mongod --dbpath /data/db
```
Or use MongoDB Atlas (update `MONGO_URI` in `.env`).

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials
npm install
npm run dev
# → Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# → Runs on http://localhost:3000
```

### 4. Admin Panel
Open `admin/index.jsp` in a browser, or serve it via Tomcat/any JSP container.
- It reads the JWT token from `localStorage` — log in to the frontend first.
- It communicates with the backend at `http://localhost:5000/api`.

---

## API Endpoints

### Auth
| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /api/auth/register  | Register user        | No   |
| POST   | /api/auth/login     | Login                | No   |
| GET    | /api/auth/me        | Get current user     | Yes  |
| PUT    | /api/auth/profile   | Update profile + resume | Yes |

### Jobs
| Method | Endpoint                      | Description          | Role |
|--------|-------------------------------|----------------------|------|
| GET    | /api/jobs                     | List/search jobs     | No   |
| GET    | /api/jobs/:id                 | Get single job       | No   |
| POST   | /api/jobs                     | Create job           | Employer |
| PUT    | /api/jobs/:id                 | Update job           | Employer |
| DELETE | /api/jobs/:id                 | Delete job           | Employer |
| PATCH  | /api/jobs/:id/status          | Toggle status        | Employer |
| GET    | /api/jobs/employer/my-listings | My jobs             | Employer |

### Applications
| Method | Endpoint                       | Description            | Role |
|--------|--------------------------------|------------------------|------|
| POST   | /api/applications              | Apply to job           | Candidate |
| GET    | /api/applications/my           | My applications        | Candidate |
| DELETE | /api/applications/:id          | Withdraw               | Candidate |
| GET    | /api/applications/job/:jobId   | Job's applications     | Employer |
| PATCH  | /api/applications/:id/status   | Update status          | Employer |

### Admin
| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| GET    | /api/admin/stats              | Dashboard stats     |
| GET    | /api/admin/users              | All users           |
| PATCH  | /api/admin/users/:id/toggle   | Toggle user active  |
| GET    | /api/admin/jobs               | All jobs            |
| PATCH  | /api/admin/jobs/:id/feature   | Feature a job       |
| DELETE | /api/admin/jobs/:id           | Delete a job        |

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:3000
```

---

## Features

### Candidates
- Register / login
- Browse and filter jobs (category, type, level, salary, remote)
- Full-text job search
- Apply with cover letter + resume upload
- Track application status (pending → reviewing → interview → offered)
- Email notifications on apply & status change
- Profile management with resume upload

### Employers
- Post jobs with 3-step wizard
- Manage listings (activate/pause/close)
- View all applications per job
- Update application status
- View candidate profiles + resumes
- Email notifications on new applications

### Admin Panel (JSP)
- Dashboard with stats (users, jobs, applications)
- Applications-per-day chart
- Recent activity feed
- User management (activate/deactivate)
- Job management (feature/delete)
- Analytics overview

---

## Seed Data (Optional)

Create an admin user directly in MongoDB:
```js
db.users.insertOne({
  name: "Admin",
  email: "admin@jobboard.com",
  password: "<bcrypt hash of your password>",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```
