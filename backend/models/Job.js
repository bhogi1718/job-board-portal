const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements:{ type: String },
  responsibilities: { type: String },
  employer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  location:    { type: String, required: true },
  isRemote:    { type: Boolean, default: false },
  jobType:     { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], required: true },
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'executive'], required: true },
  category:    { type: String, required: true },
  tags:        [{ type: String }],
  skills:      [{ type: String }],
  salaryMin:   { type: Number },
  salaryMax:   { type: Number },
  salaryCurrency: { type: String, default: 'USD' },
  salaryPeriod:   { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
  applicationDeadline: { type: Date },
  applicationCount:    { type: Number, default: 0 },
  views:               { type: Number, default: 0 },
  status:   { type: String, enum: ['active', 'paused', 'closed', 'draft'], default: 'active' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

JobSchema.index({ title: 'text', description: 'text', tags: 'text', skills: 'text', companyName: 'text' });
JobSchema.index({ category: 1, location: 1, jobType: 1, experienceLevel: 1, status: 1 });

JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', JobSchema);