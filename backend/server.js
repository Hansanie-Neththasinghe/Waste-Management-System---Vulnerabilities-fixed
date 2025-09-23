//import files 
const dotenv = require('dotenv');

// Load environment variables FIRST, before any other modules
dotenv.config({ path: './.env' });

const mongoose = require('mongoose');
const app = require('./src/app/app');


const PORT = process.env.PORT || 2025;
const MONGO_URI = process.env.MONGO_URI;

// Routes

// Start the server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.log('Error connecting to the database', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});