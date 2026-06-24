const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/employers', protect, async (req, res) => {
  const User = require('../models/User');
  const employers = await User.find({ role: 'employer', isActive: true })
    .select('name companyName companyLogo industry location');
  res.json({ success: true, data: employers });
});

module.exports = router;