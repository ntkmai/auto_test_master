/**
 * Quick test script for demo-form.html
 * Run: npm run dev -- file:///[full-path]/demo-form.html
 */

import { WebTester } from './src/webTester';
import * as path from 'path';

async function testDemoForm() {
  // Get absolute path to demo-form.html
  const demoPath = path.join(__dirname, 'demo-form.html').replace(/\\/g, '/');
  const fileUrl = `file:///${demoPath}`;

  console.log('=====================================');
  console.log('🧪 Testing Demo Form');
  console.log('=====================================\n');
  console.log('📂 File:', fileUrl);
  console.log('');

  const tester = new WebTester({
    url: fileUrl,
    headless: false,
    outputDir: './output/demo',
    timeout: 30000
  });

  try {
    const result = await tester.run();

    console.log('\n=====================================');
    console.log('✨ Test Complete!');
    console.log('=====================================\n');

    // Summary
    console.log('📊 Summary:\n');
    result.forms.forEach((formData, index) => {
      console.log(`Form ${index + 1}: ${formData.form.formName || formData.form.formId || 'Unnamed'}`);
      console.log(`  - Fields: ${formData.form.fields.length}`);
      console.log(`  - Required: ${formData.form.fields.filter(f => f.required).length}`);
      console.log(`  - Optional: ${formData.form.fields.filter(f => !f.required).length}`);

      const withSamples = formData.sampleData.filter(f => f.sampleValues && f.sampleValues.length > 0);
      console.log(`  - Fields with samples: ${withSamples.length}`);
      console.log('');
    });

    console.log('📁 Output saved to: ./output/demo/\n');
    console.log('Files created:');
    console.log('  ✓ analysis-result.json');
    console.log('  ✓ TypeScript interfaces (.interface.ts)');
    console.log('  ✓ Sample data reports (-samples.md)');
    console.log('  ✓ SUMMARY.md');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the test
testDemoForm();
