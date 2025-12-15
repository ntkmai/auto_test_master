# Danh Sách Task Cần Làm Sau

## 🔴 Ưu tiên cao

### 1. Hỗ trợ PrimeReact Components
**Vấn đề:** Form hiện tại sử dụng PrimeReact (custom components) thay vì HTML thuần
- ❌ Custom dropdown (`p-dropdown`) không được nhận diện
- ❌ Calendar component không được xử lý
- ❌ Hidden select elements không được detect

**Ví dụ HTML:**
```html
<div id="term_type" class="p-dropdown p-component">
  <div class="p-hidden-accessible">
    <input type="text" readonly="" value="Năm">
  </div>
  <div class="p-hidden-accessible p-dropdown-hidden-select">
    <select tabindex="-1">
      <option value="year" selected="">Năm</option>
    </select>
  </div>
  <span class="p-dropdown-label">Năm</span>
  <div class="p-dropdown-trigger">...</div>
</div>
```

**Giải pháp cần làm:**
1. **FormAnalyzer:** Detect custom components
   - Tìm `.p-dropdown` containers
   - Trích xuất hidden select bên trong
   - Lấy ID từ container thay vì select
   - Detect `.p-calendar` cho date inputs

2. **FormFiller:** Xử lý custom dropdown
   - Click vào `.p-dropdown-trigger` để mở dropdown
   - Đợi panel xuất hiện
   - Click vào option trong panel
   - Xử lý search nếu dropdown có search

3. **FormFiller:** Xử lý calendar
   - Click vào calendar button
   - Tương tác với date picker
   - Chọn ngày từ lịch

---

### 2. UUID và Dữ Liệu Đặc Biệt
**Vấn đề:** Form yêu cầu UUID hợp lệ cho một số trường
- Trường `term_id` yêu cầu UUID: `A3CCFD01-FAAE-4C01-9C08-B4DD1B41C045`
- Gemini tạo random text không hợp lệ

**Giải pháp cần làm:**
1. Detect UUID pattern trong options
2. Chọn UUID có sẵn thay vì generate
3. Hoặc validate format trước khi fill

---

### 3. Trường Name Không Rõ Ràng
**Vấn đề:** Nhiều trường chỉ có ID, không có name attribute
- `id="title"` nhưng không có `name="title"`
- FormAnalyzer dùng name làm key chính
- Gây khó khăn trong mapping

**Giải pháp cần làm:**
1. Ưu tiên name, fallback sang ID
2. Update FormAnalyzer để hỗ trợ cả hai
3. Log warning khi field không có name

---

### 4. Nested Array Fields
**Vấn đề:** Form có array fields (dynamic rows)
```html
objects_in_charge.0.object_id
objects_in_charge.0.title
objects_in_charge.0.starting_point
objects_in_charge.0.objective
objects_in_charge.0.weight
```

**Giải pháp cần làm:**
1. Detect pattern `fieldName.0.subField`
2. Group thành nested object trong test cases
3. Hỗ trợ fill multiple rows (0, 1, 2...)

---

## 🟡 Ưu tiên trung bình

### 5. Dropdown với Nhiều Options
**Vấn đề:** Dropdown có search và nhiều items
- User cần scroll để tìm
- Có thể cần type để search

**Giải pháp:**
1. Detect dropdown có search
2. Type text thay vì scroll
3. Chọn first match

---

### 6. Disabled Fields
**Vấn đề:** Một số field bị disabled
```html
<input disabled="" value="Công ty">
<input disabled="" value="0 %">
```

**Giải pháp:**
1. Skip disabled fields khi fill
2. Log warning
3. Không tạo test cases cho disabled fields

---

### 7. Validation Messages
**Vấn đề:** Error messages nằm trong `<p>` tag
```html
<p class="absolute left-0 pl-1 text-sm text-red-500 transition-all -pt-0.5 opacity-0"></p>
```

**Giải pháp:**
1. Check opacity để detect visible errors
2. Đọc nội dung error message
3. Report trong kết quả test

---

## 🟢 Ưu tiên thấp

### 8. Dynamic Add Buttons
**Vấn đề:** Buttons để thêm rows động
```html
<button>Thêm Phòng phụ trách kết quả then chốt</button>
<button>Thêm liên kết chéo kết quả then chốt</button>
```

**Giải pháp:**
1. Detect và click add buttons
2. Fill new rows
3. Test với multiple rows

---

### 9. Grid Layout Detection
**Vấn đề:** Form dùng grid layout phức tạp
- `md:grid-cols-2` - 2 columns
- Khó xác định thứ tự fill

**Giải pháp:**
1. Fill theo DOM order thay vì visual order
2. Hoặc detect grid và sort fields

---

## 📝 Ghi Chú Kỹ Thuật

### PrimeReact Component Patterns
```javascript
// Dropdown selector
.p-dropdown[id="field_id"]

// Click trigger
.p-dropdown-trigger

// Wait for panel
.p-dropdown-panel

// Select option
.p-dropdown-item

// Calendar
.p-calendar
.p-datepicker-trigger

// Input inside calendar
.p-calendar input[type="text"]
```

### Suggested Code Structure
```typescript
// formFiller.ts - New method
async fillPrimeReactDropdown(page: Page, dropdownId: string, value: string) {
  // 1. Click trigger
  await page.click(`#${dropdownId} .p-dropdown-trigger`);
  
  // 2. Wait for panel
  await page.waitForSelector('.p-dropdown-panel');
  
  // 3. Find and click option
  const option = await page.evaluateHandle((val) => {
    const items = Array.from(document.querySelectorAll('.p-dropdown-item'));
    return items.find(item => item.textContent?.includes(val));
  }, value);
  
  if (option) {
    await option.click();
  }
}
```

---

## 🎯 Priority Order
1. ✅ Xử lý detached frame error (DONE)
2. ✅ Skip password fields (DONE)  
3. ✅ Wait for page load (DONE)
4. 🔲 Hỗ trợ PrimeReact dropdown
5. 🔲 Hỗ trợ PrimeReact calendar
6. 🔲 UUID validation
7. 🔲 Nested array fields
8. 🔲 Disabled field detection

---

## 📚 References
- PrimeReact Docs: https://primereact.org/
- Dropdown: https://primereact.org/dropdown/
- Calendar: https://primereact.org/calendar/
