const express = require('express');
const empController = require('../../controllers/users/employeeController');
const { authenticateToken, authorizeRoles, authorizeOwnResource } = require('../../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', empController.loginEmployee); // Login

// Protected routes
// Only managers can create, get all, and delete employees
router.post('/create', authenticateToken, authorizeRoles('manager'), empController.addEmployee);
router.get('/', authenticateToken, authorizeRoles('manager'), empController.getAllEmployees);
router.delete('/:id', authenticateToken, authorizeRoles('manager'), empController.deleteEmployee);

// Employees can access their own data, managers can access all
router.get('/:id', authenticateToken, authorizeOwnResource, empController.getEmployeeById);
router.put('/:id', authenticateToken, authorizeOwnResource, empController.updateEmployee);
router.get('/username/:username', authenticateToken, authorizeOwnResource, empController.getEmployeeByUsername);

module.exports = router;
