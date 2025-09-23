const axios = require('axios');

async function testManagerReportAccess() {
    try {
        console.log('Testing Manager Report Access...');
        
        // First login as manager to get token
        const loginResponse = await axios.post('http://localhost:2025/api/manager/login', {
            username: 'MAN841',
            password: 'manager123'
        });
        
        const authToken = loginResponse.data.token;
        console.log('✅ Manager login successful, token received');
        
        // Test all report endpoints that the manager components use
        console.log('\nTesting Report Endpoints:');
        
        // 1. Residents endpoint
        try {
            const residentsResponse = await axios.get('http://localhost:2025/api/resident', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Residents endpoint - Count:', residentsResponse.data.length);
        } catch (error) {
            console.log('❌ Residents endpoint failed:', error.response?.data?.message || error.message);
        }
        
        // 2. Employees endpoint
        try {
            const employeesResponse = await axios.get('http://localhost:2025/api/employee', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Employees endpoint - Count:', employeesResponse.data.length);
        } catch (error) {
            console.log('❌ Employees endpoint failed:', error.response?.data?.message || error.message);
        }
        
        // 3. Wastebins endpoint
        try {
            const wastebinsResponse = await axios.get('http://localhost:2025/api/wastebin', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Wastebins endpoint - Count:', wastebinsResponse.data.wasteBins?.length || 0);
        } catch (error) {
            console.log('❌ Wastebins endpoint failed:', error.response?.data?.message || error.message);
        }
        
        // 4. Transactions endpoint  
        try {
            const transactionsResponse = await axios.get('http://localhost:2025/api/transaction', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Transactions endpoint - Count:', transactionsResponse.data.length);
        } catch (error) {
            console.log('❌ Transactions endpoint failed:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing manager report access:', error.response?.data || error.message);
    }
}

testManagerReportAccess();