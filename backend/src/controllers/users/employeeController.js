const Employee = require('../../models/users/employee');
const bcrypt = require('bcrypt');
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

        // Input validation
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({ 
                message: 'All fields are required: firstName, lastName, email, password, phoneNumber' 
            });
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(409).json({ 
                message: 'Employee with this email already exists' 
            });
        }

        const username = generateRandomUsername();

        // Hash password before saving
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            phoneNumber
        });

        await newEmployee.save();
        
        // Don't send password in response
        const { password: _, ...employeeData } = newEmployee.toObject();
        
        res.status(201).json({ 
            message: 'Employee added successfully', 
            data: employeeData 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
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
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Properly compare password using bcrypt
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: employee._id, 
                username: employee.username,
                role: 'employee'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Don't send password in response
        const { password: _, ...employeeData } = employee.toObject();
        
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            data: employeeData 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
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
