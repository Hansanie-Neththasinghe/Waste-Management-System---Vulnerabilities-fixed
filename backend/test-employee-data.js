const axios = require('axios');

async function testEmployeeData() {
    try {
        console.log('Testing Employee Data Access...');
        
        // Login as employee
        const loginResponse = await axios.post('http://localhost:2025/api/employee/login', {
            username: 'EMP154',
            password: 'employee123'
        });
        
        const authToken = loginResponse.data.token;
        console.log('✅ Employee login successful');
        
        // Get available waste bins to see actual IDs
        try {
            const wastebinsResponse = await axios.get('http://localhost:2025/api/wastebin', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Available wastebins:', wastebinsResponse.data.wasteBins?.slice(0, 3).map(bin => ({ binID: bin.binID, type: bin.binType, weight: bin.currentWeight })));
        } catch (error) {
            console.log('❌ Wastebins access failed:', error.response?.data?.message || error.message);
        }
        
        // Get jobs to see what employee can access
        try {
            const jobsResponse = await axios.get('http://localhost:2025/api/job', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Available jobs for employee:', jobsResponse.data.jobs?.slice(0, 2).map(job => ({ id: job._id, status: job.status, employee: job.employee })));
        } catch (error) {
            console.log('❌ Jobs access failed:', error.response?.data?.message || error.message);
        }
        
        // Check resident data access
        try {
            const residentsResponse = await axios.get('http://localhost:2025/api/resident', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('❌ Resident access should fail for employees (this indicates route needs server restart)');
        } catch (error) {
            console.log('✅ Resident access properly restricted:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing employee data access:', error.response?.data || error.message);
    }
}

testEmployeeData();