import { FormMap } from './types';

export interface GrokConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

export interface TestCase {
  name: string;
  description: string;
  payload: Record<string, any>;
  expectedResult?: string;
}

export class GrokAI {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GrokConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.5-flash-lite';
    this.temperature = config.temperature || 0;
  }

  async generateTestCases(formMap: FormMap): Promise<TestCase[]> {
    const prompt = this.buildPrompt(formMap);

    try {
      const url = `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as a QA test data generator. Create test case payloads for the following form structure. Output must be a valid JSON array only.\n\n${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,  // Giảm xuống để tránh MAX_TOKENS error
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API response:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Debug logging
      console.log('Gemini API full response:', JSON.stringify(data, null, 2));

      if (!data.candidates || !data.candidates[0]) {
        console.error('No candidates in response:', data);
        throw new Error('Gemini API returned no candidates');
      }

      const candidate = data.candidates[0];

      // Check for RECITATION or other finish reasons
      if (candidate.finishReason === 'RECITATION') {
        console.error('Gemini blocked due to RECITATION. Retrying with modified prompt...');
        throw new Error('Gemini blocked content due to potential recitation. Please try again with different form data.');
      }

      if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
        console.error('No content in candidate:', candidate);
        throw new Error(`Gemini API did not return content. Finish reason: ${candidate.finishReason || 'unknown'}`);
      }

      const content = candidate.content.parts[0].text;
      console.log('Gemini response content:', content);

      // Parse JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;

      console.log('Extracted JSON string:', jsonStr);

      const testCases = JSON.parse(jsonStr);
      return testCases;

    } catch (error: any) {
      console.error('Grok AI error:', error);
      throw new Error(`Failed to generate test cases: ${error.message}`);
    }
  }

  private buildPrompt(formMap: FormMap): string {
    const fieldsInfo = formMap.fields.map(field => ({
      key: field.key,
      type: field.type,
      required: field.required,
      label: field.label
    }));

    return `Tạo các test case cho form web này. Trả về một JSON array chứa các test case.

Thông tin Form:
${JSON.stringify({
  formId: formMap.formId,
  formName: formMap.formName,
  fields: fieldsInfo
}, null, 2)}

Tạo CÁC TEST CASE SAU (CHỈ 4 LOẠI):
1. **Trường hợp hợp lệ** - Điền đầy đủ các trường bắt buộc với dữ liệu hợp lệ
2. **Trường hợp không hợp lệ** - Dữ liệu sai định dạng (email sai, số âm, etc.)
3. **Thiếu trường bắt buộc** - Bỏ trống 1 trường bắt buộc
4. **Ký tự đặc biệt** - Test với tiếng Việt có dấu và ký tự đặc biệt

Định dạng trả về:
[
  {
    "name": "Test dữ liệu hợp lệ",
    "description": "Điền đầy đủ các trường với dữ liệu hợp lệ",
    "payload": {
      "fieldName": "giá trị",
      ...
    },
    "expectedResult": "Thành công - Form submit được"
  },
  ...
]

QUY TẮC QUAN TRỌNG:
- CHỈ TẠO 4 TEST CASES (1 cho mỗi loại)
- Dữ liệu người Việt: tên, email, SĐT VN (0xxx-xxx-xxx)
- Email: nguyen.van.a@gmail.com
- Password: MatKhau123! (8+ ký tự)
- Ngày: dd/mm/yyyy hoặc yyyy-mm-dd
- Ưu tiên tiếng Việt có dấu
- CHỈ trả về JSON array, KHÔNG có text khác, KHÔNG có markdown code blocks

QUAN TRỌNG: Response PHẢI ngắn gọn để tránh bị cắt!`;
  }

  /**
   * Generate additional test cases of specific types
   */
  async generateMoreTestCases(formMap: FormMap, testTypes: string[]): Promise<TestCase[]> {
    const fieldsInfo = formMap.fields.map(field => ({
      key: field.key,
      type: field.type,
      required: field.required,
      label: field.label
    }));

    const typeDescriptions: Record<string, string> = {
      'boundary': 'Trường hợp biên - Test giá trị min/max, độ dài tối thiểu/tối đa',
      'sql-injection': 'SQL Injection - Test bảo mật với SQL injection payloads',
      'xss': 'XSS Test - Test cross-site scripting với script tags',
      'special-chars': 'Ký tự đặc biệt nâng cao - Unicode, emoji, ký tự đặc biệt phức tạp'
    };

    const requestedTypes = testTypes.map(t => `- ${typeDescriptions[t] || t}`).join('\n');

    const prompt = `Tạo test cases BỔ SUNG cho form này. Trả về JSON array.

Thông tin Form:
${JSON.stringify({
  formId: formMap.formId,
  fields: fieldsInfo
}, null, 2)}

TẠO TEST CASES CHO CÁC LOẠI SAU (1-2 test cases cho MỖI loại):
${requestedTypes}

Định dạng:
[
  {
    "name": "Tên test case",
    "description": "Mô tả",
    "payload": { "field": "value" },
    "expectedResult": "Kết quả mong đợi"
  }
]

QUY TẮC:
- Dữ liệu tiếng Việt, thực tế
- Response NGẮN GỌN để tránh bị cắt
- CHỈ trả về JSON array, KHÔNG có markdown hoặc text khác`;

    try {
      const url = `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là AI tạo test data. Chỉ trả về JSON array hợp lệ.\n\n${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,  // Giảm xuống để tránh bị cắt
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Gemini không trả về test cases');
      }

      const content = data.candidates[0].content.parts[0].text;

      // Parse JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/) || content.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;

      const testCases = JSON.parse(jsonStr.trim());
      return testCases;

    } catch (error: any) {
      console.error('Generate more test cases error:', error);
      throw new Error(`Lỗi generate thêm test cases: ${error.message}`);
    }
  }

  /**
   * Export prompt để sử dụng thủ công với Gemini
   */
  exportPrompt(formMap: FormMap): string {
    return this.buildPrompt(formMap);
  }

  /**
   * Parse test cases từ JSON string (để paste thủ công)
   */
  parseTestCases(jsonString: string): TestCase[] {
    try {
      // Xử lý markdown code blocks nếu có
      const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/) || jsonString.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : jsonString;
      
      const testCases = JSON.parse(jsonStr.trim());
      
      // Validate format
      if (!Array.isArray(testCases)) {
        throw new Error('Test cases phải là một array');
      }
      
      // Validate mỗi test case
      testCases.forEach((tc, index) => {
        if (!tc.name || !tc.payload) {
          throw new Error(`Test case ${index + 1} thiếu trường name hoặc payload`);
        }
      });
      
      return testCases;
    } catch (error: any) {
      throw new Error(`Lỗi parse test cases: ${error.message}`);
    }
  }

  async generateSinglePayload(formMap: FormMap, testType: 'valid' | 'invalid' | 'boundary'): Promise<Record<string, any>> {
    const testTypeVi = testType === 'valid' ? 'hợp lệ' : testType === 'invalid' ? 'không hợp lệ' : 'biên';
    const prompt = `Tạo một test payload ${testTypeVi} cho form này:

${JSON.stringify({
  formId: formMap.formId,
  fields: formMap.fields.map(f => ({
    key: f.key,
    type: f.type,
    required: f.required,
    label: f.label
  }))
}, null, 2)}

Chỉ trả về JSON object với giá trị các trường, không có text khác.
Ví dụ: {"email": "nguyen.van.a@gmail.com", "password": "MatKhau123!", ...}`;

    try {
      const url = `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là một AI tạo dữ liệu test. Chỉ trả về JSON object hợp lệ.\n\n${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API response:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;

      return JSON.parse(jsonStr);

    } catch (error: any) {
      console.error('Grok AI error:', error);
      throw new Error(`Failed to generate payload: ${error.message}`);
    }
  }
}
