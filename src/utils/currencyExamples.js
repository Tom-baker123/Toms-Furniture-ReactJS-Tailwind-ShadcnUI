/**
 * Ví dụ sử dụng currencyUtils trong các component ProductForm
 * Để tham khảo cách sử dụng định dạng tiền tệ Việt Nam
 */

import { formatVNDForDisplay, formatVNDForInput, parseVND, isValidVNDFormat } from '@/utils/currencyUtils';

// 1. Hiển thị giá tiền trong danh sách sản phẩm
const displayPrice = formatVNDForDisplay(250000); // "250.000 ₫"

// 2. Hiển thị giá với đơn vị lớn
const displayLargePrice = formatVNDWithUnits(15000000); // "15.0 triệu ₫"

// 3. Định dạng cho input field (không có ký hiệu)
const inputValue = formatVNDForInput(250000); // "250.000"

// 4. Parse từ string về number
const numericValue = parseVND("250.000 ₫"); // 250000

// 5. Validate định dạng tiền tệ
const isValid = isValidVNDFormat("250.000"); // true

// Ví dụ trong component React:
/*
const PriceInput = ({ value, onChange }) => {
    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (isValidVNDFormat(inputValue)) {
            const numericValue = parseVND(inputValue);
            onChange(numericValue);
        }
    };

    return (
        <input
            type="text"
            value={formatVNDForInput(value)}
            onChange={handleChange}
            placeholder="Nhập giá (VND)"
        />
    );
};

const PriceDisplay = ({ price }) => {
    return (
        <span className="text-lg font-semibold">
            {formatVNDForDisplay(price)}
        </span>
    );
};
*/

export default {
    displayPrice,
    displayLargePrice,
    inputValue,
    numericValue,
    isValid
};
