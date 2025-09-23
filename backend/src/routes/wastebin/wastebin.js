const express = require('express');
const {
    getAllWasteBins,
    getWasteBinById,
    createWasteBin,
    updateBinMaxCapacity,
    deleteWasteBin,
    getWasteBinCount,
    assignWasteBinToResident,
    getWasteBinsByResident,
    searchAvailableWasteBins,
    updateBinWeight
} = require('../../controllers/wasteBin/wasteBinController');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

const wasteBinRouter = express.Router();

// All waste bin routes require authentication
// Get waste bin count - managers and employees can access
wasteBinRouter.get('/count', authenticateToken, authorizeRoles('manager', 'employee'), getWasteBinCount);

// Search available waste bins - all authenticated users can access
wasteBinRouter.get('/search', authenticateToken, searchAvailableWasteBins);

// Get waste bins by resident - residents can view their own, managers can view all
wasteBinRouter.get('/resident/:residentId', authenticateToken, getWasteBinsByResident);

// Get all waste bins - managers and employees can access
wasteBinRouter.get('/', authenticateToken, authorizeRoles('manager', 'employee'), getAllWasteBins);

// Get specific waste bin - all authenticated users can access
wasteBinRouter.get('/:binID', authenticateToken, getWasteBinById);

// Create waste bin - only managers can create
wasteBinRouter.post('/', authenticateToken, authorizeRoles('manager'), createWasteBin);

// Assign waste bin to resident - managers and residents can assign
wasteBinRouter.post('/assignOwner', authenticateToken, authorizeRoles('manager', 'resident'), (req,res,next)=>{
    console.log("route hit");
    next();
}, assignWasteBinToResident);

// Update bin weight - employees and managers can update
wasteBinRouter.put('/weight/:binID', authenticateToken, authorizeRoles('manager', 'employee'), (req,res,next)=>{
    console.log("route hit");
    next();
}, updateBinWeight);

// Delete waste bin - only managers can delete
wasteBinRouter.delete('/:binID', authenticateToken, authorizeRoles('manager'), deleteWasteBin);

module.exports = wasteBinRouter;