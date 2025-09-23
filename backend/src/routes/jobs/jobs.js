const express = require('express');
const jobController = require('../../controllers/jobs/jobsController');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

const router = express.Router();

// All job routes require authentication
// Only managers and employees can create jobs, residents can view jobs
router.post('/create', authenticateToken, authorizeRoles('manager', 'resident'), jobController.createJob);
router.get('/', authenticateToken, jobController.getAllJobs);
router.get('/:id', authenticateToken, jobController.getJobById);

// Only managers and employees can update jobs (employees need to mark jobs as complete)
router.put('/:id', authenticateToken, authorizeRoles('manager', 'employee'), jobController.updateJobById);
router.delete('/:id', authenticateToken, authorizeRoles('manager'), jobController.deleteJobById);

module.exports = router;