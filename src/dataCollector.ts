import { Page } from 'puppeteer';
import { FieldSampleData, SelectOption } from './types';

export class DataCollector {

  async collectSampleData(page: Page, fieldSelectors: string[]): Promise<FieldSampleData[]> {
    const sampleData = await page.evaluate((selectors) => {
      const results: any[] = [];

      // Helper function to find radio label
      function findRadioLabel(radioElement: HTMLInputElement): string | null {
        const id = radioElement.id;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) {
            return label.textContent?.trim() || null;
          }
        }

        let parent = radioElement.parentElement;
        if (parent && parent.tagName.toLowerCase() === 'label') {
          const clone = parent.cloneNode(true) as HTMLElement;
          const input = clone.querySelector('input');
          if (input) input.remove();
          return clone.textContent?.trim() || null;
        }

        const nextSibling = radioElement.nextElementSibling;
        if (nextSibling && nextSibling.tagName.toLowerCase() === 'label') {
          return nextSibling.textContent?.trim() || null;
        }

        return null;
      }

      selectors.forEach(selector => {
        try {
          const element = document.querySelector(selector) as HTMLElement;
          if (!element) return;

          const tagName = element.tagName.toLowerCase();
          const type = (element as HTMLInputElement).type || tagName;

          const fieldData: any = {
            key: (element as HTMLInputElement).name || (element as HTMLInputElement).id || selector,
            type: type,
            selector: selector
          };

          // Handle SELECT elements
          if (tagName === 'select') {
            const selectElement = element as HTMLSelectElement;
            const options: any[] = [];

            Array.from(selectElement.options).forEach(option => {
              options.push({
                value: option.value,
                text: option.text.trim()
              });
            });

            fieldData.sampleValues = options;
          }

          // Handle RADIO buttons
          else if (type === 'radio') {
            const name = (element as HTMLInputElement).name;
            if (name) {
              const radioButtons = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
              const options: any[] = [];

              radioButtons.forEach((radio: any) => {
                options.push({
                  value: radio.value,
                  text: findRadioLabel(radio) || radio.value
                });
              });

              fieldData.sampleValues = options;
            }
          }

          // Handle CHECKBOX
          else if (type === 'checkbox') {
            const checkboxElement = element as HTMLInputElement;
            fieldData.checked = checkboxElement.checked;
            fieldData.sampleValues = [
              { value: 'true', text: 'Checked' },
              { value: 'false', text: 'Unchecked' }
            ];
          }

          // Handle DATALIST
          else if ((element as HTMLInputElement).list) {
            const datalistId = (element as HTMLInputElement).list?.id;
            if (datalistId) {
              const datalist = document.getElementById(datalistId);
              if (datalist) {
                const options: any[] = [];
                datalist.querySelectorAll('option').forEach(option => {
                  options.push({
                    value: option.value,
                    text: option.text || option.value
                  });
                });
                fieldData.sampleValues = options;
              }
            }
          }

          results.push(fieldData);
        } catch (error) {
          console.error(`Error collecting data for selector: ${selector}`, error);
        }
      });

      return results;
    }, fieldSelectors);

    return sampleData;
  }

  generateSampleDataReport(sampleData: FieldSampleData[]): string {
    let report = '# Sample Data Report\n\n';

    sampleData.forEach(field => {
      report += `## Field: ${field.key}\n`;
      report += `- Type: ${field.type}\n`;
      report += `- Selector: \`${field.selector}\`\n`;

      if (field.sampleValues && field.sampleValues.length > 0) {
        report += '- Available Options:\n';
        field.sampleValues.forEach(option => {
          report += `  - **${option.text}**: \`${option.value}\`\n`;
        });
      }

      if (field.checked !== undefined) {
        report += `- Current State: ${field.checked ? 'Checked' : 'Unchecked'}\n`;
      }

      report += '\n';
    });

    return report;
  }
}
