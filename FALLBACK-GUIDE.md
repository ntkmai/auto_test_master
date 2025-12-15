# 📝 Hướng dẫn Fallback - Tạo Test Cases Thủ công

## 🎯 Khi nào cần dùng Fallback?

Sử dụng chế độ fallback khi:
- ❌ API Gemini bị lỗi hoặc rate limit
- ❌ Kết nối mạng không ổn định
- ❌ Muốn kiểm soát và tùy chỉnh test cases
- ✅ Muốn sử dụng AI model khác (ChatGPT, Claude, etc.)

## 🚀 Cách sử dụng

### Bước 1: Xuất Prompt

1. Vào trang **AI Testing**: http://localhost:3000/test.html
2. Chọn form cần test
3. Click nút **"📝 Xuất Prompt (Fallback)"**
4. Prompt sẽ được tự động copy vào clipboard

### Bước 2: Sử dụng AI của bạn

Bạn có thể paste prompt vào:

#### Option A: Gemini AI (Miễn phí)
1. Truy cập: https://gemini.google.com
2. Paste prompt (Ctrl+V)
3. Chờ Gemini generate test cases
4. Copy kết quả JSON

#### Option B: ChatGPT
1. Truy cập: https://chat.openai.com
2. Paste prompt
3. Copy kết quả JSON

#### Option C: Claude AI
1. Truy cập: https://claude.ai
2. Paste prompt
3. Copy kết quả JSON

#### Option D: Bất kỳ AI nào khác
- Paste prompt vào bất kỳ AI chatbot nào
- Đảm bảo AI trả về JSON array theo format

### Bước 3: Parse Test Cases

1. Quay lại trang web
2. Paste JSON vào ô **"Paste Test Cases JSON"**
3. Click **"✅ Parse và Sử dụng Test Cases"**
4. Test cases sẽ được hiển thị và sẵn sàng execute

## 📋 Format Test Cases

Test cases phải là JSON array theo format:

```json
[
  {
    "name": "Test dữ liệu hợp lệ",
    "description": "Điền đầy đủ các trường với dữ liệu hợp lệ",
    "payload": {
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.van.a@gmail.com",
      "password": "MatKhau123!",
      "phone": "0912-345-678"
    },
    "expectedResult": "Thành công - Form submit được"
  },
  {
    "name": "Test thiếu trường bắt buộc",
    "description": "Bỏ trống email (required field)",
    "payload": {
      "fullName": "Nguyễn Văn B",
      "password": "MatKhau456!",
      "phone": "0987-654-321"
    },
    "expectedResult": "Lỗi - Email bắt buộc"
  }
]
```

### Các trường bắt buộc:
- ✅ `name` - Tên test case (string)
- ✅ `payload` - Dữ liệu điền vào form (object)

### Các trường tùy chọn:
- `description` - Mô tả chi tiết (string)
- `expectedResult` - Kết quả mong đợi (string)

## 🔍 Ví dụ Prompt

Khi bạn click "Xuất Prompt", sẽ có prompt dạng:

```
Tạo các test case cho form web này. Trả về một JSON array chứa các test case.

Thông tin Form:
{
  "formId": "registrationForm",
  "formName": "Registration Form",
  "fields": [
    {
      "key": "fullName",
      "type": "text",
      "required": true,
      "label": "Họ và tên"
    },
    {
      "key": "email",
      "type": "email",
      "required": true,
      "label": "Email"
    },
    ...
  ]
}

Tạo các test case sau:
1. **Trường hợp hợp lệ** - Điền đầy đủ các trường bắt buộc với dữ liệu hợp lệ
2. **Trường hợp biên** - Test giá trị min/max, các trường hợp đặc biệt
3. **Trường hợp không hợp lệ** - Dữ liệu sai định dạng, sai kiểu
...
```

## ✅ Kiểm tra kết quả

Sau khi parse thành công, bạn sẽ thấy:
- ✅ Số lượng test cases được parse
- ✅ Danh sách test cases với payload
- ✅ Nút "Execute Test" để chạy từng test

## ❌ Xử lý lỗi

### Lỗi: "Test cases phải là một array"
- **Nguyên nhân**: JSON không phải là array
- **Giải pháp**: Đảm bảo JSON bắt đầu bằng `[` và kết thúc bằng `]`

### Lỗi: "Test case X thiếu trường name hoặc payload"
- **Nguyên nhân**: Test case không có `name` hoặc `payload`
- **Giải pháp**: Thêm các trường bắt buộc

### Lỗi: "Lỗi parse JSON"
- **Nguyên nhân**: JSON không hợp lệ (thiếu dấu phẩy, ngoặc, etc.)
- **Giải pháo**: Kiểm tra format JSON (dùng JSONLint.com)

## 💡 Tips

### Tip 1: Tự viết Test Cases
Bạn hoàn toàn có thể tự viết test cases mà không cần AI:

```json
[
  {
    "name": "Test của tôi",
    "payload": {
      "email": "test@example.com",
      "password": "123456"
    }
  }
]
```

### Tip 2: Kết hợp AI + Manual
- Dùng AI generate 80% test cases
- Thêm 20% test cases đặc biệt theo nhu cầu

### Tip 3: Lưu Test Cases
Copy JSON test cases và lưu vào file `.json` để tái sử dụng

### Tip 4: Template
Tạo template test cases cho form thường dùng:

```json
[
  {
    "name": "Valid Login",
    "payload": {"email": "user@test.com", "password": "Pass123!"}
  },
  {
    "name": "Invalid Email",
    "payload": {"email": "invalid", "password": "Pass123!"}
  },
  {
    "name": "Empty Password",
    "payload": {"email": "user@test.com", "password": ""}
  }
]
```

## 🎨 So sánh: Auto vs Fallback

| Tính năng | Auto (Gemini API) | Fallback (Manual) |
|-----------|-------------------|-------------------|
| Tốc độ | ⚡ Nhanh (vài giây) | 🐌 Chậm (1-2 phút) |
| Độ tin cậy | ⚠️ Phụ thuộc API | ✅ Luôn hoạt động |
| Tùy biến | 🤖 AI quyết định | 👤 Bạn kiểm soát |
| Yêu cầu kỹ năng | ❌ Không cần | ✅ Hiểu JSON cơ bản |
| Chi phí | 💰 Cần API key | 🆓 Miễn phí hoàn toàn |

## 🔗 Tài liệu liên quan

- [START-HERE.md](START-HERE.md) - Hướng dẫn tổng quan
- [AI-TESTING-GUIDE.md](AI-TESTING-GUIDE.md) - Hướng dẫn AI Testing
- [WEB-UI-GUIDE.md](WEB-UI-GUIDE.md) - Hướng dẫn Web UI

---

**Happy Testing!** 🧪✨
