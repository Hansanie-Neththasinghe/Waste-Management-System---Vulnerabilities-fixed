const axios = require('axios');

async function testManagerLogin() {
    try {
        console.log('Testing Manager Login...');
        
        const response = await axios.post('http://localhost:2025/api/manager/login', {
            username: 'MAN841',
            password: 'manager123'
        });
        
        console.log('✅ Manager login successful!');
        console.log('Manager Data:', {
            id: response.data.manager._id,
            username: response.data.manager.username,
            firstName: response.data.manager.firstName,
            lastName: response.data.manager.lastName,
            role: response.data.manager.role
        });
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        
        // Test accessing a manager-only endpoint
        const authToken = response.data.token;
        console.log('\nTesting Manager API Access...');
        
        const jobsResponse = await axios.get('http://localhost:2025/api/job', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Jobs endpoint accessible - Jobs count:', jobsResponse.data.jobs.length);
        
        const employeesResponse = await axios.get('http://localhost:2025/api/employee', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Employees endpoint accessible - Employees count:', employeesResponse.data.length);
        
        const residentsResponse = await axios.get('http://localhost:2025/api/resident', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Residents endpoint accessible - Residents count:', residentsResponse.data.length);
        
    } catch (error) {
        console.error('❌ Error testing manager functionality:', error.response?.data || error.message);
    }
}

testManagerLogin();