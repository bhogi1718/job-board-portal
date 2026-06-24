const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const adminOnly = [protect, authorize('admin')];

router.get('/stats', adminOnly, async (req, res) => {
  const [totalUsers, totalJobs, totalApplications, recentJobs, recentUsers] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Job.find().sort('-createdAt').limit(5).populate('employer', 'name companyName'),
    User.find().sort('-createdAt').limit(5).select('-password'),
  ]);
  const candidates = await User.countDocuments({ role: 'candidate' });
  const employers  = await User.countDocuments({ role: 'employer' });
  const activeJobs = await Job.countDocuments({ status: 'active' });
  res.json({ success: true, data: { totalUsers, candidates, employers, totalJobs, activeJobs, totalApplications, recentJobs, recentUsers } });
});

router.get('/users', adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json({ success: true, data: users });
});

router.patch('/users/:id/toggle', adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

router.get('/jobs', adminOnly, async (req, res) => {
  const jobs = await Job.find().populate('employer', 'name companyName').sort('-createdAt');
  res.json({ success: true, data: jobs });
});

router.patch('/jobs/:id/feature', adminOnly, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  job.featured = !job.featured;
  await job.save();
  res.json({ success: true, data: job });
});

router.delete('/jobs/:id', adminOnly, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Job removed' });
});

module.exports = router;