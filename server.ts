import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import { WebTester } from './src/webTester';
import { GrokAI } from './src/grokAI';
import { FormFiller } from './src/formFiller';
import puppeteer, { Browser, Page } from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve output files
app.use('/output', express.static('output'));

// Store latest analysis result and test sessions
let latestResult: any = null;
let testSessions: Map<string, { browser: Browser; page: Page }> = new Map();

// Gemini AI API Key (default for testing, should be provided by client)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';

// API endpoint for analysis
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { url, headless, screenshots, waitSelector, loginCredentials, waitForLoad } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`\n🔍 Analyzing: ${url}`);
    console.log(`   Headless: ${headless || false}`);
    console.log(`   Screenshots: ${screenshots || false}`);
    console.log(`   Wait Selector: ${waitSelector || 'N/A'}`);
    console.log(`   Wait For Load: ${waitForLoad ? '10s' : 'No'}`);
    console.log(`   Requires Login: ${loginCredentials ? 'Yes' : 'No'}`);

    // Create tester instance
    const tester = new WebTester({
      url: url,
      headless: headless || false,
      outputDir: './output',
      waitForSelector: waitSelector,
      timeout: 60000,
      loginCredentials: loginCredentials, // Pass login credentials
      waitForLoad: waitForLoad || false
    });

    // Run analysis
    const result = await tester.run();

    // Store result
    latestResult = result;

    console.log(`✅ Analysis complete: ${result.forms.length} form(s) found`);

    // Return result
    res.json(result);

  } catch (error: any) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Download JSON
app.get('/api/download/json', (req: Request, res: Response) => {
  const jsonPath = path.join(__dirname, 'output', 'analysis-result.json');

  if (fs.existsSync(jsonPath)) {
    res.download(jsonPath, 'analysis-result.json');
  } else {
    res.status(404).json({ error: 'No analysis result found' });
  }
});

// Download Summary
app.get('/api/download/summary', (req: Request, res: Response) => {
  const summaryPath = path.join(__dirname, 'output', 'SUMMARY.md');

  if (fs.existsSync(summaryPath)) {
    res.download(summaryPath, 'SUMMARY.md');
  } else {
    res.status(404).json({ error: 'No summary found' });
  }
});

// Get latest result
app.get('/api/result', (req: Request, res: Response) => {
  if (latestResult) {
    res.json(latestResult);
  } else {
    res.status(404).json({ error: 'No result available' });
  }
});

// List output files
app.get('/api/files', (req: Request, res: Response) => {
  const outputDir = path.join(__dirname, 'output');

  if (!fs.existsSync(outputDir)) {
    return res.json({ files: [] });
  }

  const files = fs.readdirSync(outputDir).map(file => ({
    name: file,
    path: `/output/${file}`,
    size: fs.statSync(path.join(outputDir, file)).size,
    modified: fs.statSync(path.join(outputDir, file)).mtime
  }));

  res.json({ files });
});

// Generate test cases with Grok AI
app.post('/api/generate-tests', async (req: Request, res: Response) => {
  try {
    const { formIndex, apiKey } = req.body;

    if (!latestResult || !latestResult.forms || !latestResult.forms[formIndex]) {
      return res.status(400).json({ error: 'No form data available. Run analysis first.' });
    }

    // Use API key from request or fallback to server key
    const effectiveApiKey = apiKey || GEMINI_API_KEY;
    if (!effectiveApiKey) {
      return res.status(400).json({ error: 'API key required. Please provide Gemini API key.' });
    }

    const formData = latestResult.forms[formIndex];
    const grok = new GrokAI({ apiKey: effectiveApiKey });

    console.log(`🤖 Generating test cases with Gemini AI for form ${formIndex}...`);

    const testCases = await grok.generateTestCases(formData.form);

    console.log(`✅ Generated ${testCases.length} test cases`);

    res.json({ testCases });

  } catch (error: any) {
    console.error('❌ Test generation error:', error);
    res.status(500).json({
      error: 'Failed to generate test cases',
      message: error.message
    });
  }
});

// Generate MORE test cases (additional)
app.post('/api/generate-more-tests', async (req: Request, res: Response) => {
  try {
    const { formIndex, testTypes, apiKey } = req.body;

    if (!latestResult || !latestResult.forms || !latestResult.forms[formIndex]) {
      return res.status(400).json({ error: 'No form data available. Run analysis first.' });
    }

    if (!testTypes || !Array.isArray(testTypes) || testTypes.length === 0) {
      return res.status(400).json({ error: 'testTypes array is required' });
    }

    const effectiveApiKey = apiKey || GEMINI_API_KEY;
    if (!effectiveApiKey) {
      return res.status(400).json({ error: 'API key required.' });
    }

    const formData = latestResult.forms[formIndex];
    const grok = new GrokAI({ apiKey: effectiveApiKey });

    console.log(`🤖 Generating MORE test cases for types: ${testTypes.join(', ')}...`);

    const moreTestCases = await grok.generateMoreTestCases(formData.form, testTypes);

    console.log(`✅ Generated ${moreTestCases.length} additional test cases`);

    res.json({ testCases: moreTestCases });

  } catch (error: any) {
    console.error('❌ Generate more tests error:', error);
    res.status(500).json({
      error: 'Failed to generate more test cases',
      message: error.message
    });
  }
});

// Export prompt for manual use (fallback)
app.post('/api/export-prompt', async (req: Request, res: Response) => {
  try {
    const { formIndex } = req.body;

    if (!latestResult || !latestResult.forms || !latestResult.forms[formIndex]) {
      return res.status(400).json({ error: 'No form data available. Run analysis first.' });
    }

    const formData = latestResult.forms[formIndex];
    const grok = new GrokAI({ apiKey: GEMINI_API_KEY });

    console.log(`📝 Exporting prompt for form ${formIndex}...`);

    const prompt = grok.exportPrompt(formData.form);

    console.log(`✅ Prompt exported`);

    res.json({ prompt });

  } catch (error: any) {
    console.error('❌ Export prompt error:', error);
    res.status(500).json({
      error: 'Failed to export prompt',
      message: error.message
    });
  }
});

// Parse manual test cases (fallback)
app.post('/api/parse-testcases', async (req: Request, res: Response) => {
  try {
    const { testCasesJson } = req.body;

    if (!testCasesJson) {
      return res.status(400).json({ error: 'Test cases JSON is required' });
    }

    const grok = new GrokAI({ apiKey: GEMINI_API_KEY });

    console.log(`📋 Parsing manual test cases...`);

    const testCases = grok.parseTestCases(testCasesJson);

    console.log(`✅ Parsed ${testCases.length} test cases`);

    res.json({ testCases });

  } catch (error: any) {
    console.error('❌ Parse error:', error);
    res.status(500).json({
      error: 'Failed to parse test cases',
      message: error.message
    });
  }
});

// Execute test on form
app.post('/api/execute-test', async (req: Request, res: Response) => {
  try {
    const { url, formIndex, payload, headless } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`🧪 Executing test on: ${url}`);
    console.log(`   Form index: ${formIndex}`);
    console.log(`   Payload:`, payload);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: headless || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Get form info from latest result
    if (!latestResult || !latestResult.forms || !latestResult.forms[formIndex]) {
      await browser.close();
      return res.status(400).json({ error: 'Form not found. Run analysis first.' });
    }

    const formData = latestResult.forms[formIndex];
    const formFiller = new FormFiller();

    // Fill form
    const fillResult = await formFiller.fillForm(page, formData.form.fields, payload);

    // Wait a bit for any validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get validation errors
    const validationErrors = await formFiller.getFormValidationErrors(page);

    // Take screenshot
    const screenshot = await formFiller.takeScreenshot(page);

    // Close browser
    await browser.close();

    console.log(`✅ Test executed. Filled ${fillResult.filledFields.length} fields`);

    res.json({
      fillResult,
      validationErrors,
      screenshot: `data:image/png;base64,${screenshot}`
    });

  } catch (error: any) {
    console.error('❌ Test execution error:', error);
    res.status(500).json({
      error: 'Failed to execute test',
      message: error.message
    });
  }
});

// Fill form only (don't submit) - for manual testing
app.post('/api/fill-form-only', async (req: Request, res: Response) => {
  try {
    const { url, formIndex, payload, headless } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`📝 Filling form (no submit) on: ${url}`);
    console.log(`   Form index: ${formIndex}`);
    console.log(`   Payload:`, payload);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: headless || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for page to be fully loaded and stable
    console.log('⏳ Waiting for page to stabilize...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get form info from latest result
    if (!latestResult || !latestResult.forms || !latestResult.forms[formIndex]) {
      await browser.close();
      return res.status(400).json({ error: 'Form not found. Run analysis first.' });
    }

    const formData = latestResult.forms[formIndex];
    const formFiller = new FormFiller();

    console.log('📝 Filling form (skipping password fields)...');
    // Fill form (skip password fields, let user fill manually)
    const fillResult = await formFiller.fillForm(page, formData.form.fields, payload, true);

    // Wait a bit for any validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get validation errors (with error handling)
    let validationErrors: string[] = [];
    try {
      validationErrors = await formFiller.getFormValidationErrors(page);
    } catch (error: any) {
      console.log(`⚠️ Could not get validation errors: ${error.message}`);
    }

    // Take screenshot
    const screenshot = await formFiller.takeScreenshot(page);

    // DON'T close browser - keep it open for manual testing
    console.log(`✅ Form filled. Browser kept open for manual testing.`);
    console.log(`⚠️ Note: Browser will stay open. Close manually after testing.`);

    res.json({
      fillResult,
      validationErrors,
      screenshot: `data:image/png;base64,${screenshot}`,
      message: 'Form filled successfully. Browser kept open for manual submit.'
    });

  } catch (error: any) {
    console.error('❌ Fill form error:', error);
    res.status(500).json({
      error: 'Failed to fill form',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    aiEnabled: !!GEMINI_API_KEY
  });
});

// Serve demo-form.html
app.get('/demo-form.html', (req: Request, res: Response) => {
  const demoPath = path.join(__dirname, 'demo-form.html');
  if (fs.existsSync(demoPath)) {
    res.sendFile(demoPath);
  } else {
    res.status(404).send('Demo form not found');
  }
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('\n=====================================');
  console.log('🚀 Web Black Box Testing Tool Server');
  console.log('=====================================');
  console.log(`\n✅ Server running at: http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit the URL above`);
  console.log(`\n🧪 Test with demo form: http://localhost:${PORT}/demo-form.html`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});
