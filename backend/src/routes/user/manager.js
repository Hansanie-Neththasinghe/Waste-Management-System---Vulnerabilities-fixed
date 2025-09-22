const express = require('express');
const router = express.Router();
const managerController = require('../../controllers/users/managerController'); // Adjust the path as necessary

router.post('/create', managerController.createManager);

// Route to get all managers
router.get('/', managerController.getAllManagers);

// Route to get a manager by ID
router.get('/:id', managerController.getManagerById);

// Route to update a manager by ID
router.put('/:id', managerController.updateManagerById);

// Route to delete a manager by ID
router.delete('/:id', managerController.deleteManagerById);

// Route for manager login
router.post('/login', managerController.loginManager);

module.exports = router;