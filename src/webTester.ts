import puppeteer, { Browser, Page } from 'puppeteer';
import { FormAnalyzer } from './formAnalyzer';
import { DataCollector } from './dataCollector';
import { AnalysisResult, FormDataMap } from './types';
import * as fs from 'fs';
import * as path from 'path';

export interface WebTesterConfig {
  url: string;
  headless?: boolean;
  outputDir?: string;
  waitForSelector?: string;
  timeout?: number;
  waitForLoad?: boolean;
  loginCredentials?: {
    loginUrl: string;
    username: string;
    password: string;
  };
}

export class WebTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private formAnalyzer: FormAnalyzer;
  private dataCollector: DataCollector;
  private config: WebTesterConfig;

  constructor(config: WebTesterConfig) {
    this.config = {
      headless: false,
      outputDir: './output',
      timeout: 30000,
      ...config
    };
    this.formAnalyzer = new FormAnalyzer();
    this.dataCollector = new DataCollector();
  }

  async init(): Promise<void> {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });

    // Handle login if credentials provided
    if (this.config.loginCredentials) {
      await this.performLogin();
    }

    console.log(`🌐 Navigating to ${this.config.url}...`);
    await this.page.goto(this.config.url, {
      waitUntil: 'networkidle2',
      timeout: this.config.timeout
    });

    if (this.config.waitForSelector) {
      console.log(`⏳ Waiting for selector: ${this.config.waitForSelector}...`);
      await this.page.waitForSelector(this.config.waitForSelector, {
        timeout: this.config.timeout
      });
    }

    // Wait for form elements to load if enabled
    if (this.config.waitForLoad) {
      console.log('⏳ Waiting 10 seconds for form elements to load...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('✅ Wait complete');
    }

    console.log('✅ Page loaded successfully');
  }

  private async performLogin(): Promise<void> {
    if (!this.page || !this.config.loginCredentials) {
      return;
    }

    const { loginUrl, username, password } = this.config.loginCredentials;

    console.log('🔐 Performing login...');
    console.log(`   Login URL: ${loginUrl}`);
    console.log(`   Username: ${username}`);

    try {
      // Navigate to login page
      await this.page.goto(loginUrl, {
        waitUntil: 'networkidle2',
        timeout: this.config.timeout
      });

      // Wait a bit for page to fully load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to find and fill login form
      // Look for common username/email field patterns
      const usernameSelectors = [
        'input[name="username"]',
        'input[name="email"]',
        'input[name="user"]',
        'input[name="login"]',
        'input[type="text"]',
        'input[type="email"]',
        '#username',
        '#email',
        '#user',
        '#login'
      ];

      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        '#password',
        '#pass'
      ];

      // Fill username
      let usernameFilled = false;
      for (const selector of usernameSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            await element.type(username);
            console.log(`   ✓ Username filled (${selector})`);
            usernameFilled = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!usernameFilled) {
        throw new Error('Could not find username field');
      }

      // Fill password
      let passwordFilled = false;
      for (const selector of passwordSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            await element.type(password);
            console.log(`   ✓ Password filled (${selector})`);
            passwordFilled = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!passwordFilled) {
        throw new Error('Could not find password field');
      }

      // Find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Login")',
        'button:contains("Sign in")',
        'button:contains("Đăng nhập")',
        '.login-button',
        '.submit-button',
        '#login-button',
        '#submit'
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            await element.click();
            console.log(`   ✓ Submit clicked (${selector})`);
            submitted = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!submitted) {
        // Try pressing Enter as fallback
        await this.page.keyboard.press('Enter');
        console.log(`   ✓ Enter pressed (fallback)`);
      }

      // Wait for navigation after login
      await this.page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: this.config.timeout
      }).catch(() => {
        console.log('   ⚠️ No navigation after login (might be already logged in or AJAX login)');
      });

      // Wait a bit to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Login completed successfully');

    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async analyze(): Promise<AnalysisResult> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    console.log('🔍 Analyzing forms on the page...');
    const forms = await this.formAnalyzer.analyzeForms(this.page);
    console.log(`📋 Found ${forms.length} form(s)`);

    const formDataMaps: FormDataMap[] = [];

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      console.log(`\n📝 Analyzing form ${i + 1}/${forms.length}...`);
      console.log(`   Form ID: ${form.formId || 'N/A'}`);
      console.log(`   Fields: ${form.fields.length}`);

      const fieldSelectors = form.fields.map(f => f.selector);
      const sampleData = await this.dataCollector.collectSampleData(this.page, fieldSelectors);

      formDataMaps.push({
        form,
        sampleData
      });
    }

    const result: AnalysisResult = {
      url: this.config.url,
      timestamp: new Date().toISOString(),
      forms: formDataMaps
    };

    return result;
  }

  async saveResults(result: AnalysisResult): Promise<void> {
    const outputDir = this.config.outputDir!;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save JSON result
    const jsonPath = path.join(outputDir, 'analysis-result.json');
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`\n💾 Saved JSON result: ${jsonPath}`);

    // Generate and save TypeScript interfaces
    result.forms.forEach((formData, index) => {
      const interfaceName = formData.form.formId
        ? `${this.toPascalCase(formData.form.formId)}Form`
        : `Form${index + 1}Data`;

      const tsInterface = this.formAnalyzer.generateTypeScriptInterface(
        formData.form,
        interfaceName
      );

      const tsPath = path.join(outputDir, `${interfaceName}.interface.ts`);
      fs.writeFileSync(tsPath, tsInterface);
      console.log(`💾 Saved TypeScript interface: ${tsPath}`);
    });

    // Generate and save sample data report
    result.forms.forEach((formData, index) => {
      const formName = formData.form.formId || `form-${index + 1}`;
      const reportPath = path.join(outputDir, `${formName}-samples.md`);

      const report = this.dataCollector.generateSampleDataReport(formData.sampleData);
      fs.writeFileSync(reportPath, report);
      console.log(`💾 Saved sample data report: ${reportPath}`);
    });

    // Generate summary
    this.generateSummary(result, outputDir);
  }

  private generateSummary(result: AnalysisResult, outputDir: string): void {
    let summary = '# Web Form Analysis Summary\n\n';
    summary += `**URL:** ${result.url}\n`;
    summary += `**Timestamp:** ${result.timestamp}\n`;
    summary += `**Total Forms:** ${result.forms.length}\n\n`;

    result.forms.forEach((formData, index) => {
      summary += `## Form ${index + 1}\n`;
      summary += `- **ID:** ${formData.form.formId || 'N/A'}\n`;
      summary += `- **Name:** ${formData.form.formName || 'N/A'}\n`;
      summary += `- **Action:** ${formData.form.action || 'N/A'}\n`;
      summary += `- **Method:** ${formData.form.method || 'N/A'}\n`;
      summary += `- **Total Fields:** ${formData.form.fields.length}\n`;
      summary += `- **Required Fields:** ${formData.form.fields.filter(f => f.required).length}\n\n`;

      summary += '### Fields:\n';
      formData.form.fields.forEach(field => {
        const req = field.required ? '**[Required]**' : '[Optional]';
        summary += `- ${req} **${field.key}** (${field.type})`;
        if (field.label) {
          summary += ` - "${field.label}"`;
        }
        summary += '\n';
      });
      summary += '\n';
    });

    const summaryPath = path.join(outputDir, 'SUMMARY.md');
    fs.writeFileSync(summaryPath, summary);
    console.log(`💾 Saved summary: ${summaryPath}`);
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, chr => chr.toUpperCase());
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('\n👋 Browser closed');
    }
  }

  async run(): Promise<AnalysisResult> {
    try {
      await this.init();
      const result = await this.analyze();
      await this.saveResults(result);
      return result;
    } finally {
      await this.close();
    }
  }
}
