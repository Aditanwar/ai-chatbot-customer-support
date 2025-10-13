require('dotenv').config();

console.log('🔍 Validating API Configuration...\n');

// Check if .env file exists and is loaded
console.log('📁 Environment Variables:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Present' : '❌ Missing');
console.log('PORT:', process.env.PORT || '3001 (default)');

// Check API key format
if (process.env.GEMINI_API_KEY) {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('\n🔑 API Key Analysis:');
  console.log('Length:', apiKey.length);
  console.log('Starts with AIza:', apiKey.startsWith('AIza') ? '✅ Yes' : '❌ No');
  console.log('Format looks correct:', /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey) ? '✅ Yes' : '❌ No');
}

console.log('\n🚀 Server should be running on: http://localhost:3001');
console.log('💡 If you still get errors, the API key might be invalid or have quota issues.');
