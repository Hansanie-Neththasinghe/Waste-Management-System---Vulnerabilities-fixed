const request = require('supertest');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Resident = require('../../src/models/users/resident');
const residentController = require('../../src/controllers/users/residentController');

// Middleware to parse JSON
app.use(express.json());
app.post('/residents', residentController.createResident);
app.get('/residents', residentController.getAllResidents);
app.get('/residents/:username', residentController.getResidentById);

describe('Resident Controller Test', () => {
  beforeEach(async () => {
    await Resident.deleteMany();  // Clean the collection before each test
  });

  it('should create a resident', async () => {
    const res = await request(app)
      .post('/residents')
      .send({
        username: 'johndoe',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        address: '123 Street',
        contactNumber: '555-5555'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe('johndoe');
  });

  // it('should fetch all residents', async () => {
  //   const resident = new Resident({
  //     username: 'johndoe',
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     password: 'password123',
  //     address: '123 Street',
  //     contactNumber: '555-5555'
  //   });
  //   await resident.save();

  //   const res = await request(app).get('/residents');
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveLength(1);
  //   expect(res.body[0].username).toBe('johndoe');
  // });

  it('should return 404 when resident not found', async () => {
    const res = await request(app).get('/residents/nonexistentUser');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Resident not found');
  });

  it('should fetch a resident by username', async () => {
    const resident = new Resident({
      username: 'janedoe',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
      address: '456 Avenue',
      contactNumber: '555-1234'
    });
    await resident.save();
  
    const res = await request(app).get('/residents/janedoe');
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('janedoe');
    expect(res.body.email).toBe('janedoe@example.com');
  });
  
  it('should return 404 when fetching resident by non-existent username', async () => {
    const res = await request(app).get('/residents/nonexistentuser');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Resident not found');
  });

  it('should return an empty array when no residents are found', async () => {
    const res = await request(app).get('/residents');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);  // The array should be empty
  });
  
});
