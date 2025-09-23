const axios = require('axios');

const BASE_URL = 'http://localhost:2025/api';

async function testUserCreationAndLogin() {
    try {
        console.log('🧪 Testing User Creation and Login Flow...\n');

        // Test 1: Create a new resident
        console.log('1️⃣ Testing Resident Creation...');
        const newResident = {
            username: 'testuser' + Date.now(),
            name: 'Test User',
            email: `testuser${Date.now()}@example.com`,
            password: 'securePassword123!',
            address: '123 Test Street, Test City',
            contactNumber: '555-1234'
        };

        const createResponse = await axios.post(`${BASE_URL}/resident`, newResident);
        console.log('✅ Resident created successfully!');
        console.log('Response status:', createResponse.status);
        console.log('Created user:', JSON.stringify(createResponse.data, null, 2));
        
        // Check if password is NOT in response
        if (createResponse.data.password) {
            console.log('❌ SECURITY ISSUE: Password returned in response!');
        } else {
            console.log('✅ SECURITY OK: Password not returned in response');
        }

        // Test 2: Login with correct credentials
        console.log('\n2️⃣ Testing Login with Correct Credentials...');
        const loginData = {
            username: newResident.username,
            password: newResident.password
        };

        const loginResponse = await axios.post(`${BASE_URL}/resident/login`, loginData);
        console.log('✅ Login successful!');
        console.log('Response status:', loginResponse.status);
        console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));

        // Check if JWT token is returned
        if (loginResponse.data.token) {
            console.log('✅ JWT token returned successfully');
        } else {
            console.log('❌ No JWT token in response');
        }

        // Test 3: Login with wrong credentials
        console.log('\n3️⃣ Testing Login with Wrong Credentials...');
        try {
            const wrongLoginData = {
                username: newResident.username,
                password: 'wrongpassword'
            };

            await axios.post(`${BASE_URL}/resident/login`, wrongLoginData);
            console.log('❌ Login should have failed but didn\'t!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Login correctly failed with 401 status');
                console.log('Error message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        // Test 4: Test duplicate user creation
        console.log('\n4️⃣ Testing Duplicate User Creation...');
        try {
            await axios.post(`${BASE_URL}/resident`, newResident);
            console.log('❌ Duplicate user creation should have failed but didn\'t!');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log('✅ Duplicate user creation correctly failed with 409 status');
                console.log('Error message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.error('Full error:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        if (error.request) {
            console.error('Request details:', error.request);
        }
    }
}

// Run the tests
testUserCreationAndLogin();