const WasteBin = require('../../models/WasteBin/WasteBin');
const wasteTransaction = require('../../models/WasteBin/wasteTransaction');
const Resident = require('../../models/users/resident');

// Helper function to generate unique bin ID (BIN + 4 digit random number)
const generateBinID = () => {
    return 'BIN' + Math.floor(1000 + Math.random() * 9000);
};

// Add a new waste bin
exports.createWasteBin = async (req, res) => {
    try {
        const { binType, maxWeight } = req.body;

        // Generate a unique bin ID
        const uniqueBinID = generateBinID();

        // Create a new waste bin entry
        const wasteBin = await WasteBin.create({
            binID: uniqueBinID,
            binType,
            maxWeight
        });
        res.status(201).json({ 
            status: 'success',
            data: wasteBin,
            message: 'Waste bin created successfully'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error creating waste bin', error: err });
        console.log(err);
    }
};

// Get all waste bins
exports.getAllWasteBins = async (req, res) => {
    try {
        // Find all waste bins
        const wasteBins = await WasteBin.find();
        res.status(200).json({ wasteBins });
    } catch (err) {

        res.status(500).json({ message: 'Error getting waste bins', error: err });
    }
};

// Get a waste bin by its unique bin ID
exports.getWasteBinById = async (req, res) => {
    try {
        const { binID } = req.params;

        // Find the waste bin by its unique bin ID
        const wasteBin = await WasteBin.findOne({ binID });

        if (!wasteBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ wasteBin });
    } catch (err) {
        res.status(500).json({ message: 'Error getting waste bin', error: err });
    }
};

// Delete a waste bin by its unique bin ID
exports.deleteWasteBin = async (req, res) => {
    try {
        const { binID } = req.params;

        // Find the waste bin by its unique bin ID and delete it
        const deletedBin = await WasteBin.findOneAndDelete({ binID });

        if (!deletedBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ message: 'Waste bin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting waste bin', error: err });
    }
};

// Update the max capacity of a bin by its unique ID
exports.updateBinMaxCapacity = async (req, res) => {
    try {
        const { binId } = req.params; // Get binId from the request parameters
        const { maxWeight } = req.body; // New maxWeight to be set

        // Find the bin by its unique ID and update the max weight
        const updatedBin = await WasteBin.findOneAndUpdate(
            { binId },
            { maxWeight },
            { new: true } // Return the updated bin
        );

        if (!updatedBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ message: 'Max capacity updated successfully', bin: updatedBin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating max capacity', error });
    }
};

exports.getWasteBinCount = async (req, res) => {
    try {
        // Count the total number of waste bins
        
        const totalWasteBins = await WasteBin.countDocuments();
        res.status(200).json({ totalWasteBins });
    } catch (err) {
        res.status(500).json({ message: 'Error counting waste bins', error: err });
    }
};

// Assign a wastebin to a resident
exports.assignWasteBinToResident = async (req, res) => {
    try {
        console.log("assign wastebin is running")
      const { residentId, binID } = req.body;
      
  
      // Find the waste bin by its bin ID
      const wasteBin = await WasteBin.findOne({ binID });
      if (!wasteBin) return res.status(404).json({ message: 'Waste bin not found' });
  
      // Check if the waste bin already has an owner
      if (wasteBin.owner) return res.status(400).json({ message: 'This bin is already assigned to another resident' });
  
      // Find the resident by their ID
      const resident = await Resident.findById(residentId);
      if (!resident) return res.status(404).json({ message: 'Resident not found' });
  
      // Assign the bin to the resident and update the wastebin's owner
      wasteBin.owner = resident._id;
      await wasteBin.save();
  
      // Add the bin to the resident's wastebins array
      resident.wastebins.push(wasteBin._id);
      await resident.save();
  
      res.status(200).json({ message: 'Waste bin successfully assigned to resident', wasteBin, resident });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning waste bin', error });
    }
  };


// Get all waste bins owned by a resident
exports.getWasteBinsByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    // Find all waste bins where the owner is the given resident ID
    const wasteBins = await WasteBin.find({ owner: residentId });

    if (!wasteBins || wasteBins.length === 0) {
      return res.status(404).json({ message: 'No waste bins found for this resident' });
    }

    res.status(200).json({ wasteBins });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching waste bins', error: err });
  }
};

// Search for available waste bins (those without an owner)
exports.searchAvailableWasteBins = async (req, res) => {
    try {
        const { query } = req.query; // Get search query
        const availableWasteBins = await WasteBin.find({
            owner: null, // Only bins with no owner
            binID: { $regex: query, $options: 'i' } // Match binID based on search query, case-insensitive
        });
        res.status(200).json({ availableWasteBins });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available waste bins', error });
    }
};

exports.updateBinWeight = async (req, res) => {
    try {
        const { binID } = req.params;  // Get the binID from the request parameters
        const { newWeight } = req.body;  // Get the binID and newWeight from the request

        // Find the waste bin by its unique bin ID
        const wasteBin = await WasteBin.findOne({ binID });
        if (!wasteBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        // Record the transaction in the WasteTransaction model
       await wasteTransaction.create({
            binId: wasteBin._id,
            binOwner: wasteBin.owner,
            binType: wasteBin.binType,
            currentWeight: newWeight,  // Store the new weight
        });

        // Save the updated weight in the waste bin
        wasteBin.currentWeight = newWeight;
        await wasteBin.save();

        res.status(200).json({
            message: 'Waste bin weight updated and transaction recorded successfully',
            wasteTransaction,
        });
    } catch (err) {
        console.error("Error updating waste bin weight", err);
        res.status(500).json({ message: 'Error updating waste bin weight', error: err });
    }
};