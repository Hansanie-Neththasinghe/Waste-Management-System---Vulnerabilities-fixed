const request = require('supertest');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Resident = require('../../src/models/users/resident');
const residentController = require('../../src/controllers/users/residentController');

// Setup Express app for testing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

// Routes
app.post('/residents/login', async (req, res, next) => {
    try {
        await residentController.loginResident(req, res);
    } catch (err) {
        next(err);
    }
});

describe('Authentication Test', () => {
  // Setup test environment variables
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  let testResident;

  beforeAll(async () => {
    // Create a test resident with hashed password
    const hashedPassword = await bcrypt.hash('Test@123456', 12);
    testResident = new Resident({
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      address: '123 Test Street, City',
      contactNumber: '+94771234567'
    });
    await testResident.save();
  });

  afterAll(async () => {
    // Clean up test data
    await Resident.deleteOne({ username: 'testuser' });
  });

  describe('POST /residents/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/residents/login')
        .send({
          username: 'testuser',
          password: 'Test@123456'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('resident');
      expect(res.body.resident).not.toHaveProperty('password'); // Password should not be in response
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/residents/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail login with non-existent user', async () => {
      const res = await request(app)
        .post('/residents/login')
        .send({
          username: 'nonexistentuser',
          password: 'testpassword123'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail login with missing username', async () => {
      const res = await request(app)
        .post('/residents/login')
        .send({
          password: 'testpassword123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });

    it('should fail login with missing password', async () => {
      const res = await request(app)
        .post('/residents/login')
        .send({
          username: 'testuser'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });
  });
});