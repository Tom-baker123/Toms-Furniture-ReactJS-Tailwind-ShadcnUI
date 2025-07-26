/**
 * Định dạng lại chuỗi địa chỉ (id-name) thành "id. name" hoặc chỉ name nếu có.
 * @param {string} value - Chuỗi dạng "id-name"
 * @param {boolean} [showId=true] - Có hiển thị id không
 * @returns {string}
 */
export function formatAddressDisplay(value) {
    if (!value) return '';
    const idx = value.indexOf('-');
    if (idx === -1) return value;
    const name = value.slice(idx + 1);
    return name;
}
// src/lib/addressDropdownUtils.js
// Tiện ích xử lý value cho dropdown địa chỉ (tỉnh, quận, phường)

/**
 * Ghép id và name thành value cho dropdown
 * @param {string|number} id
 * @param {string} name
 * @returns {string}
 */
export function formatDropdownValue(id, name) {
    return `${id}-${name}`;
}

/**
 * Parse value từ dropdown thành object { id, name }
 * @param {string} value
 * @returns {{ id: string, name: string }}
 */
export function parseDropdownValue(value) {
    if (!value) return { id: '', name: '' };
    const idx = value.indexOf('-');
    if (idx === -1) return { id: value, name: '' };
    return {
        id: value.slice(0, idx),
        name: value.slice(idx + 1),
    };
}
