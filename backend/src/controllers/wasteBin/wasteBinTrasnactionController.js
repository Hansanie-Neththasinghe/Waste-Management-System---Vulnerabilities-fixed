const WasteBinTransaction = require('../../models/WasteBin/wasteTransaction');

// Get all waste bin transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await WasteBinTransaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single waste bin transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await WasteBinTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new waste bin transaction
exports.createTransaction = async (req, res) => {
    const transaction = new WasteBinTransaction({
        wasteBinId: req.body.wasteBinId,
        transactionType: req.body.transactionType,
        amount: req.body.amount,
        date: req.body.date
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a waste bin transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await WasteBinTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.wasteBinId = req.body.wasteBinId || transaction.wasteBinId;
        transaction.transactionType = req.body.transactionType || transaction.transactionType;
        transaction.amount = req.body.amount || transaction.amount;
        transaction.date = req.body.date || transaction.date;

        const updatedTransaction = await transaction.save();
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a waste bin transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await WasteBinTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.remove();
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};