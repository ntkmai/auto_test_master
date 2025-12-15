// Test Grok API
const API_KEY = process.env.GROK_API_KEY || 'your-grok-api-key-here';
const API_URL = 'https://api.x.ai/v1/chat/completions';

async function testGrokAPI() {
  console.log('🔍 Testing Grok API...\n');
  console.log('API URL:', API_URL);
  console.log('API Key:', API_KEY.substring(0, 20) + '...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say "Hello, API is working!" in one sentence.'
          }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0
      })
    });

    console.log('📡 Response Status:', response.status, response.statusText);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response Body:');
      console.error(errorText);
      console.error('');

      // Try to parse as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.error('📋 Parsed Error:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error('(Error response is not JSON)');
      }

      return;
    }

    const data = await response.json();
    console.log('✅ Success! API Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    console.log('💬 AI Message:', data.choices[0].message.content);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error:', error);
  }
}

console.log('=====================================');
console.log('🤖 Grok API Test Script');
console.log('=====================================\n');

testGrokAPI();
