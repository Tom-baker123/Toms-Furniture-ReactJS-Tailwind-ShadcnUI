// Test file để kiểm tra các utility functions xử lý số điện thoại
import {
    normalizePhoneNumber,
    isValidVietnamesePhoneNumber,
    formatPhoneNumberForDisplay,
    validatePhoneNumber
} from './phoneUtils.js';

// Test cases cho normalizePhoneNumber
console.log('=== Test normalizePhoneNumber ===');
console.log(normalizePhoneNumber('+84901234567')); // Expected: 0901234567
console.log(normalizePhoneNumber('090-123-4567')); // Expected: 0901234567
console.log(normalizePhoneNumber('090 123 4567')); // Expected: 0901234567
console.log(normalizePhoneNumber('0901234567')); // Expected: 0901234567
console.log(normalizePhoneNumber('+84 90 123 4567')); // Expected: 0901234567

// Test cases cho isValidVietnamesePhoneNumber
console.log('\n=== Test isValidVietnamesePhoneNumber ===');
console.log(isValidVietnamesePhoneNumber('0901234567')); // Expected: true
console.log(isValidVietnamesePhoneNumber('0351234567')); // Expected: true
console.log(isValidVietnamesePhoneNumber('0781234567')); // Expected: true
console.log(isValidVietnamesePhoneNumber('0821234567')); // Expected: true
console.log(isValidVietnamesePhoneNumber('0921234567')); // Expected: true
console.log(isValidVietnamesePhoneNumber('0121234567')); // Expected: false (đầu số không hợp lệ)
console.log(isValidVietnamesePhoneNumber('090123456')); // Expected: false (thiếu số)
console.log(isValidVietnamesePhoneNumber('09012345678')); // Expected: false (thừa số)
console.log(isValidVietnamesePhoneNumber('+84901234567')); // Expected: true (sẽ được chuẩn hóa)

// Test cases cho formatPhoneNumberForDisplay
console.log('\n=== Test formatPhoneNumberForDisplay ===');
console.log(formatPhoneNumberForDisplay('0901234567')); // Expected: 0901 234 567
console.log(formatPhoneNumberForDisplay('+84901234567')); // Expected: 0901 234 567

// Test cases cho validatePhoneNumber
console.log('\n=== Test validatePhoneNumber ===');
console.log(validatePhoneNumber('0901234567')); // Expected: null (hợp lệ)
console.log(validatePhoneNumber('0121234567')); // Expected: error message
console.log(validatePhoneNumber('090123456')); // Expected: error message
console.log(validatePhoneNumber('')); // Expected: null (cho phép trống)
console.log(validatePhoneNumber('+84901234567')); // Expected: null (hợp lệ)
