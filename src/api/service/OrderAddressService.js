import { API_BASE_URL } from "../apiConfig";

// Hàm gọi API dùng chung
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: "include",
            ...options,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Request failed: ${response.status}`);
        }
        return data;
    } catch (error) {
        return { error: true, message: error.message || "An error occurred." };
    }
};

// [1.] Lấy tất cả địa chỉ đơn hàng của user
export const getOrderAddresses = async (userId) => {
    const url = userId ? `/OrderAddress?userId=${userId}` : "/OrderAddress";
    const data = await apiRequest(url, { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [2.] Lấy chi tiết địa chỉ theo id
export const getOrderAddressById = async (id) => {
    const data = await apiRequest(`/OrderAddress/${id}`, { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [3.] Tạo mới địa chỉ đơn hàng
export const createOrderAddress = async (addressData) => {
    const data = await apiRequest("/OrderAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [4.] Cập nhật địa chỉ đơn hàng
export const updateOrderAddress = async (addressData) => {
    const data = await apiRequest("/OrderAddress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [5.] Xóa địa chỉ đơn hàng
export const deleteOrderAddress = async (id) => {
    const data = await apiRequest(`/OrderAddress/${id}`, { method: "DELETE" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

export default {
    getOrderAddresses,
    getOrderAddressById,
    createOrderAddress,
    updateOrderAddress,
    deleteOrderAddress,
};
