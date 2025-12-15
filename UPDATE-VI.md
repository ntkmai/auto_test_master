# ✨ CẬP NHẬT MỚI - Gemini AI Tiếng Việt + Fallback

## 🎉 Tính năng mới

### 1. 🇻🇳 Test Cases Tiếng Việt

Gemini AI giờ đây tạo test cases **hoàn toàn bằng tiếng Việt**:

**Trước:**
```json
{
  "name": "Valid Input Test",
  "description": "Test with all required fields filled with valid data",
  "payload": {
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Bây giờ:**
```json
{
  "name": "Test dữ liệu hợp lệ",
  "description": "Điền đầy đủ các trường bắt buộc với dữ liệu hợp lệ",
  "payload": {
    "fullName": "Nguyễn Văn A",
    "email": "nguyen.van.a@gmail.com",
    "phone": "0912-345-678"
  }
}
```

### 2. 📝 Fallback Mode - Tạo Test Cases Thủ công

Khi API Gemini gặp lỗi hoặc bạn muốn tự kiểm soát, sử dụng **Fallback Mode**:

1. Click **"📝 Xuất Prompt"**
2. Prompt tự động copy vào clipboard
3. Paste vào bất kỳ AI nào (Gemini, ChatGPT, Claude...)
4. Copy kết quả JSON
5. Paste vào tool và click **"Parse"**

**Lợi ích:**
- ✅ Luôn hoạt động, không phụ thuộc API
- ✅ Sử dụng AI model bất kỳ
- ✅ Tùy chỉnh test cases theo ý muốn
- ✅ Miễn phí hoàn toàn

## 🚀 Cách sử dụng

### Chạy server
```bash
npm run server
```

### Truy cập Web UI
1. **Trang chủ**: http://localhost:3000
2. **AI Testing**: http://localhost:3000/test.html

### Sử dụng Auto Mode
1. Phân tích form
2. Chọn form cần test
3. Click **"✨ Generate Test Cases với Gemini AI"**
4. Chờ AI tạo test cases (3-5 giây)
5. Execute tests

### Sử dụng Fallback Mode
1. Phân tích form
2. Chọn form cần test
3. Click **"📝 Xuất Prompt (Fallback)"**
4. Mở https://gemini.google.com
5. Paste prompt (Ctrl+V)
6. Copy kết quả JSON
7. Quay lại tool, paste JSON
8. Click **"✅ Parse và Sử dụng Test Cases"**
9. Execute tests

## 📊 7 Loại Test Cases (Tiếng Việt)

1. **Trường hợp hợp lệ** - Dữ liệu hợp lệ, đầy đủ
2. **Trường hợp biên** - Min/max values, edge cases
3. **Trường hợp không hợp lệ** - Sai định dạng, sai kiểu
4. **Thiếu trường bắt buộc** - Missing required fields
5. **Ký tự đặc biệt** - Unicode, tiếng Việt có dấu
6. **SQL Injection** - Security testing
7. **XSS Test** - Cross-site scripting

## 🎯 Dữ liệu Test Tiếng Việt

Tool giờ tạo dữ liệu thực tế cho người Việt:

- **Tên**: Nguyễn Văn A, Trần Thị B, Lê Hoàng C
- **Email**: nguyen.van.a@gmail.com, tran.thi.b@yahoo.com
- **Số điện thoại**: 0912-345-678, +84-987-654-321
- **Địa chỉ**: Hà Nội, TP.HCM, Đà Nẵng
- **Tiếng Việt có dấu**: Ăn, Ê, Ô, Ơ, Ư, etc.

## 📝 Ví dụ Output

```json
[
  {
    "name": "Test dữ liệu hợp lệ",
    "description": "Điền đầy đủ các trường với dữ liệu hợp lệ",
    "payload": {
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.van.a@gmail.com",
      "password": "MatKhau123!",
      "phone": "0912-345-678",
      "address": "123 Đường Lê Lợi, Quận 1, TP.HCM"
    },
    "expectedResult": "Thành công - Form submit được"
  },
  {
    "name": "Test ký tự đặc biệt tiếng Việt",
    "description": "Test với tên có dấu và ký tự đặc biệt",
    "payload": {
      "fullName": "Trần Thị Bảo Châu",
      "email": "tran.bao.chau@gmail.com",
      "address": "Số 456 Nguyễn Huệ, Quận Hải Châu, Đà Nẵng"
    },
    "expectedResult": "Thành công - Hỗ trợ tiếng Việt"
  }
]
```

## 🛠️ Các thay đổi kỹ thuật

### File: `src/grokAI.ts`

**Đã thêm:**
- ✅ Prompt tiếng Việt trong `buildPrompt()`
- ✅ Method `exportPrompt()` - Xuất prompt để dùng thủ công
- ✅ Method `parseTestCases()` - Parse JSON test cases từ AI

**Code mới:**
```typescript
// Export prompt để sử dụng thủ công (fallback)
exportPrompt(formMap: FormMap): string {
  return this.buildPrompt(formMap);
}

// Parse test cases từ JSON string (để paste thủ công)
parseTestCases(jsonString: string): TestCase[] {
  // Xử lý markdown code blocks
  // Validate format
  // Return test cases array
}
```

### File: `server.ts`

**Đã thêm 2 endpoints mới:**

1. **POST `/api/export-prompt`** - Xuất prompt
   ```json
   Request: { "formIndex": 0 }
   Response: { "prompt": "..." }
   ```

2. **POST `/api/parse-testcases`** - Parse test cases thủ công
   ```json
   Request: { "testCasesJson": "[...]" }
   Response: { "testCases": [...] }
   ```

### File: `public/test.html`

**Đã thêm:**
- ✅ Nút "📝 Xuất Prompt (Fallback)"
- ✅ Section paste JSON test cases thủ công
- ✅ Nút "✅ Parse và Sử dụng Test Cases"
- ✅ Auto copy prompt vào clipboard
- ✅ Validation và error handling

## 📚 Tài liệu

- **[FALLBACK-GUIDE.md](FALLBACK-GUIDE.md)** - Hướng dẫn chi tiết Fallback Mode
- **[START-HERE.md](START-HERE.md)** - Hướng dẫn tổng quan
- **[WEB-UI-GUIDE.md](WEB-UI-GUIDE.md)** - Hướng dẫn Web UI
- **[AI-TESTING-GUIDE.md](AI-TESTING-GUIDE.md)** - Hướng dẫn AI Testing

## 🎉 Bắt đầu ngay

```bash
# Cài đặt dependencies (nếu chưa)
npm install

# Chạy server
npm run server

# Mở browser
# http://localhost:3000
```

## 💡 Khi nào dùng gì?

| Tình huống | Nên dùng |
|------------|----------|
| API hoạt động tốt | ✨ Auto Mode (Gemini API) |
| API bị lỗi/rate limit | 📝 Fallback Mode |
| Muốn tùy chỉnh test cases | 📝 Fallback Mode |
| Muốn dùng ChatGPT/Claude | 📝 Fallback Mode |
| Test nhanh, đơn giản | ✨ Auto Mode |
| Dự án quan trọng | 📝 Fallback Mode (kiểm soát tốt hơn) |

---

**Happy Testing!** 🧪✨

🇻🇳 **Made with ❤️ for Vietnamese developers**
