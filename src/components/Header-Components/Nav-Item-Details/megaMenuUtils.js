/**
 * Utility functions cho Mega Menu Navigation
 */

/**
 * Tính toán class grid dựa trên số lượng cột
 * @param {number} columnCount - Số lượng cột
 * @returns {string} - Tailwind CSS grid class
 */
export const getGridClass = (columnCount) => {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6'
    };
    return gridClasses[columnCount] || 'grid-cols-3';
};

/**
 * Tính toán class width cho recommendation picture dựa trên số cột
 * @param {number} columnCount - Số lượng cột
 * @returns {string} - Tailwind CSS width class
 */
export const getRecommendationWidth = (columnCount) => {
    // Khi có ít cột hơn thì recommendation picture có thể rộng hơn
    const widthClasses = {
        1: 'min-w-[400px]',
        2: 'min-w-[350px]',
        3: 'min-w-[300px]',
        4: 'min-w-[280px]',
        5: 'min-w-[250px]',
        6: 'min-w-[220px]'
    };
    return widthClasses[columnCount] || 'min-w-[300px]';
};

/**
 * Tạo responsive grid class dựa trên số cột
 * @param {number} columnCount - Số lượng cột  
 * @returns {string} - Responsive grid classes
 */
export const getResponsiveGridClass = (columnCount) => {
    const baseClass = getGridClass(columnCount);

    // Responsive: trên mobile luôn hiển thị 1 cột, tablet 2 cột
    return `grid-cols-1 md:grid-cols-2 lg:${baseClass}`;
};

/**
 * Lọc ra các cột có dữ liệu (không rỗng)
 * @param {Array} columns - Mảng các cột
 * @returns {Array} - Mảng các cột đã lọc
 */
export const filterValidColumns = (columns) => {
    return columns.filter(column =>
        Array.isArray(column) &&
        column.length > 0 &&
        column.some(section => section.items && section.items.length > 0)
    );
};
