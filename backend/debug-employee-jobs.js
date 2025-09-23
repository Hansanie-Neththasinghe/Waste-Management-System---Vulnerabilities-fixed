const axios = require('axios');

async function debugEmployeeJobs() {
    try {
        console.log('🔍 Debugging Employee Jobs Display...');
        
        // Login as employee
        const loginResponse = await axios.post('http://localhost:2025/api/employee/login', {
            username: 'EMP154',
            password: 'employee123'
        });
        
        const authToken = loginResponse.data.token;
        const employee = loginResponse.data.data;
        
        console.log('✅ Employee logged in:');
        console.log('  - ID:', employee._id);
        console.log('  - Username:', employee.username);
        console.log('  - Name:', employee.firstName, employee.lastName);
        
        // Get all jobs to see what's available
        const jobsResponse = await axios.get('http://localhost:2025/api/job', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const allJobs = jobsResponse.data.jobs;
        console.log('\n📋 All available jobs:');
        console.log('  - Total jobs:', allJobs.length);
        
        // Show first few jobs with their details
        allJobs.slice(0, 3).forEach((job, index) => {
            console.log(`  Job ${index + 1}:`);
            console.log(`    - ID: ${job._id}`);
            console.log(`    - Status: ${job.status}`);
            console.log(`    - Employee assigned: ${job.employee || 'None'}`);
            console.log(`    - Resident: ${job.resident}`);
            console.log(`    - Date: ${job.date}`);
        });
        
        // Filter jobs for this specific employee
        const assignedJobs = allJobs.filter(job => job.employee === employee._id && job.status !== 'Complete');
        console.log('\n🎯 Jobs assigned to this employee:');
        console.log('  - Assigned jobs count:', assignedJobs.length);
        
        if (assignedJobs.length === 0) {
            console.log('  ⚠️  No jobs assigned to this employee!');
            
            // Check if there are any jobs assigned to this employee (including completed)
            const allAssignedJobs = allJobs.filter(job => job.employee === employee._id);
            console.log('  - Total jobs (including completed):', allAssignedJobs.length);
            
            // Check if there are unassigned jobs
            const unassignedJobs = allJobs.filter(job => !job.employee || job.employee === '');
            console.log('  - Unassigned jobs:', unassignedJobs.length);
        } else {
            assignedJobs.forEach((job, index) => {
                console.log(`  Assigned Job ${index + 1}:`);
                console.log(`    - ID: ${job._id}`);
                console.log(`    - Status: ${job.status}`);
                console.log(`    - Date: ${job.date}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error debugging employee jobs:', error.response?.data || error.message);
    }
}

debugEmployeeJobs();