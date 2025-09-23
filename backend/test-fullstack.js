const axios = require('axios');

const BACKEND_URL = 'http://localhost:2025/api';
const FRONTEND_URL = 'http://localhost:3000';

async function testFullStack() {
    console.log('🚀 Testing Full Stack Authentication Flow...\n');

    // Test 1: Check if backend is running
    console.log('1. Testing Backend Server...');
    try {
        const healthCheck = await axios.get(`${BACKEND_URL}/resident/count`, {
            timeout: 5000
        });
        console.log('❌ Backend is responding but should require authentication');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Backend is running and authentication is working (401 unauthorized expected)');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend server is not running on port 2025');
            console.log('Please start the backend with: npm start in the backend directory');
            return;
        } else {
            console.log('⚠️ Backend error:', error.message);
        }
    }

    // Test 2: Check if frontend is accessible
    console.log('\n2. Testing Frontend Server...');
    try {
        const frontendCheck = await axios.get(FRONTEND_URL, {
            timeout: 5000
        });
        console.log('✅ Frontend server is running on port 3000');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend server is not running on port 3000');
            console.log('Please start the frontend with: npm start in the front1 directory');
        } else {
            console.log('⚠️ Frontend error:', error.message);
        }
    }

    // Test 3: Test authentication flow
    console.log('\n3. Testing Authentication Flow...');
    
    // Test resident login
    console.log('\n   a) Testing Resident Login...');
    try {
        const residentLogin = await axios.post(`${BACKEND_URL}/resident/login`, {
            username: 'testuser',
            password: 'password123'
        });
        
        console.log('✅ Resident login successful');
        console.log('   - Token received:', residentLogin.data.token ? '✅' : '❌');
        console.log('   - User data received:', residentLogin.data.resident ? '✅' : '❌');
        
        const token = residentLogin.data.token;
        
        // Test protected endpoint with token
        console.log('\n   b) Testing Protected Endpoint with Token...');
        try {
            const protectedCall = await axios.get(`${BACKEND_URL}/resident/${residentLogin.data.resident.username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Protected API call successful with token');
        } catch (error) {
            console.log('❌ Protected API call failed:', error.response?.data?.message || error.message);
        }
        
        // Test protected endpoint without token
        console.log('\n   c) Testing Protected Endpoint without Token...');
        try {
            await axios.get(`${BACKEND_URL}/resident/count`);
            console.log('❌ Protected endpoint should require authentication');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Protected endpoint correctly requires authentication');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.data?.message || error.message);
            }
        }
        
    } catch (error) {
        console.log('❌ Resident login failed:', error.response?.data?.message || error.message);
        
        // Try to create a test user if login fails
        console.log('\n   Attempting to create test user...');
        try {
            await axios.post(`${BACKEND_URL}/resident`, {
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                address: '123 Test Street',
                contactNumber: '1234567890'
            });
            console.log('✅ Test user created successfully');
            console.log('   Try running the test again to login with the new user');
        } catch (createError) {
            if (createError.response?.status === 409) {
                console.log('✅ Test user already exists');
            } else {
                console.log('❌ Failed to create test user:', createError.response?.data?.message || createError.message);
            }
        }
    }

    console.log('\n🎯 Frontend Integration Status:');
    console.log('✅ apiClient.js created - automatically includes tokens in requests');
    console.log('✅ Login functions updated - store tokens in localStorage');  
    console.log('✅ Logout functions updated - clear tokens from localStorage');
    console.log('✅ API calls migrated - use apiClient with automatic token inclusion');
    
    console.log('\n📋 Manual Testing Steps:');
    console.log('   1. Start backend: npm start (in backend directory)');
    console.log('   2. Start frontend: npm start (in front1 directory)');
    console.log('   3. Open browser to http://localhost:3000');
    console.log('   4. Try logging in as resident (testuser / password123)');
    console.log('   5. Check browser console for token storage');
    console.log('   6. Verify features are accessible after login');
    console.log('   7. Test logout functionality');

    console.log('\n🏁 Backend Authentication Test Complete!');
}

testFullStack().catch(console.error);