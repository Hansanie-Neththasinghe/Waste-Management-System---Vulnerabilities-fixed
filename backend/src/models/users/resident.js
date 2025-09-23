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
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
        validate: {
            validator: function(v) {
                return !v.includes('admin') && !v.includes('root'); // Prevent reserved usernames
            },
            message: 'This username is not allowed'
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email should be unique for both regular and OAuth users
        trim: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email address'
        ],
        validate: {
            validator: function(v) {
                // Additional email validation if needed
                return v.length <= 254; // Maximum email length
            },
            message: 'Email is too long'
        }
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
        trim: true,
        minlength: [5, 'Address must be at least 5 characters long'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    contactNumber: {
        type: String,
        required: function() {
            return this.authProvider === 'local'; // Contact required only for local registration
        },
        trim: true,
        match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'],
        minlength: [10, 'Phone number must be at least 10 digits'],
        maxlength: [15, 'Phone number cannot exceed 15 digits'],
        validate: {
            validator: function(v) {
                // Remove all non-digit characters and check length
                const digits = v.replace(/\D/g, '');
                return digits.length >= 10 && digits.length <= 15;
            },
            message: 'Please enter a valid phone number'
        }
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
