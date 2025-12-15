import { Page } from 'puppeteer';
import { FormMap, FieldInfo } from './types';

export class FormAnalyzer {

  async analyzeForms(page: Page): Promise<FormMap[]> {
    const forms = await page.evaluate(() => {
      const formElements = document.querySelectorAll('form');
      const results: any[] = [];

      // Helper function to generate selector
      function generateSelector(element: Element): string {
        if (element.id) {
          return `#${element.id}`;
        }

        if (element.getAttribute('name')) {
          const tagName = element.tagName.toLowerCase();
          const name = element.getAttribute('name');
          return `${tagName}[name="${name}"]`;
        }

        const parent = element.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(element) + 1;
          return `${element.tagName.toLowerCase()}:nth-child(${index})`;
        }

        return element.tagName.toLowerCase();
      }

      // Helper function to find label
      function findLabel(element: Element): string | null {
        const id = element.id;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) {
            return label.textContent?.trim() || null;
          }
        }

        let parent = element.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase() === 'label') {
            return parent.textContent?.trim() || null;
          }
          parent = parent.parentElement;

          if (parent?.tagName.toLowerCase() === 'form') {
            break;
          }
        }

        const prevSibling = element.previousElementSibling;
        if (prevSibling && prevSibling.tagName.toLowerCase() === 'label') {
          return prevSibling.textContent?.trim() || null;
        }

        return null;
      }

      formElements.forEach((form, formIndex) => {
        const formMap: any = {
          formSelector: `form:nth-of-type(${formIndex + 1})`,
          formId: form.id || undefined,
          formName: form.getAttribute('name') || undefined,
          action: form.action || undefined,
          method: form.method || undefined,
          fields: []
        };

        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach((input: any, inputIndex) => {
          const tagName = input.tagName.toLowerCase();
          const type = input.type || tagName;

          if (type === 'submit' || type === 'button' || type === 'image') {
            return;
          }

          const fieldInfo: any = {
            key: input.name || input.id || `field_${inputIndex}`,
            type: type,
            required: input.required || input.hasAttribute('required'),
            name: input.name || undefined,
            id: input.id || undefined,
            placeholder: input.placeholder || undefined,
            selector: generateSelector(input)
          };

          const label = findLabel(input);
          if (label) {
            fieldInfo.label = label;
          }

          formMap.fields.push(fieldInfo);
        });

        results.push(formMap);
      });

      return results;
    });

    return forms;
  }

  generateTypeScriptInterface(formMap: FormMap, interfaceName: string = 'FormData'): string {
    let tsInterface = `interface ${interfaceName} {\n`;

    formMap.fields.forEach(field => {
      const optional = field.required ? '' : '?';
      let tsType = 'string';

      switch (field.type) {
        case 'number':
          tsType = 'number';
          break;
        case 'checkbox':
          tsType = 'boolean';
          break;
        case 'email':
        case 'url':
        case 'tel':
        case 'text':
        case 'password':
        case 'textarea':
          tsType = 'string';
          break;
        case 'date':
        case 'datetime-local':
          tsType = 'string | Date';
          break;
        case 'file':
          tsType = 'File | string';
          break;
        default:
          tsType = 'string';
      }

      const comment = field.label ? `  // ${field.label}\n` : '';
      tsInterface += `${comment}  ${field.key}${optional}: ${tsType};\n`;
    });

    tsInterface += '}\n';
    return tsInterface;
  }
}
