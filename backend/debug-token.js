const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:2025/api';

async function debugToken() {
    console.log('🔍 Debugging JWT Token and Transaction Access...\n');

    try {
        // Login as resident
        const loginResponse = await axios.post(`${BASE_URL}/resident/login`, {
            username: 'testuser',
            password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('🔑 Token received:', token ? 'Yes' : 'No');
        
        if (token) {
            // Decode token to see what's inside
            try {
                const decoded = jwt.decode(token);
                console.log('📋 Token contents:', {
                    id: decoded.id,
                    username: decoded.username,
                    role: decoded.role,
                    exp: new Date(decoded.exp * 1000),
                    iat: new Date(decoded.iat * 1000)
                });
                
                // Test if token is valid by making a simple authenticated request
                console.log('\n🧪 Testing token with a simple authenticated endpoint...');
                try {
                    const testResponse = await axios.get(`${BASE_URL}/resident/${decoded.username}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log('✅ Token is valid - simple endpoint works');
                } catch (error) {
                    console.log('❌ Token validation failed:', error.response?.data?.message || error.message);
                }
                
                // Now test transaction endpoint specifically
                console.log('\n🗃️ Testing transaction endpoint...');
                try {
                    const transactionResponse = await axios.get(`${BASE_URL}/transaction`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log('✅ Transaction endpoint works!');
                    console.log('   - Transactions found:', transactionResponse.data.length);
                } catch (error) {
                    console.log('❌ Transaction endpoint failed:', error.response?.data?.message || error.message);
                    console.log('   - Status:', error.response?.status);
                    console.log('   - Response headers:', error.response?.headers);
                }
                
            } catch (decodeError) {
                console.log('❌ Failed to decode token:', decodeError.message);
            }
        }

    } catch (error) {
        console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }
}

debugToken().catch(console.error);