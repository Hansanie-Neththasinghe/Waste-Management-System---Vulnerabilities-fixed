const axios = require('axios');

const BASE_URL = 'http://localhost:2025/api';

async function testManagerAndEmployeeAuth() {
    try {
        console.log('🧪 Testing Manager and Employee Authentication Flow...\n');

        // ===========================================
        // MANAGER TESTING
        // ===========================================
        console.log('👤 MANAGER TESTING');
        console.log('==========================================');

        // Test 1: Create a new manager
        console.log('1️⃣ Testing Manager Creation...');
        const newManager = {
            firstName: 'John',
            lastName: 'Manager',
            email: `manager${Date.now()}@company.com`,
            phoneNumber: '555-1111',
            password: 'managerPassword123!'
        };

        const managerCreateResponse = await axios.post(`${BASE_URL}/manager/create`, newManager);
        console.log('✅ Manager created successfully!');
        console.log('Response status:', managerCreateResponse.status);
        console.log('Created manager:', JSON.stringify(managerCreateResponse.data, null, 2));
        
        // Check if password is NOT in response
        if (managerCreateResponse.data.data.password) {
            console.log('❌ SECURITY ISSUE: Password returned in manager creation response!');
        } else {
            console.log('✅ SECURITY OK: Password not returned in manager creation response');
        }

        const createdManagerUsername = managerCreateResponse.data.data.username;

        // Test 2: Manager login with correct credentials
        console.log('\n2️⃣ Testing Manager Login with Correct Credentials...');
        const managerLoginData = {
            username: createdManagerUsername,
            password: newManager.password
        };

        const managerLoginResponse = await axios.post(`${BASE_URL}/manager/login`, managerLoginData);
        console.log('✅ Manager login successful!');
        console.log('Response status:', managerLoginResponse.status);
        console.log('Login response:', JSON.stringify(managerLoginResponse.data, null, 2));

        const managerToken = managerLoginResponse.data.token;
        if (managerToken) {
            console.log('✅ Manager JWT token returned successfully');
        } else {
            console.log('❌ No JWT token in manager login response');
        }

        // Test 3: Manager login with wrong credentials
        console.log('\n3️⃣ Testing Manager Login with Wrong Credentials...');
        try {
            const wrongManagerLoginData = {
                username: createdManagerUsername,
                password: 'wrongpassword'
            };

            await axios.post(`${BASE_URL}/manager/login`, wrongManagerLoginData);
            console.log('❌ Manager login should have failed but didn\'t!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Manager login correctly failed with 401 status');
                console.log('Error message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected manager login error:', error.message);
            }
        }

        // ===========================================
        // EMPLOYEE TESTING
        // ===========================================
        console.log('\n\n👷 EMPLOYEE (DRIVER) TESTING');
        console.log('==========================================');

        // Test 4: Create a new employee (using manager token)
        console.log('4️⃣ Testing Employee Creation (with Manager Authorization)...');
        const newEmployee = {
            firstName: 'Alice',
            lastName: 'Driver',
            email: `driver${Date.now()}@company.com`,
            phoneNumber: '555-2222',
            password: 'driverPassword123!'
        };

        const employeeCreateResponse = await axios.post(`${BASE_URL}/employee/create`, newEmployee, {
            headers: {
                'Authorization': `Bearer ${managerToken}`
            }
        });
        console.log('✅ Employee created successfully!');
        console.log('Response status:', employeeCreateResponse.status);
        console.log('Created employee:', JSON.stringify(employeeCreateResponse.data, null, 2));

        // Check if password is NOT in response
        if (employeeCreateResponse.data.data.password) {
            console.log('❌ SECURITY ISSUE: Password returned in employee creation response!');
        } else {
            console.log('✅ SECURITY OK: Password not returned in employee creation response');
        }

        const createdEmployeeUsername = employeeCreateResponse.data.data.username;

        // Test 5: Employee login with correct credentials
        console.log('\n5️⃣ Testing Employee Login with Correct Credentials...');
        const employeeLoginData = {
            username: createdEmployeeUsername,
            password: newEmployee.password
        };

        const employeeLoginResponse = await axios.post(`${BASE_URL}/employee/login`, employeeLoginData);
        console.log('✅ Employee login successful!');
        console.log('Response status:', employeeLoginResponse.status);
        console.log('Login response:', JSON.stringify(employeeLoginResponse.data, null, 2));

        const employeeToken = employeeLoginResponse.data.token;
        if (employeeToken) {
            console.log('✅ Employee JWT token returned successfully');
        } else {
            console.log('❌ No JWT token in employee login response');
        }

        // Test 6: Employee login with wrong credentials
        console.log('\n6️⃣ Testing Employee Login with Wrong Credentials...');
        try {
            const wrongEmployeeLoginData = {
                username: createdEmployeeUsername,
                password: 'wrongpassword'
            };

            await axios.post(`${BASE_URL}/employee/login`, wrongEmployeeLoginData);
            console.log('❌ Employee login should have failed but didn\'t!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Employee login correctly failed with 401 status');
                console.log('Error message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected employee login error:', error.message);
            }
        }

        // ===========================================
        // AUTHORIZATION TESTING
        // ===========================================
        console.log('\n\n🔐 AUTHORIZATION TESTING');
        console.log('==========================================');

        // Test 7: Test unauthorized employee creation (without manager token)
        console.log('7️⃣ Testing Unauthorized Employee Creation...');
        try {
            const unauthorizedEmployee = {
                firstName: 'Unauthorized',
                lastName: 'Employee',
                email: `unauthorized${Date.now()}@company.com`,
                phoneNumber: '555-3333',
                password: 'password123!'
            };

            await axios.post(`${BASE_URL}/employee/create`, unauthorizedEmployee);
            console.log('❌ Unauthorized employee creation should have failed but didn\'t!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Unauthorized employee creation correctly failed with 401 status');
                console.log('Error message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected unauthorized creation error:', error.message);
            }
        }

        // Test 8: Test accessing protected route with valid token
        console.log('\n8️⃣ Testing Access to Protected Routes with Valid Tokens...');
        try {
            // Manager accessing all managers
            const managersResponse = await axios.get(`${BASE_URL}/manager`, {
                headers: {
                    'Authorization': `Bearer ${managerToken}`
                }
            });
            console.log('✅ Manager successfully accessed protected route');
            console.log('Managers count:', managersResponse.data.length);

            // Manager accessing all employees
            const employeesResponse = await axios.get(`${BASE_URL}/employee`, {
                headers: {
                    'Authorization': `Bearer ${managerToken}`
                }
            });
            console.log('✅ Manager successfully accessed employee list');
            console.log('Employees count:', employeesResponse.data.length);

        } catch (error) {
            console.log('❌ Error accessing protected routes:', error.response?.data || error.message);
        }

        console.log('\n🎉 All Manager and Employee Authentication Tests Completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the tests
testManagerAndEmployeeAuth();