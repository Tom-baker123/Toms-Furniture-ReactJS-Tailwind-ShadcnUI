/**
 * Utility functions để xử lý số điện thoại Việt Nam
 */

/**
 * Chuẩn hóa số điện thoại về dạng chuẩn bắt đầu bằng số 0
 * @param {string} phoneNumber - Số điện thoại cần chuẩn hóa
 * @returns {string} - Số điện thoại đã được chuẩn hóa
 */
export const normalizePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    // Loại bỏ tất cả ký tự không phải số (trừ dấu + ở đầu)
    let normalized = phoneNumber.replace(/[^\d+]/g, "");

    // Nếu số bắt đầu bằng +84, thay thế bằng 0
    if (normalized.startsWith("+84")) {
        normalized = "0" + normalized.substring(3);
    }

    // Loại bỏ dấu + nếu còn lại
    normalized = normalized.replace(/\+/g, "");

    return normalized;
};

/**
 * Kiểm tra định dạng số điện thoại Việt Nam hợp lệ
 * @param {string} phoneNumber - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu hợp lệ, false nếu không hợp lệ
 */
export const isValidVietnamesePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;

    // Chuẩn hóa trước khi kiểm tra
    const normalized = normalizePhoneNumber(phoneNumber);

    // Regex cho số điện thoại Việt Nam: 10 số, bắt đầu bằng 0 và một trong các đầu số 3,5,7,8,9
    const vietnamesePhoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

    return vietnamesePhoneRegex.test(normalized);
};

/**
 * Format số điện thoại để hiển thị (thêm dấu cách)
 * @param {string} phoneNumber - Số điện thoại cần format
 * @returns {string} - Số điện thoại đã được format
 */
export const formatPhoneNumberForDisplay = (phoneNumber) => {
    if (!phoneNumber) return "";

    const normalized = normalizePhoneNumber(phoneNumber);

    // Format: 0xxx xxx xxxx
    if (normalized.length === 10) {
        return normalized.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    }

    return normalized;
};

/**
 * Validate và trả về message lỗi nếu số điện thoại không hợp lệ
 * @param {string} phoneNumber - Số điện thoại cần validate
 * @returns {string|null} - Message lỗi hoặc null nếu hợp lệ
 */
export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null; // Có thể để trống

    const normalized = normalizePhoneNumber(phoneNumber);

    if (normalized.length === 0) return null;

    if (normalized.length !== 10) {
        return "Số điện thoại phải có đúng 10 chữ số";
    }

    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
        return "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09)";
    }

    return null;
};

/**
 * Custom hook để xử lý input số điện thoại
 * @param {function} onChange - Callback khi giá trị thay đổi
 * @returns {object} - Object chứa các handler và validators
 */
export const usePhoneInput = (onChange) => {
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const normalized = normalizePhoneNumber(value);

        // Chỉ cho phép nhập tối đa 10 số sau khi chuẩn hóa
        if (normalized.length <= 10) {
            onChange(normalized);
        }
    };

    const validatePhone = (value) => {
        return validatePhoneNumber(value);
    };

    return {
        handlePhoneChange,
        validatePhone,
        normalizePhoneNumber,
        formatPhoneNumberForDisplay
    };
};
