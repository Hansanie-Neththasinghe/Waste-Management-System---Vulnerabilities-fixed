const jwt = require('jsonwebtoken');
const Resident = require('../models/users/resident');
const Manager = require('../models/users/manager');
const Employee = require('../models/users/employee');

// Authentication middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        return res.status(500).json({ message: 'Token verification failed.' });
    }
};

// Authorization middleware to check user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.' 
            });
        }

        next();
    };
};

// Middleware to ensure user can only access their own data
const authorizeOwnResource = async (req, res, next) => {
    try {
        const userId = req.params.id || req.params.username;
        const userRole = req.user.role;
        const tokenUserId = req.user.id;
        const tokenUsername = req.user.username;

        // Check if user is trying to access their own resource
        if (userId === tokenUserId || userId === tokenUsername) {
            return next();
        }

        // Managers can access employee and resident data
        if (userRole === 'manager') {
            return next();
        }

        return res.status(403).json({ 
            message: 'Access denied. You can only access your own data.' 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Authorization check failed.' });
    }
};

// Optional authentication - allows both authenticated and unauthenticated access
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(); // Continue without authentication
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Invalid token, but continue anyway
        req.user = null;
    }
    
    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    authorizeOwnResource,
    optionalAuth
};