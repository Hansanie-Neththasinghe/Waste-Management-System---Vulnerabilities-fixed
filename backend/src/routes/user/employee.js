const express = require('express');
const empController = require('../../controllers/users/employeeController');

const router = express.Router();

// Route to create a new employee
router.post('/create', empController.addEmployee);

// Route to get all employees
router.get('/', empController.getAllEmployees);

// Route to get an employee by ID
router.get('/:id', empController.getEmployeeById);

// Route to update an employee by ID
router.put('/:id', empController.updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', empController.deleteEmployee);

// Route for employee login
router.post('/login', empController.loginEmployee);

// Route to get an employee by username
router.get('/:username', empController.getEmployeeByUsername);

module.exports = router;
