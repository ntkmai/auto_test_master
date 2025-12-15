import { WebTester } from './webTester';

async function main() {
  // Example usage
  const url = process.argv[2] || 'https://www.example.com';

  console.log('=====================================');
  console.log('🧪 Web Black Box Testing Tool');
  console.log('=====================================\n');

  const tester = new WebTester({
    url: url,
    headless: false, // Set to true for headless mode
    outputDir: './output',
    timeout: 30000
  });

  try {
    const result = await tester.run();

    console.log('\n=====================================');
    console.log('✨ Analysis Complete!');
    console.log('=====================================');
    console.log(`\n📊 Results:`);
    console.log(`   - Total forms found: ${result.forms.length}`);
    console.log(`   - Output directory: ./output`);
    console.log(`\nCheck the output folder for:`);
    console.log(`   - analysis-result.json (complete data)`);
    console.log(`   - *.interface.ts (TypeScript interfaces)`);
    console.log(`   - *-samples.md (sample data reports)`);
    console.log(`   - SUMMARY.md (overview)`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { WebTester } from './webTester';
export * from './types';
