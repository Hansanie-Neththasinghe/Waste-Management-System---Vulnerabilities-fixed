const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Manager = require('./src/models/users/manager');
const Employee = require('./src/models/users/employee');

// Generate random username function
const generateRandomUsername = () => {
    return 'MAN' + Math.floor(Math.random() * 900 + 100);
};

const generateRandomEmployeeUsername = () => {
    return 'EMP' + Math.floor(Math.random() * 900 + 100);
};

async function testDatabaseOperations() {
    try {
        console.log('🔌 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database successfully');

        // Test 1: Create a manager
        console.log('\n👤 Testing Manager Creation...');
        const managerData = {
            firstName: 'Test',
            lastName: 'Manager',
            email: `testmanager${Date.now()}@company.com`,
            phoneNumber: '555-1111',
            password: 'manager123',
            username: generateRandomUsername()
        };

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(managerData.password, saltRounds);
        managerData.password = hashedPassword;

        const manager = await Manager.create(managerData);
        console.log('✅ Manager created successfully!');
        console.log('Manager ID:', manager._id);
        console.log('Manager Username:', manager.username);
        console.log('Manager Email:', manager.email);

        // Test 2: Create an employee
        console.log('\n👷 Testing Employee Creation...');
        const employeeData = {
            firstName: 'Test',
            lastName: 'Employee', 
            email: `testemployee${Date.now()}@company.com`,
            phoneNumber: '555-2222',
            password: 'employee123',
            username: generateRandomEmployeeUsername()
        };

        // Hash password
        const hashedEmployeePassword = await bcrypt.hash(employeeData.password, saltRounds);
        employeeData.password = hashedEmployeePassword;

        const employee = await Employee.create(employeeData);
        console.log('✅ Employee created successfully!');
        console.log('Employee ID:', employee._id);
        console.log('Employee Username:', employee.username);
        console.log('Employee Email:', employee.email);

        // Test 3: Test password verification
        console.log('\n🔒 Testing Password Verification...');
        
        // Test manager password
        const managerPasswordMatch = await bcrypt.compare('manager123', manager.password);
        console.log('Manager password verification:', managerPasswordMatch ? '✅ Correct' : '❌ Incorrect');

        // Test employee password
        const employeePasswordMatch = await bcrypt.compare('employee123', employee.password);
        console.log('Employee password verification:', employeePasswordMatch ? '✅ Correct' : '❌ Incorrect');

        // Test wrong password
        const wrongPasswordMatch = await bcrypt.compare('wrongpassword', manager.password);
        console.log('Wrong password verification:', wrongPasswordMatch ? '❌ Incorrect (this should be false)' : '✅ Correctly rejected');

        console.log('\n🎉 All database tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from database');
    }
}

// Run the test
testDatabaseOperations();