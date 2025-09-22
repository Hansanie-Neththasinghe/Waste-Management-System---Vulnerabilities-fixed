const express = require('express');
const residentController = require('../../controllers/users/residentController');

const router = express.Router();

// Get all residents
router.get('/count', residentController.getResidentCount);
router.get('/', residentController.getAllResidents);

// Get a single resident by ID
//router.get('/:id', residentController.getResidentByObjectId);

// Get a single resident by ID
router.get('/:username', residentController.getResidentById);



// Create a new resident
router.post('/', residentController.createResident);

// Update a resident by ID
router.put('/:id', residentController.updateResident);

// Delete a resident by ID
router.delete('/:id', residentController.deleteResident);

// Login resident
router.post('/login', residentController.loginResident);

// Get total number of residents



module.exports = router;