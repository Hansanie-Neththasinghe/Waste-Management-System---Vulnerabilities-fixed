const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    resident: {type: String, required: true},
    residentID: {type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true},
    date: {type: Date, required: true},
    // employee can be null if the job is not assigned to anyone
    employee: {type: mongoose.Schema.Types.ObjectId, ref: 'employee', required: false},
    status: { type: String, required: true, enum: ['Incomplete', 'Complete'], default: 'Incomplete' }
});

module.exports = mongoose.model('Job', jobSchema);