import { apiRequest } from "@/hooks/useApiRequets";
import { API_BASE_URL } from "../apiConfig";

// [Cart] Lấy giỏ hàng
export const getCart = async () => {
    const data = await apiRequest(`${API_BASE_URL}/Cart`);
    return data.cart;
};

// [Cart] Thêm vào giỏ hàng
export const addToCart = async (cartItem) => {
    const data = await apiRequest(`${API_BASE_URL}/Cart`, {
        method: 'POST',
        body: cartItem
    });
    return data.cart;
};

// [Cart] Cập nhật giỏ hàng
export const updateCart = async (cartItem) => {
    const data = await apiRequest(`${API_BASE_URL}/Cart`, {
        method: 'PUT',
        body: cartItem
    });
    return data.cart;
};

// [Cart] Xóa khỏi giỏ hàng
export const removeFromCart = async (id) => {
    const data = await apiRequest(`${API_BASE_URL}/Cart/${id}`, {
        method: 'DELETE'
    });
    return data.cart;
};

// [Cart] Hợp nhất giỏ hàng (mergeCart)
// Gọi API POST /Cart/merge để hợp nhất giỏ hàng từ cookie sang tài khoản khi đăng nhập
// Tham số: mergedCartData (object, ví dụ: { cartItems: [...] })
// Trả về giỏ hàng đã hợp nhất
export const mergeCart = async (mergedCartData) => {
    const data = await apiRequest(`${API_BASE_URL}/Cart/merge`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(mergedCartData),
    });
    return data.cart;
};