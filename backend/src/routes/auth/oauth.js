const express = require('express');
const passport = require('../../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Initialize Google OAuth authentication
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

// Handle Google OAuth callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            // Create JWT token for the authenticated user
            const user = req.user;
            
            const token = jwt.sign(
                { 
                    id: user._id, 
                    username: user.username || user.name,
                    email: user.email,
                    role: 'resident' 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Redirect to frontend with token
            const frontendURL = process.env.CLIENT_URL || 'http://localhost:3000';
            res.redirect(`${frontendURL}/oauth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                totalPoints: user.totalPoints,
                authProvider: user.authProvider
            }))}`);
        } catch (error) {
            console.error('Error in OAuth callback:', error);
            const frontendURL = process.env.CLIENT_URL || 'http://localhost:3000';
            res.redirect(`${frontendURL}/oauth/error?message=${encodeURIComponent('Authentication failed')}`);
        }
    }
);

// Route to get user info after OAuth (alternative to URL params)
router.get('/user', (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                totalPoints: req.user.totalPoints,
                authProvider: req.user.authProvider
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;