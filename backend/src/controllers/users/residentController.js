const Resident = require('../../models/users/resident');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all residents
exports.getAllResidents = async (req, res) => {
    try {
        const residents = await Resident.find().populate('wastebins'); 
        //const residents = await Resident.find();
        res.status(200).json(residents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single resident by ID
exports.getResidentById = async (req, res) => {
    try {
        const{username} = req.params;
        const resident = await Resident.findOne({username});
        if (!resident) return res.status(404).json({ message: 'Resident not found' });
        res.status(200).json(resident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new resident
exports.createResident = async (req, res) => {
    const resident = new Resident(req.body);
    try {
        const newResident = await resident.save();
        res.status(201).json(newResident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a resident by ID
exports.updateResident = async (req, res) => {
    try {
        const updatedResident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedResident) return res.status(404).json({ message: 'Resident not found' });
        res.status(200).json(updatedResident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a resident by ID
exports.deleteResident = async (req, res) => {
    try {
        const deletedResident = await Resident.findByIdAndDelete(req.params.id);
        if (!deletedResident) return res.status(404).json({ message: 'Resident not found' });
        res.status(200).json({ message: 'Resident deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login resident
exports.loginResident = async (req, res) => {
    try {
        const { username, password } = req.body;
        const resident = await Resident.findOne({ username });
        if (!resident) return res.status(404).json({ message: 'Resident not found' });

        const isMatch = await Resident.findOne({password});
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.status(200).json({ message: 'Login successful', resident });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the total number of residents
exports.getResidentCount = async (req, res) => {
    try {
        // Get the count of resident documents in the database
        const count = await Resident.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        // Handle any errors
        res.status(500).json({
            status: 'error',
            message: 'Error fetching resident count',
            error: error.message,
        });
    }
};

//Get resident by object id
exports.getResidentByObjectId = async (req, res) => {
    try {
        const resident = await Resident.findById(req.params.id);
        if (!resident) return res.status(404).json({ message: 'Resident not found' });
        res.status(200).json(resident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};