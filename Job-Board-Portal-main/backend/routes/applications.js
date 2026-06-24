const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');

router.post('/',            protect, authorize('candidate'), uploadResume, applyToJob);
router.get('/my',           protect, authorize('candidate'), getMyApplications);
router.delete('/:id',       protect, authorize('candidate'), withdrawApplication);
router.get('/job/:jobId',   protect, authorize('employer', 'admin'), getJobApplications);
router.patch('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;