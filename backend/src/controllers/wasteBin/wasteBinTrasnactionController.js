const WasteBinTransaction = require('../../models/WasteBin/wasteTransaction');
const mongoose = require('mongoose');

// Get all waste bin transactions
exports.getAllTransactions = async (req, res) => {
    try {
        console.log('🔍 Transaction request - User role:', req.user?.role);
        console.log('🔍 Transaction request - User ID:', req.user?.id);
        
        let transactions;
        
        // If user exists and is a resident, only return their own transactions
        if (req.user?.role === 'resident') {
            console.log('🔍 Filtering transactions for resident:', req.user.id);
            // When testing, req.user.id may be a string that's not a valid ObjectId
            try {
                const userId = new mongoose.Types.ObjectId(req.user.id);
                transactions = await WasteBinTransaction.find({ binOwner: userId });
            } catch (err) {
                console.log('❌ Invalid ObjectId for resident:', err.message);
                // Return empty array for invalid IDs
                transactions = [];
            }
        } else {
            // Not authenticated or managers/employees can see all transactions
            console.log('🔍 Returning all transactions');
            transactions = await WasteBinTransaction.find();
        }
        
        console.log('🔍 Found transactions:', transactions.length);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('❌ Transaction controller error:', error);
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
    try {
        const transaction = new WasteBinTransaction({
            binId: req.body.binId,
            binOwner: req.body.binOwner,
            binType: req.body.binType,
            currentWeight: req.body.currentWeight,
            timestamp: req.body.timestamp || new Date()
        });

        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
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

        transaction.binId = req.body.binId || transaction.binId;
        transaction.binOwner = req.body.binOwner || transaction.binOwner;
        transaction.binType = req.body.binType || transaction.binType;
        transaction.currentWeight = req.body.currentWeight || transaction.currentWeight;
        transaction.timestamp = req.body.timestamp || transaction.timestamp;

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