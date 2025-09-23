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
    try {
        const { username, name, email, password, address, contactNumber } = req.body;
        
        // Check if resident already exists
        const existingResident = await Resident.findOne({
            $or: [
                { username: { $regex: new RegExp('^' + username + '$', 'i') } },
                { email: { $regex: new RegExp('^' + email + '$', 'i') } }
            ]
        });
        
        if (existingResident) {
            return res.status(409).json({ 
                message: 'Resident with this username or email already exists' 
            });
        }

        // Hash password before saving
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const resident = new Resident({
            username,
            name,
            email,
            password: hashedPassword,
            address,
            contactNumber
        });

        const newResident = await resident.save();
        
        // Don't send password in response
        const { password: _, ...residentData } = newResident.toObject();
        
        res.status(201).json(residentData);
    } catch (error) {
        console.error('Error creating resident:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

// Update a resident by ID
exports.updateResident = async (req, res) => {
    try {
        // Only allow specific fields to be updated
        const allowedUpdates = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            contactNumber: req.body.contactNumber
        };

        // Remove undefined fields
        Object.keys(allowedUpdates).forEach(key => 
            allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        // If email is being updated, check if it's already in use
        if (allowedUpdates.email) {
            const existingResident = await Resident.findOne({
                email: { $regex: new RegExp('^' + allowedUpdates.email + '$', 'i') },
                _id: { $ne: req.params.id }
            });

            if (existingResident) {
                return res.status(409).json({
                    message: 'Email already in use'
                });
            }
        }

        const updatedResident = await Resident.findByIdAndUpdate(
            req.params.id,
            { $set: allowedUpdates },
            { 
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!updatedResident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        // Don't send password in response
        const { password, ...residentData } = updatedResident.toObject();
        res.status(200).json(residentData);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Internal server error' });
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
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        const resident = await Resident.findOne({ username });
        if (!resident) return res.status(401).json({ message: 'Invalid credentials' });

        // Properly compare password using bcrypt
        const isMatch = await bcrypt.compare(password, resident.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: resident._id, 
                username: resident.username,
                role: 'resident'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Don't send password in response
        const { password: _, ...residentData } = resident.toObject();
        
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            resident: residentData 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
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