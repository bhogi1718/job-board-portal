const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendEmail } = require('../config/email');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate('employer');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'active') return res.status(400).json({ success: false, message: 'Job is not accepting applications' });
    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });
    const resumeUrl  = req.file ? `/uploads/resumes/${req.file.filename}` : req.user.resumeUrl;
    const resumeName = req.file ? req.file.originalname : req.user.resumeName;
    const application = await Application.create({
      job: jobId, candidate: req.user.id, employer: job.employer._id,
      coverLetter, resumeUrl, resumeName,
    });
    job.applicationCount += 1;
    await job.save();
    sendEmail(req.user.email, 'applicationReceived', req.user.name, job.title, job.companyName);
    sendEmail(job.employer.email, 'newApplication', job.employer.name, req.user.name, job.title);
    const populated = await application.populate([
      { path: 'job', select: 'title companyName location jobType' },
      { path: 'candidate', select: 'name email' },
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already applied to this job' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user.id })
      .populate('job', 'title companyName location jobType status companyLogo')
      .sort('-appliedAt');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const apps = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills bio location resumeUrl resumeName')
      .sort('-appliedAt');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate('candidate', 'name email').populate('job', 'title');
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (app.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    app.status = req.body.status;
    if (req.body.employerNotes) app.employerNotes = req.body.employerNotes;
    if (req.body.interviewDate)  app.interviewDate = req.body.interviewDate;
    if (req.body.interviewLink)  app.interviewLink = req.body.interviewLink;
    await app.save();
    sendEmail(app.candidate.email, 'statusUpdate', app.candidate.name, app.job.title, app.status);
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (app.candidate.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await app.deleteOne();
    await Job.findByIdAndUpdate(app.job, { $inc: { applicationCount: -1 } });
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};