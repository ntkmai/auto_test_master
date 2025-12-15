# Quick Start Guide

## Bắt đầu nhanh trong 3 bước

### Bước 1: Cài đặt
```bash
npm install
```

### Bước 2: Chạy với URL của bạn
```bash
npm run dev -- https://your-website.com/form-page
```

### Bước 3: Xem kết quả
Mở thư mục `output/` để xem:
- `SUMMARY.md` - Tổng quan
- `*.interface.ts` - TypeScript interfaces
- `*-samples.md` - Dữ liệu mẫu

## Ví dụ cụ thể

### Test form đăng nhập
```bash
npm run dev -- https://example.com/login
```

Kết quả sẽ có:
```typescript
// LoginForm.interface.ts
interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}
```

### Test form có dropdown
```bash
npm run dev -- https://example.com/register
```

Kết quả sẽ cho bạn tất cả options trong dropdown:
```markdown
## Field: country
- Available Options:
  - **Vietnam**: `VN`
  - **Thailand**: `TH`
  - **Singapore**: `SG`
```

## Các options hữu ích

### Chạy ẩn (không hiện browser)
Sửa file [src/index.ts](src/index.ts) dòng 13:
```typescript
headless: true  // Thay đổi từ false thành true
```

### Thay đổi timeout
Sửa file [src/index.ts](src/index.ts) dòng 15:
```typescript
timeout: 60000  // Thay đổi từ 30000 thành 60000 (60 giây)
```

### Đợi element cụ thể load
Sửa file [src/index.ts](src/index.ts), thêm dòng:
```typescript
const tester = new WebTester({
  url: url,
  headless: false,
  outputDir: './output',
  timeout: 30000,
  waitForSelector: '#myFormId'  // Thêm dòng này
});
```

## Xem thêm
- [README.md](README.md) - Tổng quan về project
- [GUIDE.md](GUIDE.md) - Hướng dẫn chi tiết
- [example.ts](example.ts) - Code examples
