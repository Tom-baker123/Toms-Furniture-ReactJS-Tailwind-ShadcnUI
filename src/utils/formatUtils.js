// Format currency cho hiển thị VND (Việt Nam)
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format currency USD (giữ lại cho trường hợp cần)
export const formatCurrencyUSD = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format number với dấu phẩy theo chuẩn Việt Nam
export const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
};

// Format compact number (1K, 1M, etc.) theo chuẩn Việt Nam
export const formatCompactNumber = (number) => {
    return new Intl.NumberFormat('vi-VN', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(number);
};
