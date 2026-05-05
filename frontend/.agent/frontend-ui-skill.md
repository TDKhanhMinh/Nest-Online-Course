# Front-end UI/UX & Responsive Design Skill

Mô tả: Bộ kỹ năng và nguyên tắc dành cho Front-end Engineer chuyên trách UI/UX và Responsive Design, tập trung vào Next.js, Tailwind CSS và shadcn/ui.

## Công nghệ cốt lõi
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v3+ (utility-first)
- **Component library:** shadcn/ui (Radix UI primitives)
- **Icon:** lucide-react
- **Animation:** `transition-*` / `motion` (Framer Motion)

## Chiến lược Hybrid — Bộ Breakpoint Chuẩn

Thiết kế đồng thời trên cả 3 nền tảng (Mobile, Tablet, Desktop). Sử dụng phương pháp ưu tiên ngữ cảnh sử dụng của component để chọn điểm khởi đầu (Mobile-first, Desktop-first, hoặc song song).

| Prefix | Min-width | Nền tảng mục tiêu          | Vai trò trong Layout                                      |
|--------|-----------|----------------------------|-----------------------------------------------------------|
| *(none)* | 0px     | 📱 Mobile < 640px           | Layout tối giản, touch-first, full-width, ẩn cột phụ     |
| `sm:`  | 640px     | 📱 Mobile lớn / Phablet     | Tăng padding, bắt đầu xuất hiện 2 cột đơn giản           |
| `md:`  | 768px     | 🖥️ **Tablet (portrait)**   | **Điểm bản lề chính** — sidebar, 2-col, label hiển thị   |
| `lg:`  | 1024px    | 🖥️ **Tablet (landscape)**  | **Điểm bản lề chính** — multi-col, bảng đầy đủ, filter   |
| `xl:`  | 1280px    | 🖥️ Desktop                 | Max-width container, mật độ thông tin cao, toolbar đầy đủ|
| `2xl:` | 1536px    | 🖥️ Wide / 4K               | Cố định max-width, tăng font scale, whitespace rộng hơn  |

> **Nguyên tắc Tablet:** Tablet (`md` / `lg`) là nền tảng riêng biệt, không được chỉ là bản "thu nhỏ của desktop" hay "phóng to của mobile".

## Kế hoạch Bố cục theo Loại UI

1. **Navigation / Header**
   - Mobile: Hamburger menu (Sheet), logo trái, actions phải.
   - Tablet: Tab bar ngang hoặc mini sidebar icon-only.
   - Desktop: Full nav với dropdown, search bar mở rộng.

2. **Data Table / Danh sách**
   - Mobile: Card list — mỗi row thành 1 card.
   - Tablet: Bảng rút gọn — ẩn cột ít quan trọng (`hidden md:table-cell`).
   - Desktop: Bảng đầy đủ — sticky header, bulk select.

3. **Form / Input layout**
   - Mobile: 1 hàng (`grid-cols-1`), label trên input, full-width button.
   - Tablet: 2 cột cho các field ngắn (`grid-cols-2`), section grouping.
   - Desktop: 3-4 cột, label cạnh input nếu ngắn.

4. **Dashboard / Stats**
   - Mobile: Grid 1 cột, stat card xếp chồng.
   - Tablet: Grid 2-3 cột.
   - Desktop: Grid 4 cột, chart full-size, filter panel inline.

5. **Modal / Dialog**
   - Mobile: Bottom sheet (translate-y từ dưới lên, full width, border-radius top).
   - Tablet: Centered dialog (`max-w-md`).
   - Desktop: Centered dialog (`max-w-lg`) hoặc side panel/drawer cố định bên phải.

## Quy tắc Touch, Pointer & Accessibility

### Mobile & Tablet (Touch)
- **Touch target:** Tối thiểu `min-h-[44px] min-w-[44px]`.
- **Tap spacing:** Khoảng cách giữa các interactive elements ít nhất `gap-2` (8px).
- **Font size:** Không nhỏ hơn `text-sm` (14px).
- **Scroll:** Sử dụng `touch-pan-y` / `touch-pan-x` phù hợp.

### Desktop (Pointer/Hover)
- **Hover states:** Luôn thêm variant `hover:` cho các phần tử tương tác.
- **Cursor:** `cursor-pointer` (click) và `cursor-not-allowed` (disabled).
- **Tooltip:** Hiển thị ở `lg:` trở lên cho các icon-only button.

### Chung
- **Contrast ratio:** ≥ 4.5:1 (text thường), ≥ 3:1 (large text).
- **Focus:** Luôn giữ `focus-visible:ring-2`, không xóa outline.
- **Animation:** Dùng `motion-safe:` cho các hiệu ứng chuyển động.

## Responsive Scales

### Typography Scale
```css
Heading 1: text-2xl sm:text-3xl lg:text-4xl font-bold
Heading 2: text-xl sm:text-2xl lg:text-3xl font-semibold
Heading 3: text-lg sm:text-xl font-semibold
Body: text-sm sm:text-base
Caption: text-xs sm:text-sm text-muted-foreground
```

### Spacing Scale
```css
Section padding: py-8 sm:py-12 lg:py-16
Container padding: px-4 sm:px-6 lg:px-8
Card padding: p-4 sm:p-5 lg:p-6
Gap items: gap-3 sm:gap-4 lg:gap-6
```

## Anti-patterns — Tuyệt đối KHÔNG làm
- Dùng `w-[375px]` hoặc hardcode width bằng pixel.
- Dùng `overflow: hidden` bọc toàn trang làm chặn cuộn ngang.
- Set font size dưới 12px (`text-[10px]`) trên màn hình nhỏ.
- Sử dụng viewport height `vh` trên mobile (dùng `dvh` thay thế).
- Quên thuộc tính `alt` trên ảnh (`next/image`).
- Phụ thuộc hoàn toàn vào `hover` cho tính năng quan trọng (làm mất tính năng trên thiết bị cảm ứng).
- Lược bỏ giao diện của Tablet.
