const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('../config/passport');
const { AUTH, CORS } = require('../config/constants');
const {globalErrHandler, notFoundErr,} = require('../middleware/globalErrHandler');
const wasteBinRouter = require('../routes/wastebin/wastebin');
const managerRouter = require('../routes/user/manager');
const residentRouter = require('../routes/user/resident'); 
const jobRouter = require('../routes/jobs/jobs');
const empRouter = require('../routes/user/employee');
const transaction = require('../routes/wastebin/wastebinTransaction');
const oauthRouter = require('../routes/auth/oauth');
const sanitizeRequest = require('../middleware/sanitization');

const app = express();

// Session configuration for Passport
app.use(session({
    secret: AUTH.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({ 
    origin: CORS.CLIENT_URL,
    credentials: true // Allow credentials for session-based auth
}));
app.use(express.json());
app.use(sanitizeRequest);

//Waste Bin routes
app.use('/api/wastebin', wasteBinRouter);
//User routes
//residents
app.use('/api/resident', residentRouter);

//Manager routes
app.use('/api/manager', managerRouter);

//Job routes
app.use('/api/job', jobRouter);

//Employee routes
app.use('/api/employee', empRouter);

//Transaction routes
app.use('/api/transaction', transaction);

//OAuth routes
app.use('/auth', oauthRouter);

//Error handling
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;