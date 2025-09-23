const axios = require('axios');

const BASE_URL = 'http://localhost:2025/api';

async function testAuthenticationFlow() {
    console.log('🧪 Testing Complete Authentication Flow...\n');

    try {
        // Test 1: Login as resident
        console.log('1. Testing Resident Login...');
        const residentLogin = await axios.post(`${BASE_URL}/resident/login`, {
            username: 'testuser',
            password: 'password123'
        });
        
        console.log('✅ Resident login successful');
        console.log('Token received:', residentLogin.data.token ? '✅ Yes' : '❌ No');
        console.log('Resident data received:', residentLogin.data.resident ? '✅ Yes' : '❌ No');
        
        const residentToken = residentLogin.data.token;
        const residentId = residentLogin.data.resident._id;

        // Test 2: Use token to access protected endpoint
        console.log('\n2. Testing Protected API Call with Token...');
        try {
            const protectedCall = await axios.get(`${BASE_URL}/resident/${residentLogin.data.resident.username}`, {
                headers: {
                    'Authorization': `Bearer ${residentToken}`
                }
            });
            console.log('✅ Protected API call successful with valid token');
        } catch (error) {
            console.log('❌ Protected API call failed:', error.response?.data?.message || error.message);
        }

        // Test 3: Try protected call without token
        console.log('\n3. Testing Protected API Call without Token...');
        try {
            await axios.get(`${BASE_URL}/resident/count`);
            console.log('❌ Protected API call should have failed but succeeded');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Protected API call correctly rejected without token');
            } else {
                console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
            }
        }

        // Test 4: Test manager login
        console.log('\n4. Testing Manager Login...');
        try {
            const managerLogin = await axios.post(`${BASE_URL}/manager/login`, {
                username: 'testmanager',
                password: 'password123'
            });
            console.log('✅ Manager login successful');
            console.log('Token received:', managerLogin.data.token ? '✅ Yes' : '❌ No');
            console.log('Manager data received:', managerLogin.data.manager ? '✅ Yes' : '❌ No');

            const managerToken = managerLogin.data.token;

            // Test manager accessing manager-only endpoint
            console.log('\n5. Testing Manager-Only Endpoint...');
            try {
                const managerOnlyCall = await axios.get(`${BASE_URL}/resident/count`, {
                    headers: {
                        'Authorization': `Bearer ${managerToken}`
                    }
                });
                console.log('✅ Manager successfully accessed manager-only endpoint');
            } catch (error) {
                console.log('❌ Manager failed to access manager-only endpoint:', error.response?.data?.message || error.message);
            }
        } catch (error) {
            console.log('❌ Manager login failed:', error.response?.data?.message || error.message);
        }

        // Test 5: Test employee login
        console.log('\n6. Testing Employee Login...');
        try {
            const employeeLogin = await axios.post(`${BASE_URL}/employee/login`, {
                username: 'testdriver',
                password: 'password123'
            });
            console.log('✅ Employee login successful');
            console.log('Token received:', employeeLogin.data.token ? '✅ Yes' : '❌ No');
            console.log('Employee data received:', employeeLogin.data.data ? '✅ Yes' : '❌ No');
        } catch (error) {
            console.log('❌ Employee login failed:', error.response?.data?.message || error.message);
        }

        // Test 6: Test expired/invalid token
        console.log('\n7. Testing Invalid Token...');
        try {
            await axios.get(`${BASE_URL}/resident/count`, {
                headers: {
                    'Authorization': 'Bearer invalid_token'
                }
            });
            console.log('❌ Invalid token should have been rejected but was accepted');
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('✅ Invalid token correctly rejected');
            } else {
                console.log('❌ Unexpected error with invalid token:', error.response?.data?.message || error.message);
            }
        }

    } catch (error) {
        console.log('❌ Test setup failed:', error.message);
        console.log('Make sure the server is running on http://localhost:2025');
    }

    console.log('\n🏁 Authentication flow testing completed!');
}

testAuthenticationFlow();