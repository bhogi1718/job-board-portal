const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const emailTemplates = {
  applicationReceived: (candidateName, jobTitle, companyName) => ({
    subject: `Application Received – ${jobTitle} at ${companyName}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:12px">
        <h2 style="color:#38bdf8">Application Submitted! 🎉</h2>
        <p>Hi <strong>${candidateName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
        <p style="color:#94a3b8;font-size:12px">JobBoard Portal</p>
      </div>`,
  }),
  statusUpdate: (candidateName, jobTitle, status) => ({
    subject: `Application Update – ${jobTitle}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:12px">
        <h2 style="color:#38bdf8">Application Status Update</h2>
        <p>Hi <strong>${candidateName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong style="color:#38bdf8">${status.toUpperCase()}</strong></p>
        <p style="color:#94a3b8;font-size:12px">JobBoard Portal</p>
      </div>`,
  }),
  newApplication: (employerName, candidateName, jobTitle) => ({
    subject: `New Application – ${jobTitle}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:12px">
        <h2 style="color:#38bdf8">New Application Received</h2>
        <p>Hi <strong>${employerName}</strong>,</p>
        <p><strong>${candidateName}</strong> has applied for your position: <strong>${jobTitle}</strong></p>
        <p style="color:#94a3b8;font-size:12px">JobBoard Portal</p>
      </div>`,
  }),
};

exports.sendEmail = async (to, templateName, ...args) => {
  try {
    const { subject, html } = emailTemplates[templateName](...args);
    await transporter.sendMail({ from: `"JobBoard" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};