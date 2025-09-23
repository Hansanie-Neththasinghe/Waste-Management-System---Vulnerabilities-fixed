const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const WasteTransaction = require('../../src/models/WasteBin/wasteTransaction');
const wasteBinTransactionController = require('../../src/controllers/wasteBin/wasteBinTrasnactionController');
const WasteBin = require('../../src/models/WasteBin/WasteBin');
const { setupTestDB } = require('../test-setup');

setupTestDB();

// Initialize the Express app and use the controller routes
const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
    // For tests requiring auth, we can set req.user here
    if (req.headers['x-test-role']) {
        req.user = {
            id: new mongoose.Types.ObjectId().toString(), // Generate a valid ObjectId
            role: req.headers['x-test-role']
        };
    }
    next();
});

// Define the routes
app.post('/waste-transactions', wasteBinTransactionController.createTransaction);
app.get('/waste-transactions', wasteBinTransactionController.getAllTransactions);
app.get('/waste-transactions/:id', wasteBinTransactionController.getTransactionById);

// Test suite for wasteBinTransactionController
describe('Waste Bin Transaction Controller Test', () => {
    let wasteBin;

    // Set up a waste bin before running tests
    beforeAll(async () => {
        wasteBin = await WasteBin.create({
            binID: 'BIN123',
            binType: 'recycling',
            currentWeight: 100
        });
    });

    // Clean up the WasteTransaction collection before each test
    beforeEach(async () => {
        await WasteTransaction.deleteMany();
    });

    // Test case 1: Return an empty array when no transactions are found (no auth)
    it('should return an empty array when no transactions are found without auth', async () => {
        const res = await request(app).get('/waste-transactions');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    // Test case 2: Return an empty array when no transactions are found (resident)
    it('should return an empty array when no transactions are found for resident', async () => {
        const res = await request(app)
            .get('/waste-transactions')
            .set('x-test-role', 'resident');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    // Test case 3: Return an empty array when no transactions are found (employee)
    it('should return an empty array when no transactions are found for employee', async () => {
        const res = await request(app)
            .get('/waste-transactions')
            .set('x-test-role', 'employee');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    // Test case 4: Fetch all waste bin transactions
    it('should fetch all waste bin transactions', async () => {
        const transaction = new WasteTransaction({
            binId: wasteBin._id,
            binOwner: new mongoose.Types.ObjectId(),
            binType: 'recycling',
            currentWeight: 200,
            timestamp: new Date()
        });
        await transaction.save();

        const res = await request(app)
            .get('/waste-transactions')
            .set('x-test-role', 'employee');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].currentWeight).toBe(200);
    });

    // Test case 5: Fetch a waste bin transaction by ID
    it('should fetch a waste bin transaction by ID', async () => {
        const transaction = new WasteTransaction({
            binId: wasteBin._id,
            binOwner: new mongoose.Types.ObjectId(),
            binType: 'recycling',
            currentWeight: 250,
            timestamp: new Date()
        });
        await transaction.save();

        const res = await request(app)
            .get(`/waste-transactions/${transaction._id}`)
            .set('x-test-role', 'employee');
        expect(res.statusCode).toEqual(200);
        expect(res.body.currentWeight).toBe(250);
    });

    // Test case 6: Create a new transaction
    it('should create a new transaction', async () => {
        const res = await request(app)
            .post('/waste-transactions')
            .set('x-test-role', 'employee')
            .send({
                binId: wasteBin._id,
                binOwner: new mongoose.Types.ObjectId(),
                binType: 'recycling',
                currentWeight: 300,
                timestamp: new Date()
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.currentWeight).toBe(300);
    });
});
