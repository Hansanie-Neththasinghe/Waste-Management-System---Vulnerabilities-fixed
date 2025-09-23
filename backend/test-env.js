// Test environment variable loading
require('dotenv').config({ path: './.env' });

console.log('Testing environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Test if we can create a simple passport strategy
try {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        console.log('\n✅ Google OAuth credentials are available');
        console.log('Client ID length:', process.env.GOOGLE_CLIENT_ID.length);
        console.log('Client Secret length:', process.env.GOOGLE_CLIENT_SECRET.length);
    } else {
        console.log('\n❌ Google OAuth credentials missing');
        console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || 'undefined');
        console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET || 'undefined');
    }
} catch (error) {
    console.error('Error testing OAuth credentials:', error.message);
}