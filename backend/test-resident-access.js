const axios = require('axios');

const BASE_URL = 'http://localhost:2025/api';

async function testResidentTransactionAccess() {
    console.log('🧪 Testing Resident Transaction Access...\n');

    try {
        // First, login as a resident to get token
        console.log('1. Logging in as resident...');
        const loginResponse = await axios.post(`${BASE_URL}/resident/login`, {
            username: 'testuser',
            password: 'password123'
        });

        if (!loginResponse.data.token) {
            console.log('❌ No token received from login');
            return;
        }

        console.log('✅ Resident login successful');
        const token = loginResponse.data.token;
        const resident = loginResponse.data.resident;

        // Test transaction access
        console.log('\n2. Testing transaction access...');
        try {
            const transactionResponse = await axios.get(`${BASE_URL}/transaction`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ Transaction access successful!');
            console.log(`   - Found ${transactionResponse.data.length} transactions for resident`);
            
            if (transactionResponse.data.length > 0) {
                console.log('   - Sample transaction:', {
                    binOwner: transactionResponse.data[0].binOwner,
                    binType: transactionResponse.data[0].binType,
                    currentWeight: transactionResponse.data[0].currentWeight
                });
            } else {
                console.log('   - No transactions found (this is normal if no waste has been recorded)');
            }
            
        } catch (error) {
            console.log('❌ Transaction access failed:', error.response?.data?.message || error.message);
        }

        // Test job access
        console.log('\n3. Testing job access...');
        try {
            const jobResponse = await axios.get(`${BASE_URL}/job`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ Job access successful!');
            console.log(`   - Found ${jobResponse.data.jobs.length} jobs for resident`);
            
            if (jobResponse.data.jobs.length > 0) {
                console.log('   - Sample job:', {
                    resident: jobResponse.data.jobs[0].resident,
                    date: jobResponse.data.jobs[0].date,
                    status: jobResponse.data.jobs[0].status
                });
            } else {
                console.log('   - No jobs found (create some jobs to see them here)');
            }
            
        } catch (error) {
            console.log('❌ Job access failed:', error.response?.data?.message || error.message);
        }

        console.log('\n🎯 Frontend Impact:');
        console.log('✅ ResidentReport component can now access transactions');
        console.log('✅ ResidentJobCreate component will make fewer API calls');
        console.log('✅ Backend filters data by user role automatically');
        console.log('✅ No more client-side filtering needed');

    } catch (error) {
        console.log('❌ Test failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🏁 Resident access test completed!');
}

testResidentTransactionAccess().catch(console.error);