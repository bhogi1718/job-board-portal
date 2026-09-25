const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employer:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String },
  resumeUrl:   { type: String },
  resumeName:  { type: String },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  employerNotes: { type: String },
  interviewDate: { type: Date },
  interviewLink: { type: String },
  appliedAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
});

ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
ApplicationSchema.index({ candidate: 1, status: 1 });
ApplicationSchema.index({ employer: 1, status: 1 });

ApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);