# Hướng dẫn Test với Demo Form

## Cách 1: Sử dụng script test-demo (Khuyến nghị)

```bash
npm run test-demo
```

Script này sẽ tự động:
- Mở file [demo-form.html](demo-form.html) trong Chrome
- Phân tích 3 forms có sẵn
- Lưu kết quả vào `./output/demo/`

## Cách 2: Test thủ công với file HTML

### Bước 1: Mở demo-form.html
Mở file [demo-form.html](demo-form.html) bằng trình duyệt để xem các form mẫu.

### Bước 2: Chạy tool với file path

**Windows:**
```bash
npm run dev -- file:///D:/vtcode-projects/auto-test-master/demo-form.html
```

**Mac/Linux:**
```bash
npm run dev -- file:///absolute/path/to/demo-form.html
```

## Cách 3: Test với website thật

### Test với W3Schools (có form HTML mẫu)
```bash
npm run dev -- https://www.w3schools.com/html/html_forms.asp
```

### Test với Bootstrap Form Example
```bash
npm run dev -- https://getbootstrap.com/docs/5.0/forms/overview/
```

### Test với form demo khác
```bash
npm run dev -- https://demo.automationtesting.in/Register.html
```

## Những gì bạn sẽ thấy

### 1. Chrome Browser sẽ mở
- Tool sẽ mở Chrome và tự động điều hướng đến URL
- Bạn có thể thấy quá trình phân tích diễn ra

### 2. Console Output
```
🚀 Launching browser...
🌐 Navigating to ...
✅ Page loaded successfully
🔍 Analyzing forms on the page...
📋 Found 3 form(s)

📝 Analyzing form 1/3...
   Form ID: registrationForm
   Fields: 13

📝 Analyzing form 2/3...
   Form ID: contactForm
   Fields: 5

📝 Analyzing form 3/3...
   Form ID: jobForm
   Fields: 7

💾 Saved JSON result: ./output/analysis-result.json
💾 Saved TypeScript interface: ./output/RegistrationForm.interface.ts
💾 Saved TypeScript interface: ./output/ContactForm.interface.ts
💾 Saved TypeScript interface: ./output/JobForm.interface.ts
...
```

### 3. Output Files

Trong thư mục `./output/` hoặc `./output/demo/`:

**analysis-result.json**
```json
{
  "url": "file:///...",
  "timestamp": "2024-01-15T...",
  "forms": [...]
}
```

**RegistrationForm.interface.ts**
```typescript
interface RegistrationForm {
  // Họ và tên
  fullName: string;
  // Email
  email: string;
  // Mật khẩu
  password: string;
  // Số điện thoại
  phone?: string;
  // Ngày sinh
  birthDate: string | Date;
  // Giới tính
  gender: string;
  // Quốc gia
  country: string;
  // Thành phố
  city?: string;
  hobbies?: string;
  // Giới thiệu bản thân
  bio?: string;
  terms: boolean;
}
```

**registration-samples.md**
```markdown
# Sample Data Report

## Field: country
- Type: select
- Selector: `#country`
- Available Options:
  - **-- Chọn quốc gia --**: ``
  - **Việt Nam**: `VN`
  - **Thái Lan**: `TH`
  - **Singapore**: `SG`
  - **Malaysia**: `MY`
  - **Philippines**: `PH`
  - **Indonesia**: `ID`

## Field: gender
- Type: radio
- Selector: `input[name="gender"]`
- Available Options:
  - **Nam**: `male`
  - **Nữ**: `female`
  - **Khác**: `other`
```

**SUMMARY.md** - Tổng quan tất cả forms

## Troubleshooting

### Lỗi: "Cannot find Chrome"
Puppeteer sẽ tự động tải Chrome khi chạy `npm install`

### Lỗi: "Navigation timeout"
Tăng timeout trong [src/index.ts](src/index.ts):
```typescript
timeout: 60000 // 60 giây
```

### Không tìm thấy form
- Kiểm tra trang có thực sự chứa `<form>` tag
- Thử thêm `waitForSelector` config

### Demo form không mở được
Đảm bảo đường dẫn file đúng:
```bash
# Kiểm tra đường dẫn tuyệt đối
cd d:\vtcode-projects\auto-test-master
dir demo-form.html
```

## Kỳ vọng kết quả với demo-form.html

- **3 forms** sẽ được tìm thấy
- **Form 1** (Registration): 11-13 fields
  - Có dropdown: country, city
  - Có radio: gender
  - Có checkbox: hobbies, terms
- **Form 2** (Contact): 5 fields
  - Có dropdown: subject
  - Có radio: priority
- **Form 3** (Job Application): 7 fields
  - Có dropdown: position
  - Có checkbox: workType
  - Có number input: experience, salary
