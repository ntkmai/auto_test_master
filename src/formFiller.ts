import { Page } from 'puppeteer';
import { FieldInfo } from './types';

export interface FillResult {
  success: boolean;
  filledFields: string[];
  errors: Array<{ field: string; error: string }>;
  screenshot?: string;
}

export class FormFiller {

  async fillForm(page: Page, fields: FieldInfo[], payload: Record<string, any>, skipPassword: boolean = true): Promise<FillResult> {
    const result: FillResult = {
      success: true,
      filledFields: [],
      errors: []
    };

    // Wait a bit to ensure page is stable
    await new Promise(resolve => setTimeout(resolve, 500));

    for (const field of fields) {
      const value = payload[field.key];

      if (value === undefined || value === null) {
        continue; // Skip if no value provided
      }

      // Skip password fields (let user fill manually)
      if (skipPassword && field.type === 'password') {
        console.log(`   ⏩ Skipping password field: ${field.key} (để người dùng tự nhập)`);
        continue;
      }

      try {
        await this.fillField(page, field, value);
        result.filledFields.push(field.key);
      } catch (error: any) {
        result.success = false;
        result.errors.push({
          field: field.key,
          error: error.message
        });
      }
    }

    return result;
  }

  private async fillField(page: Page, field: FieldInfo, value: any): Promise<void> {
    const selector = field.selector;

    try {
      // Wait for element
      await page.waitForSelector(selector, { timeout: 5000 });

      // Handle different field types
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'url':
        case 'number':
        case 'date':
        case 'datetime-local':
        case 'time':
          // Set value directly via JavaScript to avoid append issues
          await page.evaluate((sel, val) => {
            const element = document.querySelector(sel) as HTMLInputElement;
            if (element) {
              // Clear first
              element.value = '';
              
              // Wait a tick
              setTimeout(() => {
                // Set new value
                element.value = val;
                
                // Trigger events to notify frameworks (React, Vue, etc.)
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              }, 10);
            }
          }, selector, String(value));
          
          // Wait for value to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          break;

        case 'textarea':
          // Set value directly via JavaScript
          await page.evaluate((sel, val) => {
            const element = document.querySelector(sel) as HTMLTextAreaElement;
            if (element) {
              element.value = '';
              setTimeout(() => {
                element.value = val;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              }, 10);
            }
          }, selector, String(value));
          
          await new Promise(resolve => setTimeout(resolve, 100));
          break;

        case 'select':
          await page.select(selector, String(value));
          break;

        case 'checkbox':
          const isChecked = await page.$eval(selector, (el: any) => el.checked);
          const shouldCheck = Boolean(value);
          if (isChecked !== shouldCheck) {
            await page.click(selector);
          }
          break;

        case 'radio':
          await page.evaluate((sel, val) => {
            const name = document.querySelector(sel)?.getAttribute('name');
            if (name) {
              const radio = document.querySelector(`input[name="${name}"][value="${val}"]`) as HTMLInputElement;
              if (radio) radio.click();
            }
          }, selector, value);
          break;

        case 'file':
          // For file inputs, value should be a file path
          const fileInput = await page.$(selector) as any;
          if (fileInput && fileInput.uploadFile) {
            await fileInput.uploadFile(String(value));
          }
          break;

        default:
          // Try to type as fallback
          await page.type(selector, String(value));
      }

      // Wait a bit for any JS validation
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error: any) {
      throw new Error(`Failed to fill ${field.key}: ${error.message}`);
    }
  }

  async submitForm(page: Page, formSelector: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to find submit button
      const submitButton = await page.$(
        `${formSelector} button[type="submit"], ${formSelector} input[type="submit"]`
      );

      if (submitButton) {
        await submitButton.click();

        // Wait for navigation or response
        await Promise.race([
          page.waitForNavigation({ timeout: 10000 }),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]).catch(() => {});

        return { success: true };
      } else {
        // Try to submit form directly
        await page.evaluate((sel) => {
          const form = document.querySelector(sel) as HTMLFormElement;
          if (form) form.submit();
        }, formSelector);

        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFormValidationErrors(page: Page): Promise<string[]> {
    try {
      // Check if page is still valid
      if (page.isClosed()) {
        console.log('⚠️ Page is closed, cannot get validation errors');
        return [];
      }

      const errors = await page.evaluate(() => {
        const errorMessages: string[] = [];

        // Check HTML5 validation messages
        const invalidInputs = document.querySelectorAll('input:invalid, select:invalid, textarea:invalid');
        invalidInputs.forEach((input: any) => {
          if (input.validationMessage) {
            errorMessages.push(`${input.name || input.id}: ${input.validationMessage}`);
          }
        });

        // Check for common error message elements
        const errorElements = document.querySelectorAll('.error, .error-message, .invalid-feedback, [role="alert"]');
        errorElements.forEach((el: any) => {
        const text = el.textContent?.trim();
        if (text) errorMessages.push(text);
      });

      return errorMessages;
    });

    return errors;
    } catch (error: any) {
      console.log(`⚠️ Could not get validation errors: ${error.message}`);
      return [];
    }
  }

  async takeScreenshot(page: Page): Promise<string> {
    const screenshot = await page.screenshot({
      encoding: 'base64',
      fullPage: false
    });

    return screenshot;
  }

  async clearForm(page: Page, fields: FieldInfo[]): Promise<void> {
    for (const field of fields) {
      try {
        const selector = field.selector;

        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'tel':
          case 'url':
          case 'number':
          case 'date':
          case 'textarea':
            await page.evaluate((sel) => {
              const el = document.querySelector(sel) as HTMLInputElement;
              if (el) el.value = '';
            }, selector);
            break;

          case 'checkbox':
            await page.evaluate((sel) => {
              const el = document.querySelector(sel) as HTMLInputElement;
              if (el) el.checked = false;
            }, selector);
            break;

          case 'select':
            await page.evaluate((sel) => {
              const el = document.querySelector(sel) as HTMLSelectElement;
              if (el) el.selectedIndex = 0;
            }, selector);
            break;
        }
      } catch (error) {
        // Continue even if clearing fails
        console.warn(`Failed to clear ${field.key}`);
      }
    }
  }
}
