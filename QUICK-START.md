# Web Black Box Testing Tool - Hướng Dẫn Chạy

## 🚀 Cách Chạy Nhanh

### Windows

1. **Double-click** file `start.bat`
2. Đợi server khởi động (3 giây)
3. Chrome sẽ tự động mở tại `http://localhost:3000`

### macOS / Linux

```bash
# Cấp quyền thực thi (chỉ cần làm 1 lần)
chmod +x start.sh

# Chạy script
./start.sh
```

Browser sẽ tự động mở tại `http://localhost:3000`

### Cách 2: Chạy bằng Command (Tất cả OS)

```bash
# Cài dependencies (chỉ cần 1 lần)
npm install

# Build TypeScript
npm run build

# Chạy server
npm run server
```

Sau đó mở browser tại: `http://localhost:3000`

---

## 📦 Đóng Gói Thành Executable (Tùy Chọn)

Nếu muốn đóng gói thành file executable không cần Node.js:

### Windows (.exe)

```powershell
npm install -g pkg
npm run build
pkg . --targets node18-win-x64 --output auto-test-tool.exe
```

### macOS (.app bundle)

```bash
npm install -g pkg
npm run build
pkg . --targets node18-macos-x64 --output auto-test-tool
```

### Linux

```bash
npm install -g pkg
npm run build
pkg . --targets node18-linux-x64 --output auto-test-tool
```

**LƯU Ý:** File executable sẽ rất lớn (~100MB) vì bao gồm cả Node.js runtime.

---

## 🌐 Cách Sử Dụng

1. **Trang chủ:** `http://localhost:3000`
   - Phân tích form trên bất kỳ website nào
   - Nhập URL và click "Phân tích"

2. **Trang test AI:** `http://localhost:3000/test.html`
   - Tạo test cases tự động bằng Gemini AI
   - Nhập API key Gemini
   - Fill form tự động

3. **Demo form:** `http://localhost:3000/demo-form.html`
   - Form mẫu để test tool

---

## ⚙️ Cấu Hình

### API Key

Có 3 cách nhập API key:

1. **UI Input** (Khuyến nghị): Nhập trực tiếp vào ô input trên trang test.html
2. **Environment Variable**: `set GEMINI_API_KEY=your-key-here`
3. **Server Code**: Sửa `server.ts` line 26

### Port

Mặc định: `3000`

Đổi port: Sửa file `server.ts` line 10:
```typescript
const PORT = process.env.PORT || 3000;
```

---

## 🛑 Dừng Server

- Nhấn `Ctrl+C` trong cửa sổ terminal/command prompt
- Hoặc đóng cửa sổ

---

## 📋 Requirements

- Node.js 18+ (download tại: https://nodejs.org)
- Chrome/Chromium browser
- Internet connection (để tải form từ website khác)

---
**Windows:**
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID_NUMBER> /F
```

**macOS/Linux:**
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9
```

### Lỗi "Cannot find module"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi "Permission denied" (Mac/Linux)

```bash
# Cấp quyền cho script
chmod +x start.sh
```

### Server không khởi động

```bash
```

### Server không khởi động

```powershellWindows: Double-click để chạy
├── start.sh            ⭐ Mac/Linux: ./start.sh
# Check log lỗi
npm run server

# Nếu thiếu TypeScript build:
npm run build
```

---

## 📁 Cấu Trúc Thư Mục

```
auto-test-master/
├── start.bat           ⭐ Double-click file này để chạy
├── server.ts           Server Express
├── package.json        
├── public/            Frontend files
│   ├── index.html 
   - Windows: Chạy `start.bat`
   - Mac/Linux: Chạy `./start.sh`
   - Truy cập demo form tại `/demo-form.html`
2. **Test local**: Tạo HTML form bất kỳ, host local và test
3. **API Key**: Lấy free tại https://aistudio.google.com/apikey
4. **Headless mode**: Bật để chạy nhanh hơn (không hiện Chrome UI)
5. **Cross-platform**: Tool hoạt động trên Windows, macOS, Linux
│   ├── webTester.ts   Puppeteer automation
│   ├── formFiller.ts  Auto-fill forms
│   ├── grokAI.ts      Gemini AI integration
│   └── ...
└── output/            Kết quả phân tích
```

---

## 💡 Tips

1. **Demo nhanh**: Chạy `start.bat` → Truy cập demo form tại `/demo-form.html`
2. **Test local**: Tạo HTML form bất kỳ, host local và test
3. **API Key**: Lấy free tại https://aistudio.google.com/apikey
4. **Headless mode**: Bật để chạy nhanh hơn (không hiện Chrome UI)

---

## 🎯 Use Cases

✅ Phân tích form trên website bất kỳ
✅ Tạo test cases tự động bằng AI
✅ Test form validation
✅ Extract field structure sang TypeScript interface
✅ Generate sample test data

---

**Enjoy testing! 🚀**
