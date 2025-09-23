const axios = require('axios');

async function testManagerLoginFrontendStyle() {
    try {
        console.log('Testing Manager Login with correct URL...');
        
        // Simulate what the frontend apiClient does
        const apiClient = axios.create({
            baseURL: 'http://localhost:2025/api',
            timeout: 10000,
        });
        
        const response = await apiClient.post('/manager/login', {
            username: 'MAN841',
            password: 'manager123'
        });
        
        console.log('✅ Manager login successful with corrected URL!');
        console.log('Full URL used:', 'http://localhost:2025/api/manager/login');
        console.log('Manager Data:', {
            id: response.data.manager._id,
            username: response.data.manager.username,
            firstName: response.data.manager.firstName,
            lastName: response.data.manager.lastName,
            role: response.data.manager.role
        });
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        
    } catch (error) {
        console.error('❌ Error testing manager login:', error.response?.data || error.message);
    }
}

testManagerLoginFrontendStyle();