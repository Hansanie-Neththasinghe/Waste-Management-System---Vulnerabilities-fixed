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
        required: function() {
            return !this.googleId; // Username required only if not Google OAuth user
        },
        unique: true,
        sparse: true, // Allows multiple null values for Google OAuth users
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
        unique: true, // Email should be unique for both regular and OAuth users
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not Google OAuth user
        },
    },
    // Google OAuth fields
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values for non-OAuth users
    },
    profilePicture: {
        type: String, // URL to Google profile picture
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    address: {
        type: String,
        required: function() {
            return this.authProvider === 'local'; // Address required only for local registration
        },
    },
    contactNumber: {
        type: String,
        required: function() {
            return this.authProvider === 'local'; // Contact required only for local registration
        },
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
