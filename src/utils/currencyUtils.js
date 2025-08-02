/**
 * Utility functions for Vietnamese currency formatting
 */

/**
 * Format number to Vietnamese currency format
 * @param {number|string} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount, options = {}) => {
    const {
        showSymbol = true,
        symbolPosition = 'suffix', // 'prefix' or 'suffix'
        locale = 'vi-VN',
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
    } = options;

    // Convert to number if string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Handle invalid numbers
    if (isNaN(numAmount)) {
        return showSymbol ? '0 ₫' : '0';
    }

    // Format the number with Vietnamese locale
    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
    });

    const formattedNumber = formatter.format(numAmount);

    if (!showSymbol) {
        return formattedNumber;
    }

    return symbolPosition === 'prefix'
        ? `₫ ${formattedNumber}`
        : `${formattedNumber} ₫`;
};

/**
 * Parse Vietnamese currency string to number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseVND = (currencyString) => {
    if (typeof currencyString !== 'string') {
        return parseFloat(currencyString) || 0;
    }

    // Remove currency symbol and spaces
    const cleanString = currencyString
        .replace(/₫/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '') // Remove thousand separators
        .replace(/,/g, '.'); // Convert decimal separator if using comma

    return parseFloat(cleanString) || 0;
};

/**
 * Format currency for input field (without symbol)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatVNDForInput = (amount) => {
    return formatVND(amount, { showSymbol: false });
};

/**
 * Format currency for display (with symbol)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string with symbol
 */
export const formatVNDForDisplay = (amount) => {
    return formatVND(amount, { showSymbol: true });
};

/**
 * Validate if a string is a valid Vietnamese currency format
 * @param {string} value - The value to validate
 * @returns {boolean} True if valid currency format
 */
export const isValidVNDFormat = (value) => {
    if (!value) return true; // Empty is valid

    // Remove currency symbol and spaces for validation
    const cleanValue = value.toString()
        .replace(/₫/g, '')
        .replace(/\s/g, '');

    // Check if it's a valid number format
    const numberPattern = /^\d{1,3}(\.?\d{3})*$/;
    return numberPattern.test(cleanValue);
};

/**
 * Format large numbers with Vietnamese units (nghìn, triệu, tỷ)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted string with Vietnamese units
 */
export const formatVNDWithUnits = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return '0 ₫';

    if (numAmount >= 1000000000) {
        return `${(numAmount / 1000000000).toFixed(1)} tỷ ₫`;
    } else if (numAmount >= 1000000) {
        return `${(numAmount / 1000000).toFixed(1)} triệu ₫`;
    } else if (numAmount >= 1000) {
        return `${(numAmount / 1000).toFixed(1)} nghìn ₫`;
    }

    return formatVNDForDisplay(numAmount);
};

// Default export for convenience
export default {
    formatVND,
    parseVND,
    formatVNDForInput,
    formatVNDForDisplay,
    isValidVNDFormat,
    formatVNDWithUnits,
};
