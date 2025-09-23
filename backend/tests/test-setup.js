const mongoose = require('mongoose');

const setupTestDB = () => {
    beforeAll(async () => {
        // Only connect if we're not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/waste-management-test', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
    });

    beforeEach(async () => {
        // Clear all collections before each test
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    });

    afterAll(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });
};

module.exports = {
    setupTestDB
};