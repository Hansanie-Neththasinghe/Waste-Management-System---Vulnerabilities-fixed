const mongoose = require('mongoose');

const wasteBinSchema = new mongoose.Schema({
    binID: {type: String, required: true, unique: true},
    binType: {type: String, required: true},
    currentWeight: {type: Number, default: 0},
    maxWeight: {type: Number},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'resident'},
    lastCollectedAt: {type: Date, default: null},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('WasteBin', wasteBinSchema);