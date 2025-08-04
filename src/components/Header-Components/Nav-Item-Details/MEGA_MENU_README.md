# Mega Menu Integration với Categories API

## Tổng quan

NavItem1 component đã được cập nhật để sử dụng dữ liệu danh mục từ APIContext thay vì dữ liệu tĩnh.

## Các files đã thay đổi/tạo mới:

### 1. `NavItem1.jsx` (Đã cập nhật)

- Tích hợp với APIContext để lấy dữ liệu categories
- Thêm loading states và error handling
- Fallback về config tĩnh nếu API chưa load xong

### 2. `categoryUtils.js` (Mới)

- `buildCategoryHierarchy()`: Xây dựng cấu trúc cha-con từ categories flat
- `divideCategoriesIntoColumns()`: Chia categories thành các cột cho mega menu
- `createMegaMenuFromCategories()`: Tạo config hoàn chỉnh cho mega menu

### 3. `MegaMenuColumn.jsx` (Đã cập nhật)

- Thêm style đặc biệt cho items "Tất cả"
- Hiển thị roomTypeName nếu có

### 4. `APIContext.jsx` (Đã cập nhật)

- Thêm `fetchCategories` vào context value

### 5. Components Debug/Preview (Mới)

- `CategoryDebugger.jsx`: Debug thông tin hierarchy
- `MegaMenuPreview.jsx`: Preview mega menu config
- `categoryTest.js`: Test utilities với sample data

## Cấu trúc dữ liệu Categories

### Input (từ API):

```javascript
[
    {
        id: 1,
        categoryName: "Bàn",
        parentId: null,
        roomTypeName: null,
        isActive: true,
        // ...
    },
    {
        id: 12,
        categoryName: "Bàn Ăn",
        parentId: 1,
        roomTypeName: "Phòng khách",
        isActive: true,
        // ...
    },
];
```

### Output (Mega Menu Config):

```javascript
{
    columns: [
        [
            {
                title: "Bàn",
                href: "/products?categoryId=1",
                items: [
                    {
                        label: "Tất cả Bàn",
                        href: "/products?categoryId=1",
                        isViewAll: true,
                    },
                    {
                        label: "Bàn Ăn",
                        href: "/products?categoryId=12",
                        roomTypeName: "Phòng khách",
                        isViewAll: false,
                    },
                ],
            },
        ],
    ];
}
```

## Tính năng mới:

### 1. Dynamic Loading

- Menu tự động load từ API categories
- Hiển thị loading state khi đang tải
- Fallback về config tĩnh nếu có lỗi

### 2. Cấu trúc cha-con

- Tự động group danh mục con dưới danh mục cha
- Thêm option "Tất cả [CategoryName]" cho mỗi nhóm

### 3. Room Type Integration

- Hiển thị roomTypeName bên cạnh tên danh mục
- Style đặc biệt cho các loại phòng

### 4. Responsive Layout

- Tự động chia thành 3 cột
- Responsive trên mobile/tablet

## Cách sử dụng:

### 1. Sử dụng bình thường

NavItem1 sẽ tự động load và hiển thị danh mục từ API.

### 2. Debug/Preview

```jsx
import MegaMenuPreview from "./MegaMenuPreview";

// Trong component
<MegaMenuPreview />;
```

### 3. Manual test

```javascript
import { testCategoryUtils } from "./categoryTest";

// Trong console
testCategoryUtils();
```

## Performance:

### 1. Optimizations

- Sử dụng `useMemo` để cache computed values
- Chỉ re-render khi categories thay đổi
- Lazy loading với fallback

### 2. Error Handling

- Graceful fallback về static config
- Loading states
- Error messages user-friendly

## Link routing:

- Danh mục cha: `/products?categoryId={parentId}` (hiển thị cả parent và children)
- Danh mục con: `/products?categoryId={childId}` (chỉ hiển thị child category)
- Tất cả: `/products?categoryId={parentId}` (hiển thị tất cả products của parent + children)

## Products.jsx Integration:

- Đã sửa param từ `category` thành `categoryId` để match với mega menu
- Logic lọc thông minh: nếu chọn parent category sẽ bao gồm cả child categories
- Auto reset filters khi chuyển category
- Debug component: `CategoryFilterDebug` để test filter logic
