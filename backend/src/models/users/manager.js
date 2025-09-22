const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const managerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'manager'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;