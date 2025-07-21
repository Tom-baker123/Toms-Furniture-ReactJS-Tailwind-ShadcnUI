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

// [1.] Lấy tất cả phương thức thanh toán
export const getPaymentMethods = async () => {
    const data = await apiRequest("/PaymentMethod", { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [2.] Lấy phương thức thanh toán theo id
export const getPaymentMethodById = async (id) => {
    const data = await apiRequest(`/PaymentMethod/${id}`, { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [3.] Tạo mới phương thức thanh toán
export const createPaymentMethod = async (paymentMethodData) => {
    const data = await apiRequest("/PaymentMethod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentMethodData),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [4.] Cập nhật phương thức thanh toán
export const updatePaymentMethod = async (paymentMethodData) => {
    const data = await apiRequest("/PaymentMethod", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentMethodData),
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [5.] Xóa phương thức thanh toán
export const deletePaymentMethod = async (id) => {
    const data = await apiRequest(`/PaymentMethod/${id}`, { method: "DELETE" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

export default {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
};
