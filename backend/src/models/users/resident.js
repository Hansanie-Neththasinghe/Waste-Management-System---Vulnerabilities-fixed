const mongoose = require('mongoose');

// Define the schema for credit card details
// const creditCardSchema = new mongoose.Schema({
//     cardNumber: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     cardHolderName: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     expiryDate: {
//         type: String,  // Format: MM/YY
//         required: true,
//     },
//     cvv: {
//         type: String,
//         required: true,
//     },
// });

// Define the main Resident schema
const residentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    wastebins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WasteBin',
    }],
    accountNumber: {
        type: String,
        //required: true,
        // unique: true,
        trim: true,
    },
    bank: {
        type: String,
        //required: true,
    },
    branch: {
        type: String,
        //required: true,
    },
    totalPoints: {
        type: Number,
        default: 0,  // Initially, total points can be 0
    },
    // creditCardDetails: {
    //     type: creditCardSchema,
    //     required: true,
    // },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Resident = mongoose.model('Resident', residentSchema);
module.exports = Resident;
