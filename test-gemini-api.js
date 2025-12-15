// Test Gemini API
const API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
const MODEL = 'gemini-2.5-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API...\n');
  console.log('API URL:', API_URL.replace(API_KEY, 'API_KEY'));
  console.log('Model:', MODEL);
  console.log('');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Hello, Gemini API is working!" in one sentence.'
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 100
        }
      })
    });

    console.log('📡 Response Status:', response.status, response.statusText);
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
    console.log('✅ Success! Full API Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    if (data.candidates && data.candidates[0]) {
      const content = data.candidates[0].content.parts[0].text;
      console.log('💬 AI Message:', content);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error:', error);
  }
}

console.log('=====================================');
console.log('🤖 Gemini API Test Script');
console.log('=====================================\n');

testGeminiAPI();
