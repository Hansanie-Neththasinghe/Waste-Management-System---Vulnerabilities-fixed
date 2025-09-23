const express = require('express');
const wastebinTransactionController = require('../../controllers/wasteBin/wasteBinTrasnactionController');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

const router = express.Router();

// All transaction routes require authentication
// Get all transactions - managers and employees can access all, residents can access their own
router.get('/', authenticateToken, wastebinTransactionController.getAllTransactions);

// Get specific transaction - all authenticated users can access based on their role
router.get('/:id', authenticateToken, wastebinTransactionController.getTransactionById);

// Create transaction - all authenticated users can create
router.post('/', authenticateToken, wastebinTransactionController.createTransaction);

// Update transaction - only managers can update
router.put('/:id', authenticateToken, authorizeRoles('manager'), wastebinTransactionController.updateTransaction);

// Delete transaction - only managers can delete
router.delete('/:id', authenticateToken, authorizeRoles('manager'), wastebinTransactionController.deleteTransaction);

module.exports = router;