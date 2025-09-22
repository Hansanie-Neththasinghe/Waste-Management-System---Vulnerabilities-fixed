const Employee = require('../../models/users/employee');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// Generate a random username
const generateRandomUsername = () => {
    return 'EMP' + crypto.randomInt(100, 999);
};
// Add a new employee
exports.addEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        const username = generateRandomUsername();


        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            username,
            password,
            phoneNumber
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', data: newEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Employee login
exports.loginEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;

        const employee = await Employee.findOne({ username });

        if (!employee || employee.password !== password) {
            return res.status(404).json({ message: 'Invalid Username or Password' });
        }

        res.status(200).json({ message: 'Login successful', data: employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an employee by id
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an employee by username
exports.getEmployeeByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    }catch (error) {     
        res.status(500).json({ error: error.message });
    }
};
