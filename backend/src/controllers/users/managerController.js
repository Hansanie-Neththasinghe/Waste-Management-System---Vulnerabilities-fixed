const Manager = require('../../models/users/manager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a random username
const generateRandomUsername = () => {
    return 'MAN' + crypto.randomInt(100, 999);
};
// Create a new manager
exports.createManager = async (req, res) => {
    try {
        // Additional security check - verify requester is an authenticated manager
        if (!req.user || req.user.role !== 'manager') {
            return res.status(403).json({ 
                message: 'Access denied. Only managers can create new managers.' 
            });
        }

        const { firstName, lastName, email, phoneNumber, password } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            return res.status(400).json({ 
                message: 'All fields are required: firstName, lastName, email, phoneNumber, password' 
            });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email address' 
            });
        }

        // Check if manager already exists
        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(409).json({ 
                message: 'Manager with this email already exists' 
            });
        }

        // Generate a random username
        const username = generateRandomUsername();

        // Hash password before saving
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new manager entry
        const manager = await Manager.create({
            firstName,
            lastName,
            email,
            username,
            phoneNumber,
            password: hashedPassword
        });

        // Don't send password in response
        const { password: _, ...managerData } = manager.toObject();

        res.status(201).json({ 
            status: 'success',
            data: managerData,
            message: 'Manager created successfully',
            createdBy: req.user.username // Log who created this manager
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
};

// Initialize first manager - only works when no managers exist in the system
exports.initializeFirstManager = async (req, res) => {
    try {
        // Check if any managers already exist
        const managerCount = await Manager.countDocuments();
        if (managerCount > 0) {
            return res.status(403).json({ 
                message: 'System already initialized. Manager creation requires authentication.' 
            });
        }

        const { firstName, lastName, email, phoneNumber, password } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            return res.status(400).json({ 
                message: 'All fields are required: firstName, lastName, email, phoneNumber, password' 
            });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long' 
            });
        }

        // Generate a random username
        const username = generateRandomUsername();

        // Hash password before saving
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the first manager
        const manager = await Manager.create({
            firstName,
            lastName,
            email,
            username,
            phoneNumber,
            password: hashedPassword
        });

        // Don't send password in response
        const { password: _, ...managerData } = manager.toObject();

        res.status(201).json({ 
            status: 'success',
            data: managerData,
            message: 'First manager initialized successfully. System is now secured.'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: 'Manager with this email already exists' 
            });
        }
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
};

// Get all managers
exports.getAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one manager by ID
exports.getManagerById = async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json(manager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a manager by ID
exports.deleteManagerById = async (req, res) => {
    try {
        const manager = await Manager.findByIdAndDelete(req.params.id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json({ message: 'Manager deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a manager by ID
exports.updateManagerById = async (req, res) => {
    try {
        const updatedManager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json(updatedManager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Manager login
exports.loginManager = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        const manager = await Manager.findOne({ username });
        if (!manager) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Properly compare password using bcrypt
        const isMatch = await bcrypt.compare(password, manager.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: manager._id, 
                username: manager.username,
                role: 'manager'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Don't send password in response
        const { password: _, ...managerData } = manager.toObject();
        
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            manager: managerData 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
