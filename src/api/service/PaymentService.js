import { API_BASE_URL } from '../apiConfig';

// Hàm gọi API dùng chung
const apiRequest = async (url, { method = 'GET', body, headers = {} } = {}) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, { ...options, credentials: 'include' });
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }
    if (!response.ok) {
        throw data;
    }
    return data;
};

// Xử lý thanh toán đơn hàng
export const processOrderPayment = async (orderData) => {
    return apiRequest(`${API_BASE_URL}/Order/payment`, {
        method: 'POST',
        body: orderData,
    });
};

// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (orderId) => {
    return apiRequest(`${API_BASE_URL}/Order/${orderId}`);
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = async (userId) => {
    return apiRequest(`${API_BASE_URL}/Order/user/${userId}`);
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
    return apiRequest(`${API_BASE_URL}/Order`);
};

// Tạo URL thanh toán VNPAY cho đơn hàng
export const createVnpayPaymentUrl = async (orderId) => {
    return apiRequest(`${API_BASE_URL}/Payment/create-vnpay-url/${orderId}`, {
        method: 'POST',
    });
};

// Xử lý callback từ VNPAY: gửi request GET với query string, không có body
export const vnpayCallback = async (queryParams) => {
    // queryParams là string dạng "vnp_...=...&vnp_...=..."
    const url = `${API_BASE_URL}/Payment/vnpay-callback?${queryParams}`;
    return apiRequest(url, { method: 'GET' });
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, newStatusId) => {
    return apiRequest(`${API_BASE_URL}/Order/status/${orderId}?newStatusId=${newStatusId}`, {
        method: 'PUT',
    });
};


// [14.1] API lấy tất cả danh sách trạng thái đơn hàng
export const getAllOrderStatuses = async () => {
    return apiRequest(`${API_BASE_URL}/OrderStatus`);
};
// [14.2] API lấy trạng thái đơn hàng theo ID
export const getOrderStatusById = async (id) => {
    return apiRequest(`${API_BASE_URL}/OrderStatus/${id}`);
};