// Simple test script for Manager and Employee login
// Make sure the server is running on port 2025 before running this script

const axios = require('axios');

async function simpleManagerTest() {
    console.log('🔧 Simple Manager Test');
    console.log('========================');
    
    try {
        // 1. Create a manager
        console.log('1. Creating a manager...');
        const manager = await axios.post('http://localhost:2025/api/manager/create', {
            firstName: 'Test',
            lastName: 'Manager',
            email: `testmanager${Date.now()}@company.com`,
            phoneNumber: '555-1111',
            password: 'manager123'
        });
        
        console.log('✅ Manager created successfully');
        console.log('Username:', manager.data.data.username);
        
        // 2. Login with manager
        console.log('\n2. Logging in as manager...');
        const login = await axios.post('http://localhost:2025/api/manager/login', {
            username: manager.data.data.username,
            password: 'manager123'
        });
        
        console.log('✅ Manager login successful');
        console.log('Token received:', !!login.data.token);
        console.log('Token:', login.data.token.substring(0, 50) + '...');
        
        return login.data.token;
        
    } catch (error) {
        console.error('❌ Manager test failed:', error.response?.data || error.message);
        return null;
    }
}

async function simpleEmployeeTest(managerToken) {
    console.log('\n🔧 Simple Employee Test');
    console.log('========================');
    
    try {
        // 1. Create an employee (using manager token)
        console.log('1. Creating an employee...');
        const employee = await axios.post('http://localhost:2025/api/employee/create', {
            firstName: 'Test',
            lastName: 'Employee',
            email: `testemployee${Date.now()}@company.com`,
            phoneNumber: '555-2222',
            password: 'employee123'
        }, {
            headers: { Authorization: `Bearer ${managerToken}` }
        });
        
        console.log('✅ Employee created successfully');
        console.log('Username:', employee.data.data.username);
        
        // 2. Login with employee
        console.log('\n2. Logging in as employee...');
        const login = await axios.post('http://localhost:2025/api/employee/login', {
            username: employee.data.data.username,
            password: 'employee123'
        });
        
        console.log('✅ Employee login successful');
        console.log('Token received:', !!login.data.token);
        console.log('Token:', login.data.token.substring(0, 50) + '...');
        
        return login.data.token;
        
    } catch (error) {
        console.error('❌ Employee test failed:', error.response?.data || error.message);
        return null;
    }
}

async function runSimpleTests() {
    console.log('🧪 Running Simple Manager and Employee Login Tests\n');
    
    // Test manager
    const managerToken = await simpleManagerTest();
    
    if (managerToken) {
        // Test employee
        const employeeToken = await simpleEmployeeTest(managerToken);
        
        if (employeeToken) {
            console.log('\n🎉 All tests passed successfully!');
            console.log('\n📋 Summary:');
            console.log('✅ Manager creation: Working');
            console.log('✅ Manager login: Working');
            console.log('✅ Employee creation: Working');
            console.log('✅ Employee login: Working');
            console.log('✅ JWT tokens: Generated properly');
        }
    }
}

// Run the tests
runSimpleTests();