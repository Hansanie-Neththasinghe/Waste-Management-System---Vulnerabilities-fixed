const express = require('express');
const wastebinTransactionController = require('../../controllers/wasteBin/wasteBinTrasnactionController');

const router = express.Router();

// Route to get all wastebin transactions
router.get('/', wastebinTransactionController.getAllTransactions);

// Route to get a specific wastebin transaction by ID
router.get('/:id', wastebinTransactionController.getTransactionById);

// Route to create a new wastebin transaction
router.post('/', wastebinTransactionController.createTransaction);

// Route to update a specific wastebin transaction by ID
router.put('/:id', wastebinTransactionController.updateTransaction);

// Route to delete a specific wastebin transaction by ID
router.delete('/:id', wastebinTransactionController.deleteTransaction);

module.exports = router;