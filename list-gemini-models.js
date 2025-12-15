// List available Gemini models
const API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
const API_URL = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

async function listModels() {
  console.log('🔍 Listing available Gemini models...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response Status:', response.status, response.statusText);
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:');
      console.error(errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.error('\n📋 Parsed Error:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch (e) {}

      return;
    }

    const data = await response.json();

    console.log('✅ Available Models:\n');

    if (data.models && data.models.length > 0) {
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods ? model.supportedGenerationMethods.join(', ') : 'N/A'}`);
        console.log('');
      });

      console.log('\n📝 Summary:');
      console.log(`Total models: ${data.models.length}`);

      const generateContentModels = data.models.filter(m =>
        m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
      );

      console.log(`Models supporting generateContent: ${generateContentModels.length}`);

      if (generateContentModels.length > 0) {
        console.log('\n✨ Recommended models for testing:');
        generateContentModels.slice(0, 3).forEach(m => {
          console.log(`   - ${m.name}`);
        });
      }
    } else {
      console.log('No models found.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

console.log('=====================================');
console.log('📋 Gemini Models List');
console.log('=====================================\n');

listModels();
