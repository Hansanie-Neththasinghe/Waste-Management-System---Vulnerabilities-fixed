const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../../src/models/users/employee');
const employeeController = require('../../src/controllers/users/employeeController');

// Initialize the Express app and use the controller routes
const app = express();
app.use(express.json());

// Define the routes
app.post('/employees', employeeController.addEmployee);
app.get('/employees', employeeController.getAllEmployees);
app.get('/employees/:id', employeeController.getEmployeeById);
app.get('/employees/username/:username', employeeController.getEmployeeByUsername);
app.delete('/employees/:id', employeeController.deleteEmployee);

describe('Employee Controller Test', () => {
  
  // Clean up the employee collection before each test
  beforeEach(async () => {
    await Employee.deleteMany();
  });

  // Test case 1: Add a new employee
  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/employees')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '555-5555'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Employee added successfully');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data).toHaveProperty('username');  // Should have a generated username like EMPXXX
  });

  // Test case 2: Fetch all employees
  it('should fetch all employees', async () => {
    const employee = new Employee({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      username: 'EMP001',
      password: 'password123',
      phoneNumber: '555-6666'
    });
    await employee.save();

    const res = await request(app).get('/employees');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].username).toBe('EMP001');
  });

  // Test case 3: Fetch an employee by ID
  it('should fetch an employee by ID', async () => {
    const employee = new Employee({
      firstName: 'Jack',
      lastName: 'Smith',
      email: 'jack.smith@example.com',
      username: 'EMP002',
      password: 'password123',
      phoneNumber: '555-7777'
    });
    await employee.save();

    const res = await request(app).get(`/employees/${employee._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toBe('jack.smith@example.com');
  });

  // Test case 4: Fetch an employee by username
  it('should fetch an employee by username', async () => {
    const employee = new Employee({
      firstName: 'Sam',
      lastName: 'Taylor',
      email: 'sam.taylor@example.com',
      username: 'EMP003',
      password: 'password123',
      phoneNumber: '555-8888'
    });
    await employee.save();

    const res = await request(app).get('/employees/username/EMP003');
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('EMP003');
  });

  // Test case 5: Delete an employee
  it('should delete an employee by ID', async () => {
    const employee = new Employee({
      firstName: 'Sara',
      lastName: 'Williams',
      email: 'sara.williams@example.com',
      username: 'EMP004',
      password: 'password123',
      phoneNumber: '555-9999'
    });
    await employee.save();

    const res = await request(app).delete(`/employees/${employee._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Employee deleted successfully');
  });

//   // Test case 6: Return 404 when fetching non-existent employee by ID
//   it('should return 404 when employee not found by ID', async () => {
//     const nonExistentId = mongoose.Types.ObjectId();
//     const res = await request(app).get(`/employees/${nonExistentId}`);
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.message).toBe('Employee not found');
//   });

  // Test case 7: Return 404 when fetching non-existent employee by username
  it('should return 404 when employee not found by username', async () => {
    const res = await request(app).get('/employees/username/nonexistentuser');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Employee not found');
  });

  // Test case 8: Return an empty array when no employees are found
  it('should return an empty array when no employees are found', async () => {
    const res = await request(app).get('/employees');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);  // The array should be empty
  });

});
