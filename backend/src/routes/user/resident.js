const express = require('express');
const residentController = require('../../controllers/users/residentController');
const { authenticateToken, authorizeRoles, authorizeOwnResource } = require('../../middleware/auth');
const validations = require('../../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)
router.post('/', validations.createResident, residentController.createResident); // Registration
router.post('/login', validations.loginValidation, residentController.loginResident); // Login

// Protected routes (authentication required)
// Get all residents - only managers can access
router.get('/', 
    authenticateToken, 
    authorizeRoles('manager'),
    validations.validatePagination,
    residentController.getAllResidents
);

// Get resident count - only managers can access
router.get('/count', 
    authenticateToken, 
    authorizeRoles('manager'), 
    residentController.getResidentCount
);

// Get a single resident by username - residents can access their own data, managers can access all
router.get('/:username', 
    authenticateToken, 
    authorizeOwnResource, 
    residentController.getResidentById
);

// Update a resident by ID - residents can update their own data, managers and employees can update all
router.put('/:id', 
    authenticateToken,
    validations.validateId,
    validations.updateResident,
    authorizeRoles('manager', 'resident', 'employee'),
    residentController.updateResident
);

// Delete a resident by ID - only managers can delete
router.delete('/:id', 
    authenticateToken,
    validations.validateId,
    authorizeRoles('manager'),
    residentController.deleteResident
);

// Get total number of residents



module.exports = router;