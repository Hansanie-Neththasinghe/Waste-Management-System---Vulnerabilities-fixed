const axios = require('axios');

async function testEmployeePermissions() {
    try {
        console.log('Testing Employee Permissions...');
        
        // Login as employee
        const loginResponse = await axios.post('http://localhost:2025/api/employee/login', {
            username: 'EMP154',
            password: 'employee123'
        });
        
        const authToken = loginResponse.data.token;
        const employeeId = loginResponse.data.data._id;
        console.log('✅ Employee login successful');
        
        // Test job update (completing a job)
        try {
            // First get a job to test with
            const jobsResponse = await axios.get('http://localhost:2025/api/job', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (jobsResponse.data.jobs.length > 0) {
                const testJobId = jobsResponse.data.jobs[0]._id;
                
                const updateResponse = await axios.put(`http://localhost:2025/api/job/${testJobId}`, 
                    { status: 'In Progress' }, 
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                console.log('✅ Job update successful - Employee can update jobs');
            } else {
                console.log('⚠️  No jobs available to test update');
            }
        } catch (error) {
            console.log('❌ Job update failed:', error.response?.data?.message || error.message);
        }
        
        // Test wastebin weight update
        try {
            const wastebinResponse = await axios.put('http://localhost:2025/api/wastebin/weight/BIN001/', 
                { newWeight: 5 }, 
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            console.log('✅ Wastebin weight update successful');
        } catch (error) {
            console.log('❌ Wastebin weight update failed:', error.response?.data?.message || error.message);
        }
        
        // Test resident points update
        try {
            // Get a resident to test with
            const residentsResponse = await axios.get('http://localhost:2025/api/resident', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (residentsResponse.data.length > 0) {
                const testResidentId = residentsResponse.data[0]._id;
                const currentPoints = residentsResponse.data[0].totalPoints || 0;
                
                const updateResponse = await axios.put(`http://localhost:2025/api/resident/${testResidentId}`, 
                    { totalPoints: currentPoints + 1 }, 
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                console.log('✅ Resident points update successful');
            } else {
                console.log('⚠️  No residents available to test update');
            }
        } catch (error) {
            console.log('❌ Resident points update failed:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing employee permissions:', error.response?.data || error.message);
    }
}

testEmployeePermissions();