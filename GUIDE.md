# Hướng dẫn sử dụng chi tiết

## 1. Cài đặt và Chạy lần đầu

```bash
# Cài đặt dependencies
npm install

# Test với một trang web mẫu
npm run dev -- https://www.w3schools.com/html/html_forms.asp
```

## 2. Cách hoạt động

Tool này sẽ:

1. **Mở Chrome browser** (có thể thấy được hoặc chạy ẩn)
2. **Truy cập URL** bạn cung cấp
3. **Tìm tất cả form** trên trang
4. **Phân tích từng field** trong mỗi form:
   - Tên field (name/id)
   - Loại field (text, email, select, checkbox, v.v.)
   - Field bắt buộc hay không
   - Label của field
5. **Thu thập dữ liệu mẫu**:
   - Tất cả options từ dropdown/select
   - Các giá trị có thể cho radio buttons
   - Trạng thái checkbox
6. **Tạo output files**:
   - JSON với toàn bộ dữ liệu
   - TypeScript interfaces
   - Markdown reports

## 3. Output Files

### 3.1. analysis-result.json

File JSON đầy đủ chứa tất cả thông tin:

```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "forms": [
    {
      "form": {
        "formSelector": "form:nth-of-type(1)",
        "formId": "loginForm",
        "fields": [...]
      },
      "sampleData": [...]
    }
  ]
}
```

### 3.2. TypeScript Interface

File `.interface.ts` cho mỗi form:

```typescript
interface LoginForm {
  // Email Address
  email: string;
  // Password
  password: string;
  // Remember me
  remember?: boolean;
}
```

**Cách sử dụng:**
- Fields bắt buộc: không có dấu `?`
- Fields optional: có dấu `?`
- Comment chứa label của field

### 3.3. Sample Data Report

File `-samples.md` chứa tất cả giá trị mẫu:

```markdown
## Field: country
- Type: select
- Selector: `#country`
- Available Options:
  - **Vietnam**: `VN`
  - **Thailand**: `TH`
  - **Singapore**: `SG`
```

### 3.4. SUMMARY.md

Tổng quan nhanh về tất cả forms trên trang.

## 4. Các trường hợp sử dụng

### 4.1. Test form đăng nhập

```bash
npm run dev -- https://your-app.com/login
```

Output sẽ cho bạn:
- Interface TypeScript để type-safe
- Các field bắt buộc
- Format của từng field (email, password, etc.)

### 4.2. Test form phức tạp (nhiều dropdown, checkbox)

```bash
npm run dev -- https://your-app.com/register
```

Output sẽ bao gồm:
- Tất cả options trong dropdown (quốc gia, tỉnh thành, v.v.)
- Các checkbox options
- Radio button groups

### 4.3. Test nhiều forms trong một trang

Tool tự động tìm và phân tích TẤT CẢ forms trên trang:
- Form search
- Form login
- Form newsletter signup
- v.v.

## 5. Configuration Options

```typescript
const tester = new WebTester({
  // URL cần test (bắt buộc)
  url: 'https://example.com/form',

  // Chạy Chrome ẩn hay hiện (mặc định: false)
  headless: false,

  // Thư mục lưu kết quả (mặc định: './output')
  outputDir: './output',

  // Đợi một selector cụ thể load xong (optional)
  waitForSelector: '#myForm',

  // Timeout cho việc load trang (mặc định: 30000ms)
  timeout: 30000
});
```

## 6. Sử dụng Programmatically

### 6.1. Cơ bản

```typescript
import { WebTester } from './src/webTester';

const tester = new WebTester({
  url: 'https://example.com'
});

const result = await tester.run();
console.log('Found', result.forms.length, 'forms');
```

### 6.2. Xử lý từng bước

```typescript
const tester = new WebTester({ url: 'https://example.com' });

// Khởi tạo browser
await tester.init();

// Phân tích
const result = await tester.analyze();

// Xử lý result theo ý bạn
for (const formData of result.forms) {
  console.log('Form:', formData.form.formId);
  console.log('Fields:', formData.form.fields.length);
}

// Lưu kết quả
await tester.saveResults(result);

// Đóng browser
await tester.close();
```

## 7. Tips và Tricks

### 7.1. Trang cần đăng nhập

Nếu form cần đăng nhập mới thấy được, bạn có thể:

1. Set `headless: false` để thấy browser
2. Thêm `waitForSelector` để đợi form load
3. Tăng `timeout` nếu trang load chậm

### 7.2. Form động (AJAX)

Với form load qua AJAX:

```typescript
const tester = new WebTester({
  url: 'https://example.com',
  waitForSelector: '#dynamicForm', // Đợi form xuất hiện
  timeout: 60000 // Tăng timeout
});
```

### 7.3. Multiple pages

```typescript
const urls = [
  'https://example.com/login',
  'https://example.com/register',
  'https://example.com/contact'
];

for (const url of urls) {
  const tester = new WebTester({
    url,
    outputDir: `./output/${url.split('/').pop()}`
  });
  await tester.run();
}
```

## 8. Troubleshooting

### Chrome không mở được

```bash
# Windows: có thể cần disable sandbox
# Đã được handle trong code
```

### Timeout khi load trang

```typescript
// Tăng timeout
const tester = new WebTester({
  url: 'https://slow-site.com',
  timeout: 120000 // 2 phút
});
```

### Không tìm thấy form

- Kiểm tra form có thực sự tồn tại khi trang load
- Dùng `waitForSelector` để đợi form xuất hiện
- Check console để thấy browser đang làm gì

## 9. Kế hoạch Phase 2

Sau khi bạn test và feedback, có thể phát triển thêm:

- [ ] Tự động điền form với test data
- [ ] Validate form (client-side validation)
- [ ] Submit form và check response
- [ ] Test các edge cases (empty, invalid data)
- [ ] Screenshot và visual comparison
- [ ] Generate test cases tự động
- [ ] Integration với testing frameworks (Jest, Mocha)

## 10. Support

Nếu gặp lỗi hoặc cần thêm tính năng, hãy cho tôi biết!
