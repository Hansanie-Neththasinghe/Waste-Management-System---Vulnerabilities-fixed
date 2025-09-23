const xss = require('xss');

// Configure XSS options
const xssOptions = {
    whiteList: {}, // No tags are allowed
    stripIgnoreTag: true, // Strip tags not in whitelist
    stripIgnoreTagBody: ['script'] // Strip content inside script tags
};

const sanitizeHtml = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    return Object.keys(obj).reduce((acc, key) => {
        if (typeof obj[key] === 'string') {
            acc[key] = xss(obj[key], xssOptions).trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            acc[key] = sanitizeHtml(obj[key]);
        } else {
            acc[key] = obj[key];
        }
        return acc;
    }, Array.isArray(obj) ? [] : {});
};

const sanitizeRequest = (req, res, next) => {
    try {
        req.body = sanitizeHtml(req.body);
        req.query = sanitizeHtml(req.query);
        req.params = sanitizeHtml(req.params);
        next();
    } catch (error) {
        console.error('Sanitization error:', error);
        next(error);
    }
};

module.exports = sanitizeRequest;