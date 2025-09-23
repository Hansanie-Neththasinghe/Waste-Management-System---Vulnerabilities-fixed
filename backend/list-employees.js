const mongoose = require('mongoose');
require('dotenv').config();

// Import Employee model
const Employee = require('./src/models/users/employee');

async function listExistingEmployees() {
    try {
        console.log('🔌 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database successfully');

        console.log('\n👷 Existing Employees in Database:');
        console.log('=====================================');
        
        const employees = await Employee.find({}, 'username firstName lastName email phoneNumber createdAt');
        
        if (employees.length === 0) {
            console.log('❌ No employees found in database');
        } else {
            employees.forEach((emp, index) => {
                console.log(`\n${index + 1}. Employee Details:`);
                console.log(`   Username: ${emp.username}`);
                console.log(`   Name: ${emp.firstName} ${emp.lastName}`);
                console.log(`   Email: ${emp.email}`);
                console.log(`   Phone: ${emp.phoneNumber}`);
                console.log(`   Created: ${emp.createdAt}`);
                console.log(`   Test Password: "employee123" or "driver123"`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
    }
}

listExistingEmployees();