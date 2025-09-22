const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Manager = require('../../src/models/users/manager');
const managerController = require('../../src/controllers/users/managerController');

// Initialize the Express app and use the controller routes
const app = express();
app.use(express.json());

// Define the routes
app.post('/managers', managerController.createManager);
app.get('/managers', managerController.getAllManagers);
app.get('/managers/:id', managerController.getManagerById);
app.delete('/managers/:id', managerController.deleteManagerById);
app.put('/managers/:id', managerController.updateManagerById);
app.post('/managers/login', managerController.loginManager);

describe('Manager Controller Test', () => {
  
  // Clean up the manager collection before each test
  beforeEach(async () => {
    await Manager.deleteMany();
  });

  // Test case 1: Add a new manager
  it('should create a new manager', async () => {
    const res = await request(app)
      .post('/managers')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '555-5555',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Manager created successfully');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.username).toMatch(/^MAN\d{3}$/);  // Check if username matches 'MANXXX'
  });

  // Test case 2: Fetch all managers
  it('should fetch all managers', async () => {
    const manager = new Manager({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      username: 'MAN001',
      password: 'password123',
      phoneNumber: '555-6666'
    });
    await manager.save();

    const res = await request(app).get('/managers');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe('MAN001');
  });

  // Test case 3: Fetch a manager by ID
  it('should fetch a manager by ID', async () => {
    const manager = new Manager({
      firstName: 'Jack',
      lastName: 'Smith',
      email: 'jack.smith@example.com',
      username: 'MAN002',
      password: 'password123',
      phoneNumber: '555-7777'
    });
    await manager.save();

    const res = await request(app).get(`/managers/${manager._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toBe('jack.smith@example.com');
  });

  // Test case 4: Update a manager
  it('should update a manager by ID', async () => {
    const manager = new Manager({
      firstName: 'Sarah',
      lastName: 'Lee',
      email: 'sarah.lee@example.com',
      username: 'MAN003',
      password: 'password123',
      phoneNumber: '555-8888'
    });
    await manager.save();

    const res = await request(app)
      .put(`/managers/${manager._id}`)
      .send({ firstName: 'Sarah Updated', phoneNumber: '555-9999' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toBe('Sarah Updated');
    expect(res.body.phoneNumber).toBe('555-9999');
  });

  // Test case 5: Delete a manager
  it('should delete a manager by ID', async () => {
    const manager = new Manager({
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      username: 'MAN004',
      password: 'password123',
      phoneNumber: '555-1010'
    });
    await manager.save();

    const res = await request(app).delete(`/managers/${manager._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Manager deleted successfully');
  });

  // Test case 6: Login a manager with valid credentials
  it('should login a manager with valid credentials', async () => {
    const manager = new Manager({
      firstName: 'Liam',
      lastName: 'Nelson',
      email: 'liam.nelson@example.com',
      username: 'MAN005',
      password: 'password123',
      phoneNumber: '555-1111'
    });
    await manager.save();

    const res = await request(app)
      .post('/managers/login')
      .send({ username: 'MAN005', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Login successful');
  });

//   // Test case 7: Return 404 when manager not found by ID
//   it('should return 404 when manager not found by ID', async () => {
//     const nonExistentId = mongoose.Types.ObjectId();
//     const res = await request(app).get(`/managers/${nonExistentId}`);
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.message).toBe('Manager not found');
//   });

  // Test case 8: Return 404 when manager not found for login
  it('should return 401 when manager login fails with invalid credentials', async () => {
    const res = await request(app)
      .post('/managers/login')
      .send({ username: 'invaliduser', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid username or password');
  });

  // Test case 9: Return an empty array when no managers are found
  it('should return an empty array when no managers are found', async () => {
    const res = await request(app).get('/managers');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);  // The array should be empty
  });

});
