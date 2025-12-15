# 🌐 Web UI Guide - Giao diện Web trực quan

## 🚀 Khởi động Web UI

### Bước 1: Cài đặt (nếu chưa)
```bash
npm install
```

### Bước 2: Chạy Web Server
```bash
npm run server
```

### Bước 3: Mở trình duyệt
Truy cập: **http://localhost:3000**

Server sẽ chạy tại port 3000 (mặc định). Bạn sẽ thấy:
```
=====================================
🚀 Web Black Box Testing Tool Server
=====================================

✅ Server running at: http://localhost:3000
📱 Open your browser and visit the URL above

🧪 Test with demo form: http://localhost:3000/demo-form.html

Press Ctrl+C to stop the server
```

## 📱 Sử dụng Web UI

### Giao diện chính

Web UI cung cấp giao diện đẹp mắt và dễ sử dụng:

1. **Nhập URL** - Nhập URL của trang web cần phân tích
2. **Tùy chọn** - Chọn các options:
   - ☑️ Chạy ẩn (Headless) - Browser không hiện lên
   - ☑️ Chụp ảnh màn hình - Lưu screenshots
3. **Đợi Selector** (Optional) - CSS selector để đợi element load
4. **Bắt đầu phân tích** - Click để chạy

### Các ví dụ nhanh

Click vào các link ví dụ để tự động điền URL:
- **Demo Form** - Test với demo-form.html local
- **W3Schools** - Test với form HTML trên W3Schools
- **Bootstrap** - Test với form examples của Bootstrap

### Kết quả hiển thị

Sau khi phân tích xong, bạn sẽ thấy:

1. **Thống kê tổng quan**
   - Số lượng forms
   - Tổng số fields
   - Số field bắt buộc
   - Số field có sample data

2. **Chi tiết từng form**
   - Form ID, Name, Action, Method
   - Danh sách tất cả fields
   - Loại field (text, email, select, etc.)
   - Trạng thái Required/Optional
   - Label của field

3. **Tải xuống kết quả**
   - 📄 Download JSON - File JSON đầy đủ
   - 📝 Download Summary - Tổng quan markdown
   - 📁 View All Files - Xem tất cả files đã generate

## 🎯 Workflow ví dụ

### Test với Demo Form

1. Chạy server:
   ```bash
   npm run server
   ```

2. Mở browser: http://localhost:3000

3. Click **"Demo Form"** (URL tự động điền)

4. Click **"Bắt đầu phân tích"**

5. Đợi vài giây, browser Chrome sẽ mở và phân tích

6. Xem kết quả hiển thị trên web UI:
   - 3 forms found
   - ~25 fields total
   - Chi tiết từng form
   - TypeScript interfaces
   - Sample data

7. Download kết quả hoặc view files

### Test với Website thật

1. Nhập URL website: `https://your-site.com/login`

2. Chọn options:
   - ☑️ Chạy ẩn (nếu không muốn thấy browser)
   - Đợi selector: `#loginForm` (nếu cần)

3. Click **"Bắt đầu phân tích"**

4. Xem kết quả và download

## 🔧 API Endpoints

Web UI sử dụng các API endpoints sau:

### POST /api/analyze
Phân tích trang web

**Request:**
```json
{
  "url": "https://example.com/form",
  "headless": false,
  "screenshots": false,
  "waitSelector": "#myForm"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T...",
  "forms": [...]
}
```

### GET /api/download/json
Download file JSON kết quả

### GET /api/download/summary
Download file SUMMARY.md

### GET /api/files
Liệt kê tất cả files trong output/

### GET /api/health
Kiểm tra server status

## 🎨 Tính năng Web UI

### ✨ Giao diện đẹp
- Design hiện đại với gradient
- Responsive - hoạt động trên mobile
- Animations mượt mà
- Icons trực quan

### 🚀 Dễ sử dụng
- Form đơn giản, rõ ràng
- Examples một click
- Status real-time
- Kết quả trực quan

### 📊 Hiển thị kết quả
- Stats cards đẹp mắt
- Chi tiết form expandable
- Color-coded (Required/Optional)
- Field types với badges

### 💾 Download tiện lợi
- JSON format
- Markdown summary
- View files trực tiếp
- Multiple download options

## 🔄 So sánh CLI vs Web UI

| Tính năng | CLI | Web UI |
|-----------|-----|--------|
| Chạy nhanh | ✅ | ⚠️ (cần start server) |
| Dễ sử dụng | ⚠️ | ✅ |
| Automation | ✅ | ⚠️ |
| Trực quan | ❌ | ✅ |
| Remote access | ❌ | ✅ |
| No install | ✅ | ⚠️ (cần browser) |

### Khi nào dùng CLI:
- Automation scripts
- CI/CD pipelines
- Quick one-time tests
- No GUI environment

### Khi nào dùng Web UI:
- Demo cho team
- Người không tech-savvy
- Visual comparison
- Remote testing
- Presentation

## 🐛 Troubleshooting

### Server không chạy
```bash
# Kiểm tra port 3000 có bị chiếm không
netstat -ano | findstr :3000

# Thử port khác
PORT=8080 npm run server
```

### Không thấy demo form
Đảm bảo file `demo-form.html` tồn tại:
```bash
ls demo-form.html
```

### CORS errors
Server đã config CORS, nhưng nếu gặp lỗi:
- Restart server
- Clear browser cache
- Thử browser khác

### Analysis timeout
Tăng timeout trong [server.ts](server.ts):
```typescript
timeout: 120000 // 2 phút
```

### Output files không tải được
Check thư mục `output/` có tồn tại:
```bash
mkdir output
```

## 🌟 Tính năng nâng cao

### Chạy trên production

1. Build TypeScript:
   ```bash
   npm run build
   ```

2. Chạy với Node:
   ```bash
   node dist/server.js
   ```

3. Deploy lên server (VPS, Heroku, etc.)

### Custom port

```bash
PORT=8080 npm run server
```

Hoặc sửa trong [server.ts](server.ts):
```typescript
const PORT = process.env.PORT || 8080;
```

### Add authentication

Thêm middleware authentication vào [server.ts](server.ts):
```typescript
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
  users: { 'admin': 'password' },
  challenge: true
}));
```

### Rate limiting

Install package:
```bash
npm install express-rate-limit
```

Add to [server.ts](server.ts):
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use('/api/analyze', limiter);
```

## 📝 Tips & Tricks

### 1. Test nhiều URLs nhanh
Mở nhiều tabs browser, mỗi tab test một URL

### 2. Save URLs yêu thích
Bookmark URLs với query params:
```
http://localhost:3000/?url=https://example.com/form&headless=true
```

### 3. Share kết quả
Send link `/output/` cho teammate xem files

### 4. Monitor logs
Server logs hiển thị real-time progress trong terminal

### 5. Auto-refresh
Dùng browser extension auto-refresh để xem results update

## 🎉 Ưu điểm Web UI

✅ **Không cần command line** - Dùng qua browser
✅ **Visual feedback** - Thấy progress real-time
✅ **Easy sharing** - Share URL cho team
✅ **Better UX** - Giao diện đẹp, dễ hiểu
✅ **Results preview** - Xem ngay không cần mở files
✅ **Multi-platform** - Chạy trên bất kỳ OS nào
✅ **Remote access** - Test từ máy khác

## 📞 Support

Nếu gặp vấn đề với Web UI:
1. Check server logs trong terminal
2. Check browser console (F12)
3. Verify API endpoints hoạt động: http://localhost:3000/api/health
4. Restart server: Ctrl+C rồi `npm run server` lại

---

**Enjoy the beautiful Web UI!** 🎨✨
