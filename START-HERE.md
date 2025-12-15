# 🚀 BẮT ĐẦU TẠI ĐÂY

Chào mừng bạn đến với **Web Black Box Testing Tool**!

## ✅ Đã hoàn thành

### Phase 1: Analysis
1. ✅ **Phân tích Form** - Tự động tìm và phân tích tất cả forms trên trang web
2. ✅ **Trích xuất Fields** - Lấy thông tin chi tiết về mỗi field (type, required, label)
3. ✅ **Generate TypeScript Interface** - Tạo interface map với key và required
4. ✅ **Thu thập Sample Data** - Lấy options từ dropdown, select, checkbox, radio
5. ✨ **Web UI** - Giao diện web trực quan, đẹp mắt, dễ sử dụng

### Phase 2: AI Testing ⭐ NEW!
6. 🤖 **Grok AI Integration** - AI tự động generate test cases
7. 🎯 **Smart Test Data** - Dữ liệu test realistic, intelligent
8. 🧪 **Auto Fill & Execute** - Tự động điền form và test
9. 📸 **Visual Results** - Screenshot + kết quả trực quan
10. 🔒 **Security Testing** - SQL Injection, XSS tests

## 🎯 Cách sử dụng nhanh

### 🌐 OPTION 1: Web UI (Khuyến nghị - Dễ nhất!)

```bash
npm run server
```

Sau đó mở browser: **http://localhost:3000**

- ✅ Giao diện đẹp, trực quan
- ✅ Không cần command line
- ✅ Xem kết quả ngay trên web
- ✅ Download files tiện lợi

👉 **Xem chi tiết:** [WEB-UI-GUIDE.md](WEB-UI-GUIDE.md)

### 💻 OPTION 2: Command Line (CLI)

**Test với Demo Form:**
```bash
npm run test-demo
```

**Test với Website của bạn:**
```bash
npm run dev -- https://your-website.com/form-page
```

### 📁 Xem kết quả

Mở thư mục `output/` để xem:
- `SUMMARY.md` - Tổng quan
- `*.interface.ts` - TypeScript interfaces cho từng form
- `*-samples.md` - Dữ liệu mẫu (dropdown options, etc.)
- `analysis-result.json` - Raw data đầy đủ

## 📚 Tài liệu

Đọc theo thứ tự:

1. **[QUICKSTART.md](QUICKSTART.md)** ← Bắt đầu tại đây
   - Hướng dẫn 3 bước nhanh
   - Ví dụ cơ bản

2. **[TEST-DEMO.md](TEST-DEMO.md)**
   - Hướng dẫn test với demo form
   - Kỳ vọng kết quả

3. **[GUIDE.md](GUIDE.md)**
   - Hướng dẫn chi tiết
   - Configuration options
   - Use cases thực tế
   - Troubleshooting

4. **[STRUCTURE.md](STRUCTURE.md)**
   - Cấu trúc code
   - Data flow
   - Extension points

5. **[README.md](README.md)**
   - Overview tổng quan
   - Technical details

## 💡 Ví dụ Output

### TypeScript Interface
Từ form HTML, tool sẽ tạo:

```typescript
interface RegistrationForm {
  // Họ và tên
  fullName: string;
  // Email
  email: string;
  // Mật khẩu
  password: string;
  // Số điện thoại
  phone?: string;  // Optional (không required)
  // Quốc gia
  country: string;
  terms: boolean;
}
```

### Sample Data Report
```markdown
## Field: country
- Type: select
- Selector: `#country`
- Available Options:
  - **Việt Nam**: `VN`
  - **Thái Lan**: `TH`
  - **Singapore**: `SG`
```

## 🎨 Demo Form

File [demo-form.html](demo-form.html) chứa 3 forms mẫu:

1. **Registration Form** - Form đăng ký với đầy đủ field types
2. **Contact Form** - Form liên hệ đơn giản
3. **Job Application Form** - Form ứng tuyển

Mở file này trong browser để xem, hoặc chạy:
```bash
npm run test-demo
```

## 🔧 Cấu hình nâng cao

Sửa [src/index.ts](src/index.ts) để customize:

```typescript
const tester = new WebTester({
  url: url,
  headless: false,        // true = chạy ẩn, false = hiện browser
  outputDir: './output',  // Thư mục lưu kết quả
  timeout: 30000,        // Timeout 30 giây
  waitForSelector: '#myForm'  // Đợi element cụ thể (optional)
});
```

## 📊 Kết quả mong đợi

Với demo-form.html, bạn sẽ thấy:
- ✅ 3 forms được tìm thấy
- ✅ ~25 fields tổng cộng
- ✅ 6+ dropdown/select với options
- ✅ 3+ radio button groups
- ✅ 5+ checkboxes
- ✅ TypeScript interfaces cho cả 3 forms
- ✅ Sample data reports với tất cả options

## 🐛 Troubleshooting

### Chrome không mở được
```bash
# Kiểm tra Puppeteer đã cài đặt Chrome chưa
ls node_modules/puppeteer/.local-chromium
```

### Timeout khi load trang
Tăng timeout trong config:
```typescript
timeout: 60000  // 60 giây
```

### Không tìm thấy form
- Kiểm tra trang có chứa `<form>` tag
- Thử thêm `waitForSelector` config
- Check console output để debug

## 🎉 Test thành công?

Sau khi test với demo form và website của bạn thành công, hãy cho tôi biết:

1. ✅ Kết quả có đúng như mong đợi không?
2. 💡 Có cần điều chỉnh gì ở Phase 1 không?
3. 🚀 Hướng phát triển Phase 2 - bạn muốn:
   - Tự động điền form với test data?
   - Submit form và check response?
   - Validate form (client-side validation)?
   - Test edge cases (empty, invalid data)?
   - Generate test cases tự động?
   - Screenshot và visual comparison?
   - Integration với testing frameworks?
   - Khác?

## 📞 Liên hệ

Nếu gặp vấn đề hoặc cần support, hãy cho tôi biết:
- Lỗi gì đang gặp?
- URL đang test (nếu có thể share)
- Error message
- Expected vs Actual result

## 🎯 Next Steps

1. Chạy `npm run test-demo` để test
2. Check kết quả trong `./output/demo/`
3. Test với website thật của bạn
4. Báo cáo kết quả và feedback
5. Thảo luận Phase 2 tiếp theo

---

**Happy Testing!** 🧪✨
