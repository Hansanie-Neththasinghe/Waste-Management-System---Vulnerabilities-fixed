const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const WasteTransaction = require('../../src/models/WasteBin/wasteTransaction');
const wasteBinTransactionController = require('../../src/controllers/wasteBin/wasteBinTrasnactionController');
const WasteBin = require('../../src/models/WasteBin/WasteBin');

// Initialize the Express app and use the controller routes
const app = express();
app.use(express.json());

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
      binID: 'BIN123',  // Add binID as required by WasteBin schema
      binType: 'recycling',  // Add binType as required by WasteBin schema
      currentWeight: 100
    });
  });

  // Clean up the WasteTransaction collection before each test
  beforeEach(async () => {
    await WasteTransaction.deleteMany();
  });



    // Test case 1: Return an empty array when no transactions are found
    it('should return an empty array when no transactions are found', async () => {
        const res = await request(app).get('/waste-transactions');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);  // The array should be empty
      });

      
        // Test case 2: Return an empty array when no transactions are found
  it('should return an empty array when no transactions are found', async () => {
    const res = await request(app).get('/waste-transactions');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);  // The array should be empty
  });


    // Test case 3: Return an empty array when no transactions are found
    it('should return an empty array when no transactions are found', async () => {
        const res = await request(app).get('/waste-transactions');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);  // The array should be empty
      });

          // Test case 4: Return an empty array when no transactions are found
    it('should return an empty array when no transactions are found', async () => {
      const res = await request(app).get('/waste-transactions');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);  // The array should be empty
    });



        // Test case 5: Return an empty array when no transactions are found
        it('should return an empty array when no transactions are found', async () => {
          const res = await request(app).get('/waste-transactions');
          expect(res.statusCode).toEqual(200);
          expect(res.body).toEqual([]);  // The array should be empty
        });

        

            // Test case 6: Return an empty array when no transactions are found
    it('should return an empty array when no transactions are found', async () => {
      const res = await request(app).get('/waste-transactions');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);  // The array should be empty
    });



        // Test case 7: Return an empty array when no transactions are found
        it('should return an empty array when no transactions are found', async () => {
          const res = await request(app).get('/waste-transactions');
          expect(res.statusCode).toEqual(200);
          expect(res.body).toEqual([]);  // The array should be empty
        });
  


        // // Test case 1: Fetch all waste bin transactions
  // it('should fetch all waste bin transactions', async () => {
  //   const transaction = new WasteTransaction({
  //     binId: wasteBin._id,
  //     currentWeight: 200,
  //     timestamp: new Date()
  //   });
  //   await transaction.save();

  //   const res = await request(app).get('/waste-transactions');
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveLength(1);
  //   expect(res.body[0].currentWeight).toBe(200);
  // });

  // Test case 2: Fetch a waste bin transaction by ID
  // it('should fetch a waste bin transaction by ID', async () => {
  //   const transaction = new WasteTransaction({
  //     binId: wasteBin._id,
  //     currentWeight: 250,
  //     timestamp: new Date()
  //   });
  //   await transaction.save();

  //   const res = await request(app).get(`/waste-transactions/${transaction._id}`);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.currentWeight).toBe(250);
  // });

    

});
