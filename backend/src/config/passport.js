const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Resident = require('../models/users/resident');

// Only configure Google OAuth strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Configure Google OAuth strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await Resident.findOne({ googleId: profile.id });
        
        if (existingUser) {
            // User exists, return the user
            return done(null, existingUser);
        }

        // Check if user exists with the same email (for account linking)
        existingUser = await Resident.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            existingUser.profilePicture = profile.photos[0].value;
            existingUser.emailVerified = true;
            existingUser.authProvider = 'google';
            await existingUser.save();
            return done(null, existingUser);
        }

        // Create new user
        const newUser = await Resident.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            emailVerified: true,
            authProvider: 'google',
            totalPoints: 0
        });

        return done(null, newUser);
    } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
    }
}));
} else {
    console.log('Google OAuth credentials not found. Skipping Google OAuth configuration.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Resident.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;