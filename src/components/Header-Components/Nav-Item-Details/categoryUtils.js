// Utility functions để xử lý danh mục cha con
export const buildCategoryHierarchy = (categories) => {
    if (!categories || !Array.isArray(categories)) {
        return [];
    }

    // Lọc ra các danh mục cha (parentId = null)
    const parentCategories = categories.filter(cat => cat.parentId === null && cat.isActive);

    // Tạo hierarchy với danh mục con
    const hierarchy = parentCategories.map(parent => {
        // Tìm các danh mục con của danh mục cha này
        const children = categories.filter(cat =>
            cat.parentId === parent.id && cat.isActive
        );

        // Tạo items array với "Tất cả [CategoryName]" ở đầu nếu có danh mục con
        const items = [];

        // Luôn thêm "Tất cả" option cho danh mục cha, bất kể có danh mục con hay không
        items.push({
            label: `Tất cả ${parent.categoryName}`,
            href: `/products?categoryId=${parent.id}`,
            imageUrl: parent.imageUrl,
            description: parent.descriptions,
            roomTypeName: parent.roomTypeName,
            isViewAll: true
        });

        // Thêm các danh mục con nếu có
        children.forEach(child => {
            items.push({
                label: child.categoryName,
                href: `/products?categoryId=${child.id}`,
                imageUrl: child.imageUrl,
                description: child.descriptions,
                roomTypeName: child.roomTypeName,
                isViewAll: false
            });
        });

        return {
            title: parent.categoryName,
            href: `/products?categoryId=${parent.id}`,
            imageUrl: parent.imageUrl,
            description: parent.descriptions,
            roomTypeName: parent.roomTypeName,
            items: items
        };
    });

    return hierarchy;
};

// Chia categories thành các cột cho mega menu
export const divideCategoriesIntoColumns = (categoryHierarchy, columnsCount = 3) => {
    if (!categoryHierarchy || categoryHierarchy.length === 0) {
        return [];
    }

    const columns = Array.from({ length: columnsCount }, () => []);

    categoryHierarchy.forEach((category, index) => {
        const columnIndex = index % columnsCount;
        columns[columnIndex].push(category);
    });

    // Lọc ra các cột không rỗng
    return columns.filter(column => column.length > 0);
};

// Tạo mega menu config từ categories API
export const createMegaMenuFromCategories = (categories) => {
    const hierarchy = buildCategoryHierarchy(categories);
    const columns = divideCategoriesIntoColumns(hierarchy, 3);

    return {
        columns,
        recommendationPicture: {
            imageUrl: "https://hyper-garace.myshopify.com/cdn/shop/files/collection-menu-banner.jpg?v=1734424636&width=1100",
            imageAlt: "Home & Decor Collection",
            title: "Home&Decor",
            subtitle: "New Collection",
            buttonText: "Shop Now",
            buttonHref: "/collections/home-decor"
        }
    };
};
