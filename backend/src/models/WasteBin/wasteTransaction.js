const mongoose = require('mongoose');

const WasteTransactionSchema = new mongoose.Schema({
    binId: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteBin', required: true },  // Reference to waste bin
    binOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },  // Reference to resident
    binType: { type: String, required: true },  // Type of waste bin
    currentWeight: { type: Number, required: true },  // Amount of waste added
    timestamp: { type: Date, default: () => new Date() },  // Time of disposal
    //collected: { type: Boolean, default: false },  // If the waste was collected
});

module.exports = mongoose.model('WasteTransaction', WasteTransactionSchema);
