const express = require('express');
const router = express.Router();
const managerController = require('../../controllers/users/managerController');
const { authenticateToken, authorizeRoles, authorizeOwnResource } = require('../../middleware/auth');

// Public routes
router.post('/login', managerController.loginManager); // Login

// System initialization route - only works when no managers exist
router.post('/initialize', managerController.initializeFirstManager); // First manager creation

// Protected routes - only managers can access manager endpoints
router.post('/create', authenticateToken, authorizeRoles('manager'), managerController.createManager);
router.get('/', authenticateToken, authorizeRoles('manager'), managerController.getAllManagers);
router.get('/:id', authenticateToken, authorizeOwnResource, managerController.getManagerById);
router.put('/:id', authenticateToken, authorizeOwnResource, managerController.updateManagerById);
router.delete('/:id', authenticateToken, authorizeRoles('manager'), managerController.deleteManagerById);

module.exports = router;