/**
 * Example: Cách sử dụng Web Black Box Testing Tool
 */

import { WebTester } from './src/webTester';

async function exampleBasic() {
  console.log('=== Example 1: Basic Usage ===\n');

  const tester = new WebTester({
    url: 'https://www.w3schools.com/html/html_forms.asp',
    headless: false,
    outputDir: './output/example1'
  });

  await tester.run();
}

async function exampleWithConfig() {
  console.log('=== Example 2: With Custom Config ===\n');

  const tester = new WebTester({
    url: 'https://demo.automationtesting.in/Register.html',
    headless: false,
    outputDir: './output/example2',
    waitForSelector: 'form', // Đợi form load xong
    timeout: 60000 // 60 seconds timeout
  });

  const result = await tester.run();

  // Xử lý kết quả
  console.log('\n=== Analysis Results ===');
  result.forms.forEach((formData, index) => {
    console.log(`\nForm ${index + 1}:`);
    console.log(`  - Total fields: ${formData.form.fields.length}`);
    console.log(`  - Required fields: ${formData.form.fields.filter(f => f.required).length}`);

    // In ra các field có sample data
    const fieldsWithSamples = formData.sampleData.filter(f => f.sampleValues && f.sampleValues.length > 0);
    console.log(`  - Fields with sample data: ${fieldsWithSamples.length}`);

    fieldsWithSamples.forEach(field => {
      console.log(`\n    ${field.key} (${field.type}):`);
      field.sampleValues?.slice(0, 3).forEach(opt => {
        console.log(`      - ${opt.text}: ${opt.value}`);
      });
    });
  });
}

async function exampleStepByStep() {
  console.log('=== Example 3: Step by Step ===\n');

  const tester = new WebTester({
    url: 'https://getbootstrap.com/docs/5.0/forms/overview/',
    headless: false,
    outputDir: './output/example3'
  });

  try {
    // Bước 1: Khởi tạo browser
    await tester.init();
    console.log('✅ Browser initialized');

    // Bước 2: Phân tích form
    const result = await tester.analyze();
    console.log(`✅ Found ${result.forms.length} forms`);

    // Bước 3: Lưu kết quả
    await tester.saveResults(result);
    console.log('✅ Results saved');

    // Bước 4: Đóng browser
    await tester.close();
    console.log('✅ Browser closed');

  } catch (error) {
    console.error('❌ Error:', error);
    await tester.close();
  }
}

// Uncomment để chạy example bạn muốn:

// exampleBasic();
// exampleWithConfig();
// exampleStepByStep();

// Hoặc chạy tất cả (tuần tự):
async function runAll() {
  console.log('🚀 Running all examples...\n');

  try {
    await exampleBasic();
    console.log('\n' + '='.repeat(50) + '\n');

    await exampleWithConfig();
    console.log('\n' + '='.repeat(50) + '\n');

    await exampleStepByStep();

    console.log('\n✨ All examples completed!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Uncomment để chạy:
// runAll();
