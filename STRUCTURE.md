# Cấu trúc Project

## 📁 Directory Structure

```
auto-test-master/
├── src/                          # Source code
│   ├── types.ts                  # TypeScript type definitions
│   ├── formAnalyzer.ts           # Form analysis logic
│   ├── dataCollector.ts          # Sample data collection
│   ├── webTester.ts              # Main orchestration class
│   └── index.ts                  # Entry point
│
├── output/                       # Generated output (git ignored)
│   ├── analysis-result.json      # Full analysis data
│   ├── *.interface.ts            # TypeScript interfaces
│   ├── *-samples.md              # Sample data reports
│   └── SUMMARY.md                # Overview
│
├── node_modules/                 # Dependencies (git ignored)
├── dist/                         # Compiled JS (git ignored)
│
├── demo-form.html                # Demo HTML form for testing
├── example.ts                    # Code examples
├── test-demo.ts                  # Quick test script
│
├── package.json                  # NPM config
├── tsconfig.json                 # TypeScript config
├── .gitignore                    # Git ignore rules
│
├── README.md                     # Project overview
├── QUICKSTART.md                 # Quick start guide
├── GUIDE.md                      # Detailed guide
├── TEST-DEMO.md                  # Demo testing guide
└── STRUCTURE.md                  # This file
```

## 🧩 Component Overview

### 1. Core Components

#### [src/types.ts](src/types.ts)
Định nghĩa tất cả TypeScript types và interfaces:
- `FieldInfo` - Thông tin field
- `FormMap` - Cấu trúc form
- `FieldSampleData` - Dữ liệu mẫu
- `AnalysisResult` - Kết quả phân tích

#### [src/formAnalyzer.ts](src/formAnalyzer.ts)
Class phân tích form:
- `analyzeForms()` - Tìm và phân tích tất cả forms
- `generateTypeScriptInterface()` - Tạo TS interface

Chức năng:
- Tìm tất cả `<form>` elements
- Trích xuất field info (type, name, id, required, label)
- Generate CSS selectors
- Tạo TypeScript interfaces

#### [src/dataCollector.ts](src/dataCollector.ts)
Class thu thập dữ liệu mẫu:
- `collectSampleData()` - Lấy sample values
- `generateSampleDataReport()` - Tạo markdown report

Hỗ trợ:
- SELECT dropdown options
- RADIO button values
- CHECKBOX states
- DATALIST suggestions

#### [src/webTester.ts](src/webTester.ts)
Class chính orchestrate toàn bộ quá trình:
- `init()` - Khởi tạo browser
- `analyze()` - Thực hiện phân tích
- `saveResults()` - Lưu kết quả
- `run()` - Chạy toàn bộ quy trình

#### [src/index.ts](src/index.ts)
Entry point của ứng dụng:
- Parse command line arguments
- Setup WebTester
- Handle errors
- Export public APIs

### 2. Test & Demo Files

#### [demo-form.html](demo-form.html)
HTML file với 3 forms mẫu:
1. **Registration Form** - 13 fields
   - Text, email, password inputs
   - Date, tel, number inputs
   - Select dropdowns (country, city)
   - Radio buttons (gender)
   - Checkboxes (hobbies, terms)
   - Textarea

2. **Contact Form** - 5 fields
   - Basic contact info
   - Subject dropdown
   - Priority radio buttons
   - Message textarea

3. **Job Application Form** - 7 fields
   - Applicant info
   - Position dropdown
   - Experience (number)
   - Work type checkboxes

#### [test-demo.ts](test-demo.ts)
Script để test nhanh với demo-form.html:
```bash
npm run test-demo
```

#### [example.ts](example.ts)
Code examples cho các use cases khác nhau:
- Basic usage
- Advanced configuration
- Step-by-step approach

### 3. Documentation Files

#### [README.md](README.md)
Tổng quan về project:
- Features overview
- Installation
- Basic usage
- Output examples

#### [QUICKSTART.md](QUICKSTART.md)
Hướng dẫn nhanh để bắt đầu trong 3 bước:
- Install
- Run
- View results

#### [GUIDE.md](GUIDE.md)
Hướng dẫn chi tiết:
- Detailed explanation
- Configuration options
- Use cases
- Troubleshooting
- Tips & tricks

#### [TEST-DEMO.md](TEST-DEMO.md)
Hướng dẫn test với demo form:
- Different test methods
- Expected results
- Troubleshooting demo-specific issues

## 🔄 Data Flow

```
1. User Input (URL)
   ↓
2. WebTester.init()
   - Launch Puppeteer
   - Navigate to URL
   ↓
3. WebTester.analyze()
   ├─→ FormAnalyzer.analyzeForms()
   │   - Find all <form> elements
   │   - Extract field info
   │   - Generate selectors
   └─→ DataCollector.collectSampleData()
       - Collect dropdown options
       - Get radio/checkbox values
   ↓
4. WebTester.saveResults()
   ├─→ Save JSON (analysis-result.json)
   ├─→ Generate TS interfaces (*.interface.ts)
   ├─→ Generate sample reports (*-samples.md)
   └─→ Generate summary (SUMMARY.md)
   ↓
5. Output Files Ready
```

## 🎯 Key Features Implementation

### Feature 1: Form Analysis
**Files:** `formAnalyzer.ts`
**Logic:**
1. Find forms using `document.querySelectorAll('form')`
2. For each form, find inputs: `input, textarea, select`
3. Extract metadata: type, name, id, required, placeholder
4. Find associated labels (by `for`, parent, or adjacent)
5. Generate unique CSS selectors

### Feature 2: Sample Data Collection
**Files:** `dataCollector.ts`
**Logic:**
1. For each field selector, query the element
2. Based on field type:
   - SELECT: Extract all `<option>` elements
   - RADIO: Find all radios with same name
   - CHECKBOX: Get current state + possible values
   - DATALIST: Extract associated datalist options
3. Return structured sample data

### Feature 3: TypeScript Interface Generation
**Files:** `formAnalyzer.ts`
**Logic:**
1. Map field types to TS types:
   - `text/email/password` → `string`
   - `number` → `number`
   - `checkbox` → `boolean`
   - `date` → `string | Date`
2. Add optional modifier (`?`) for non-required fields
3. Include label as comment
4. Format as valid TS interface

## 📦 Dependencies

### Runtime Dependencies
- **puppeteer** (^24.15.0) - Headless Chrome automation

### Dev Dependencies
- **typescript** (^5.3.3) - TypeScript compiler
- **ts-node** (^10.9.2) - Run TS files directly
- **@types/node** (^20.10.5) - Node.js type definitions

## 🚀 Extension Points

Để extend tool này:

### 1. Thêm field type mới
Edit [src/formAnalyzer.ts](src/formAnalyzer.ts):
```typescript
case 'new-type':
  tsType = 'NewType';
  break;
```

### 2. Thêm data collector mới
Edit [src/dataCollector.ts](src/dataCollector.ts):
```typescript
else if (type === 'new-input-type') {
  // Handle new input type
}
```

### 3. Thêm output format mới
Edit [src/webTester.ts](src/webTester.ts) - `saveResults()`:
```typescript
// Add new format export
const newFormat = this.generateNewFormat(result);
fs.writeFileSync(path.join(outputDir, 'output.new'), newFormat);
```

### 4. Thêm validation logic
Tạo file mới `src/validator.ts`:
```typescript
export class FormValidator {
  validate(formData: FormMap): ValidationResult {
    // Validation logic
  }
}
```

## 🧪 Testing Strategy

### Manual Testing
1. Run với demo-form.html
2. Test với real websites
3. Verify output files

### Future: Automated Testing
- Unit tests cho FormAnalyzer
- Unit tests cho DataCollector
- Integration tests với mock HTML
- E2E tests với demo sites

## 🔒 Security Considerations

- Tool chỉ READ data, không WRITE hay SUBMIT forms
- Không lưu sensitive data (passwords sẽ là field metadata chứ không phải giá trị thật)
- Chỉ chạy local, không gửi data đi đâu
- Puppeteer runs in sandbox mode (có thể disable nếu cần)
