const axios = require('axios');

async function testEmployeeLogin() {
    try {
        console.log('Testing Employee Login...');
        
        const response = await axios.post('http://localhost:2025/api/employee/login', {
            username: 'EMP154',
            password: 'employee123'
        });
        
        console.log('✅ Employee login successful!');
        console.log('Employee Data:', {
            id: response.data.data._id,
            username: response.data.data.username,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            role: 'employee'
        });
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        
        // Test accessing employee endpoints
        const authToken = response.data.token;
        console.log('\nTesting Employee API Access...');
        
        // Test jobs endpoint (employees should see assigned jobs)
        try {
            const jobsResponse = await axios.get('http://localhost:2025/api/job', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Jobs endpoint accessible - Jobs count:', jobsResponse.data.jobs.length);
        } catch (error) {
            console.log('❌ Jobs endpoint failed:', error.response?.data?.message || error.message);
        }
        
        // Test employee profile endpoint
        try {
            const profileResponse = await axios.get(`http://localhost:2025/api/employee/${response.data.data._id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Employee profile accessible');
        } catch (error) {
            console.log('❌ Employee profile failed:', error.response?.data?.message || error.message);
        }
        
        // Test transaction access (employees might need this)
        try {
            const transactionResponse = await axios.get('http://localhost:2025/api/transaction', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Transaction endpoint accessible - Count:', transactionResponse.data.length);
        } catch (error) {
            console.log('❌ Transaction endpoint failed:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing employee functionality:', error.response?.data || error.message);
    }
}

testEmployeeLogin();