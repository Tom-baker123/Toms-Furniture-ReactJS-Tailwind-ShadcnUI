# Mega Menu Components - Hướng dẫn sử dụng (Đã cập nhật)

## Tổng quan

Hệ thống components này được thiết kế để tái sử dụng và tùy biến mega menu một cách linh hoạt. Bao gồm:

1. **useHover Hook** - Xử lý logic hover với delay
2. **MegaMenuColumn Component** - Hiển thị các cột menu
3. **RecommendationPicture Component** - Hiển thị banner khuyến mãi
4. **megaMenuConfig** - File cấu hình dữ liệu
5. **megaMenuUtils** - Utilities cho grid responsive ✨ MỚI

## ✨ Tính năng mới: Auto-responsive Grid

### Tự động điều chỉnh số cột

Khi bạn comment/uncomment các cột trong config, grid sẽ tự động điều chỉnh:

```jsx
// Khi có 3 cột active → grid-cols-3
// Khi comment 1 cột → grid-cols-2 (tự động)
// Khi comment thêm → grid-cols-1 (tự động)
```

### megaMenuUtils.js

```jsx
import { getGridClass, filterValidColumns, getRecommendationWidth } from "./megaMenuUtils";

// Tự động tính grid class dựa trên số cột
const gridClass = getGridClass(3); // "grid-cols-3"

// Lọc các cột có dữ liệu
const validColumns = filterValidColumns(allColumns);

// Tính width cho recommendation picture
const recWidth = getRecommendationWidth(3); // "min-w-[300px]"
```

**Available utilities:**

- `getGridClass(count)` - Trả về Tailwind grid class
- `getResponsiveGridClass(count)` - Grid responsive cho mobile/tablet
- `filterValidColumns(columns)` - Lọc cột có dữ liệu
- `getRecommendationWidth(count)` - Width cho recommendation picture

## Cách sử dụng cập nhật

### NavItem với Auto-responsive Grid

```jsx
import React from "react";
import { useHover } from "@/hooks/useHover";
import MegaMenuColumn from "./MegaMenuColumn";
import RecommendationPicture from "./RecommendationPicture";
import { megaMenuConfig } from "./megaMenuConfig";
import { getGridClass, filterValidColumns, getRecommendationWidth } from "./megaMenuUtils";

const NavItem1 = () => {
    const { isHovered, handleMouseEnter, handleMouseLeave, forceShow } = useHover(100);

    // ✨ Tự động tính toán số cột dựa trên dữ liệu thực tế
    const validColumns = filterValidColumns(megaMenuConfig.columns);
    const columnCount = validColumns.length;

    return (
        <li
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`mega-menu ${isHovered ? "visible" : "hidden"}`}>
                <div className="flex">
                    {/* ✨ Grid tự động điều chỉnh */}
                    <div className={`grid ${getGridClass(columnCount)} flex-1 gap-0`}>
                        {validColumns.map((columnData, index) => (
                            <MegaMenuColumn
                                key={index}
                                menuItems={columnData}
                            />
                        ))}
                    </div>
                    {/* ✨ Recommendation picture với width tự động */}
                    <RecommendationPicture
                        {...megaMenuConfig.recommendationPicture}
                        className={getRecommendationWidth(columnCount)}
                    />
                </div>
            </div>
        </li>
    );
};
```

## Tùy biến số cột trong config

### Ví dụ: 4 cột

```jsx
// megaMenuConfig.js
export const megaMenuConfig = {
    columns: [
        [
            /* Cột 1 data */
        ],
        [
            /* Cột 2 data */
        ],
        [
            /* Cột 3 data */
        ],
        [
            /* Cột 4 data */
        ], // → Tự động thành grid-cols-4
    ],
};
```

### Ví dụ: 2 cột (comment 2 cột)

```jsx
export const megaMenuConfig = {
    columns: [
        [
            /* Cột 1 data */
        ],
        [
            /* Cột 2 data */
        ],
        // [/* Cột 3 comment */],
        // [/* Cột 4 comment */]  // → Tự động thành grid-cols-2
    ],
};
```

## CSS Updates

### Border tự động cho cột cuối

```css
.mega-menu__column:last-child {
    @apply border-r-0; /* Cột cuối không có border phải */
}
```

### Grid tự động điều chỉnh

```css
.nav-custom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 1fr); /* Tự động fit */
    gap: 0;
}
```

## Responsive Design

### Mobile/Tablet friendly

```jsx
// Sử dụng responsive grid class
const responsiveClass = getResponsiveGridClass(columnCount);
// → "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

## Lợi ích của hệ thống mới

1. **✨ Auto-responsive**: Không cần chỉnh CSS khi thay đổi số cột
2. **🎯 Smart filtering**: Chỉ hiển thị cột có dữ liệu thực tế
3. **📱 Mobile-first**: Responsive tự động trên mọi thiết bị
4. **🔧 Easy maintenance**: Chỉ cần comment/uncomment trong config
5. **⚡ Performance**: Utility functions được tối ưu hóa
6. **🎨 Flexible styling**: Recommendation width tự động điều chỉnh

## Migration từ version cũ

Nếu bạn đang sử dụng version cũ, chỉ cần:

1. Import thêm utilities:

```jsx
import { getGridClass, filterValidColumns, getRecommendationWidth } from "./megaMenuUtils";
```

2. Thay thế logic cũ:

```jsx
// Cũ
const columnCount = megaMenuConfig.columns.length;

// Mới
const validColumns = filterValidColumns(megaMenuConfig.columns);
const columnCount = validColumns.length;
```

3. Update grid class:

```jsx
// Cũ
className="nav-custom-grid flex-1"

// Mới
className={`grid ${getGridClass(columnCount)} flex-1 gap-0`}
```

Vậy là xong! Hệ thống sẽ tự động điều chỉnh grid theo số cột thực tế. 🎉
