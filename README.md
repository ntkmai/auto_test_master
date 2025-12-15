# Web Black Box Testing Tool

Tool tự động để phân tích và test black box các web form trên Google Chrome.

## Tính năng

### Phase 1 (Hiện tại)
1. ✅ **Phân tích Form và Field**
   - Tự động tìm tất cả các form trên trang web
   - Trích xuất thông tin về các field (input, textarea, select)
   - Xác định field bắt buộc (required)
   - Tạo file TypeScript interface cho mỗi form

2. ✅ **Thu thập Dữ liệu Mẫu**
   - Lấy tất cả options từ dropdown (select)
   - Lấy values từ radio buttons
   - Lấy trạng thái của checkbox
   - Lấy gợi ý từ datalist
   - Tạo báo cáo markdown với dữ liệu mẫu

## Cài đặt

```bash
npm install
```

## Sử dụng

### 🌐 Web UI (Khuyến nghị)

Giao diện web đẹp mắt, dễ sử dụng:

```bash
npm run server
```

Mở browser: **http://localhost:3000**

Xem chi tiết: [WEB-UI-GUIDE.md](WEB-UI-GUIDE.md)

### 💻 Command Line (CLI)

Chạy với URL cụ thể:

```bash
npm run dev -- https://example.com/form
```

### Hoặc sử dụng trong code:

```typescript
import { WebTester } from './src/webTester';

const tester = new WebTester({
  url: 'https://example.com/form',
  headless: false,        // true để chạy ẩn
  outputDir: './output',  // thư mục lưu kết quả
  timeout: 30000         // timeout 30 giây
});

const result = await tester.run();
```

## Kết quả Output

Sau khi chạy, tool sẽ tạo các file trong thư mục `output/`:

1. **analysis-result.json** - Dữ liệu đầy đủ dạng JSON
2. **{FormName}.interface.ts** - TypeScript interface cho mỗi form
3. **{form-name}-samples.md** - Báo cáo dữ liệu mẫu
4. **SUMMARY.md** - Tổng quan về các form

## Ví dụ Output

### TypeScript Interface
```typescript
interface LoginForm {
  // Email Address
  email: string;
  // Password
  password: string;
  remember?: boolean;
}
```

### Sample Data Report
```markdown
## Field: country
- Type: select
- Selector: `#country`
- Available Options:
  - **Vietnam**: `VN`
  - **Thailand**: `TH`
  - **Singapore**: `SG`
```

## Cấu trúc Project

```
src/
├── types.ts           # Định nghĩa TypeScript types
├── formAnalyzer.ts    # Phân tích form và tạo interface
├── dataCollector.ts   # Thu thập dữ liệu mẫu
├── webTester.ts       # Class chính orchestrate
└── index.ts           # Entry point

output/                # Thư mục chứa kết quả
```

## Build

```bash
npm run build
```

## Chạy Production

```bash
npm start -- https://example.com/form
```

## Yêu cầu

- Node.js >= 16
- Chrome/Chromium (Puppeteer sẽ tự động tải xuống)

## Roadmap

- [x] Phase 1: Phân tích form và thu thập dữ liệu mẫu
- [ ] Phase 2: (Đang chờ feedback và hướng phát triển tiếp theo)

## License

MIT
