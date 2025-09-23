const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Middleware to check validation results
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Sanitize and validate object ID
const validateObjectId = (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};

// Common validation rules
const commonValidations = {
    // User validation rules
    username: body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username must be between 3-30 characters and can only contain letters, numbers, underscores, and hyphens'),
    
    password: body('password')
        .isLength({ min: 8, max: 50 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be 8-50 characters and include uppercase, lowercase, number, and special character'),
    
    email: body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2-50 characters'),
    
    contactNumber: body('contactNumber')
        .trim()
        .matches(/^[0-9+\-\s()]+$/)
        .isLength({ min: 10, max: 15 })
        .withMessage('Must be a valid phone number'),
    
    address: body('address')
        .trim()
        .isLength({ min: 5, max: 200 })
        .escape()
        .withMessage('Address must be between 5-200 characters'),

    // ID parameter validation
    id: param('id')
        .custom(validateObjectId)
        .withMessage('Invalid ID format'),
    
    // Pagination validation
    page: query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    limit: query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
};

// Validation chains for different routes
const validations = {
    // Resident validation
    createResident: [
        commonValidations.username,
        commonValidations.password,
        commonValidations.email,
        commonValidations.name,
        commonValidations.contactNumber,
        commonValidations.address,
        validateRequest
    ],

    updateResident: [
        commonValidations.id,
        body('username').optional().trim().isLength({ min: 3, max: 30 }),
        body('email').optional().trim().isEmail().normalizeEmail(),
        body('name').optional().trim().isLength({ min: 2, max: 50 }),
        body('contactNumber').optional().trim().matches(/^[0-9+\-\s()]+$/),
        body('address').optional().trim().isLength({ min: 5, max: 200 }).escape(),
        validateRequest
    ],

    loginValidation: [
        body('username').trim().notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest
    ],

    // ID validation for routes that use ID parameters
    validateId: [
        commonValidations.id,
        validateRequest
    ],

    // Pagination validation
    validatePagination: [
        commonValidations.page,
        commonValidations.limit,
        validateRequest
    ]
};

module.exports = validations;