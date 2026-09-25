const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['candidate', 'employer', 'admin'], default: 'candidate' },
  resumeUrl:    { type: String },
  resumeName:   { type: String },
  skills:       [{ type: String }],
  bio:          { type: String },
  location:     { type: String },
  linkedIn:     { type: String },
  portfolio:    { type: String },
  companyName:  { type: String },
  companyLogo:  { type: String },
  companyWebsite: { type: String },
  companySize:  { type: String },
  industry:     { type: String },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);