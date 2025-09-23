const axios = require('axios');

async function debugAndFixEmployeeJobs() {
    try {
        console.log('🔍 Debugging Employees and Job Assignments...');
        
        // Login as manager to access all data
        const managerLogin = await axios.post('http://localhost:2025/api/manager/login', {
            username: 'MAN841',
            password: 'manager123'
        });
        
        const authToken = managerLogin.data.token;
        
        // Get all employees
        const employeesResponse = await axios.get('http://localhost:2025/api/employee', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('👥 Available Employees:');
        employeesResponse.data.forEach((emp, index) => {
            console.log(`  Employee ${index + 1}:`);
            console.log(`    - ID: ${emp._id}`);
            console.log(`    - Username: ${emp.username}`);
            console.log(`    - Name: ${emp.firstName} ${emp.lastName}`);
        });
        
        // Get all jobs
        const jobsResponse = await axios.get('http://localhost:2025/api/job', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const jobs = jobsResponse.data.jobs;
        const targetEmployeeId = '68d254ea475409b8064f3f0e'; // EMP154
        
        console.log('\n📋 Current Job Assignments:');
        jobs.forEach((job, index) => {
            console.log(`  Job ${index + 1}: ${job._id}`);
            console.log(`    - Status: ${job.status}`);
            console.log(`    - Assigned to: ${job.employee || 'Unassigned'}`);
            console.log(`    - Resident: ${job.resident}`);
        });
        
        // Find an unassigned job or reassign an existing one
        const unassignedJobs = jobs.filter(job => !job.employee || job.employee === '');
        const assignedJobs = jobs.filter(job => job.employee && job.status !== 'Complete');
        
        if (unassignedJobs.length > 0) {
            console.log('\n🎯 Assigning unassigned job to EMP154...');
            const jobToAssign = unassignedJobs[0];
            
            const updateResponse = await axios.put(`http://localhost:2025/api/job/${jobToAssign._id}`, {
                employee: targetEmployeeId,
                status: 'Assigned'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log(`✅ Job ${jobToAssign._id} assigned to EMP154`);
        } else if (assignedJobs.length > 0) {
            console.log('\n🎯 Reassigning an existing job to EMP154...');
            const jobToReassign = assignedJobs[0];
            
            const updateResponse = await axios.put(`http://localhost:2025/api/job/${jobToReassign._id}`, {
                employee: targetEmployeeId,
                status: 'Assigned'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            console.log(`✅ Job ${jobToReassign._id} reassigned to EMP154`);
        }
        
        // Verify the assignment
        console.log('\n✅ Verifying job assignment...');
        const updatedJobsResponse = await axios.get('http://localhost:2025/api/job', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const emp154Jobs = updatedJobsResponse.data.jobs.filter(job => job.employee === targetEmployeeId);
        console.log(`📊 EMP154 now has ${emp154Jobs.length} job(s) assigned`);
        
        emp154Jobs.forEach((job, index) => {
            console.log(`  Job ${index + 1}: ${job._id} - Status: ${job.status}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

debugAndFixEmployeeJobs();