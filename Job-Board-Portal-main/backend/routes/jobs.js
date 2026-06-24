const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getJobs, getJob, createJob, updateJob, deleteJob,
  getMyJobs, toggleJobStatus
} = require('../controllers/jobController');

router.get('/employer/my-listings', protect, authorize('employer'), getMyJobs);

router.get('/',     getJobs);
router.get('/:id',  getJob);
router.post('/',    protect, authorize('employer', 'admin'), createJob);
router.put('/:id',  protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.patch('/:id/status', protect, authorize('employer', 'admin'), toggleJobStatus);

module.exports = router;