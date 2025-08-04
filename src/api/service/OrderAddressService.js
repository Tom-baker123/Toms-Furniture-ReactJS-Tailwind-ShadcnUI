import { API_BASE_URL } from "../apiConfig";

// Hàm gọi API dùng chung
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: "include",
            ...options,
        });

        // Kiểm tra content-type để xử lý response phù hợp
        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // Nếu không phải JSON, lấy text
            data = await response.text();
        }

        if (!response.ok) {
            // Nếu data là string, tạo object error
            if (typeof data === "string") {
                throw new Error(data);
            } else {
                throw new Error(data.message || `Request failed: ${response.status}`);
            }
        }
        return data;
    } catch (error) {
        return { error: true, message: error.message || "An error occurred." };
    }
};

// [1.] Lấy tất cả địa chỉ đơn hàng của user, có thể lọc theo isDeafaultAddress
export const getOrderAddresses = async (userId, isDeafaultAddress) => {
    let url = "/OrderAddress";
    const params = [];
    if (userId) params.push(`userId=${userId}`);
    if (typeof isDeafaultAddress !== 'undefined') params.push(`isDeafaultAddress=${isDeafaultAddress}`);
    if (params.length > 0) url += `?${params.join("&")}`;
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
