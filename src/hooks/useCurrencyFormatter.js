import { formatCurrency, formatCurrencyUSD, formatNumber, formatCompactNumber } from '@/utils/formatUtils';

// Custom hook cho việc format tiền tệ và số
export const useCurrencyFormatter = () => {
    // Format tiền tệ VND
    const formatVND = (amount) => {
        if (amount === null || amount === undefined) return '0 ₫';
        return formatCurrency(amount);
    };

    // Format tiền tệ USD (backup)
    const formatUSD = (amount) => {
        if (amount === null || amount === undefined) return '$0';
        return formatCurrencyUSD(amount);
    };

    // Format số lượng
    const formatQuantity = (number) => {
        if (number === null || number === undefined) return '0';
        return formatNumber(number);
    };

    // Format số compact
    const formatCompact = (number) => {
        if (number === null || number === undefined) return '0';
        return formatCompactNumber(number);
    };

    // Format phần trăm
    const formatPercentage = (value, total) => {
        if (!value || !total || total === 0) return '0%';
        const percentage = (value / total * 100).toFixed(1);
        return `${percentage}%`;
    };

    return {
        formatVND,
        formatUSD,
        formatQuantity,
        formatCompact,
        formatPercentage
    };
};
