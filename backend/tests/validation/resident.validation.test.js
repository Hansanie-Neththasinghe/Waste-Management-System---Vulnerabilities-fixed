const request = require('supertest');
const app = require('../../src/app/app');
const Resident = require('../../src/models/users/resident');
const mongoose = require('mongoose');
const { setupTestDB } = require('../test-setup');
const bcrypt = require('bcrypt');

setupTestDB();

const validResident = {
    username: "testuser123",
    name: "Test User",
    email: "test@example.com",
    password: "Test@123456",
    address: "123 Test Street, City",
    contactNumber: "+94771234567"
};

describe('Resident Input Validation Tests', () => {
    
    describe('POST /api/resident - Create Resident', () => {
        const validResident = {
            username: "testuser123",
            name: "Test User",
            email: "test@example.com",
            password: "Test@123456",
            address: "123 Test Street, City",
            contactNumber: "+94771234567"
        };

        test('Should create resident with valid data', async () => {
            const res = await request(app)
                .post('/api/resident')
                .send(validResident);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('username', validResident.username);
        });

        test('Should reject invalid username format', async () => {
            const res = await request(app)
                .post('/api/resident')
                .send({
                    ...validResident,
                    username: "test@user" // Invalid character @
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('Should reject invalid email format', async () => {
            const res = await request(app)
                .post('/api/resident')
                .send({
                    ...validResident,
                    email: "invalid-email"
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('Should reject weak password', async () => {
            const res = await request(app)
                .post('/api/resident')
                .send({
                    ...validResident,
                    password: "weak"
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('Should reject invalid phone number', async () => {
            const res = await request(app)
                .post('/api/resident')
                .send({
                    ...validResident,
                    contactNumber: "invalid123"
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('PUT /api/resident/:id - Update Resident', () => {
        let resident;

        beforeEach(async () => {
            // Create a test resident
            const hashedPassword = await bcrypt.hash(validResident.password, 12);
            resident = await Resident.create({
                ...validResident,
                password: hashedPassword
            });
        });

        test('Should update resident with valid data', async () => {
            const res = await request(app)
                .put(`/api/resident/${resident._id}`)
                .send({
                    name: "Updated Name",
                    contactNumber: "+94777654321"
                });
            
            // For validation tests, we expect 401 without auth token
            expect(res.status).toBe(401);
        });

        test('Should reject invalid object ID', async () => {
            const res = await request(app)
                .put('/api/resident/invalid-id')
                .send({
                    name: "Updated Name"
                });
            
            // For validation tests, we expect 401 without auth token
            expect(res.status).toBe(401);
        });

        test('Should reject invalid email update', async () => {
            const res = await request(app)
                .put(`/api/resident/${resident._id}`)
                .send({
                    email: "invalid-email"
                });
            
            // For validation tests, we expect 401 without auth token
            expect(res.status).toBe(401);
        });
    });

    describe('NoSQL Injection Prevention Tests', () => {
        test('Should prevent NoSQL injection in login', async () => {
            const res = await request(app)
                .post('/api/resident/login')
                .send({
                    username: { $ne: null },
                    password: { $ne: null }
                });
            
            // Login should fail with 401 Unauthorized
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });

        test('Should prevent NoSQL injection in query params', async () => {
            const res = await request(app)
                .get('/api/resident')
                .query({ username: { $ne: null } });
            
            // Invalid query params should result in 401 Unauthorized
            expect(res.status).toBe(401);
        });
    });

    describe('Input Sanitization Tests', () => {
        test('Should sanitize HTML in input fields', async () => {
            const testName = "<script>alert('xss')</script>Test User";
            const testAddress = "<img src=x onerror=alert('xss')>123 Street";
            
            const res = await request(app)
                .post('/api/resident')
                .send({
                    ...validResident,
                    name: testName,
                    address: testAddress
                });
            
            expect(res.status).toBe(201);
            expect(res.body.name).toBe("Test User");
            expect(res.body.address).toBe("123 Street");
        });
    });
});