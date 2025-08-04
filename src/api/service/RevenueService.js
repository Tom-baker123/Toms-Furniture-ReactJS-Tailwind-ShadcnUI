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
        // Nếu data là string, throw trực tiếp string đó
        if (typeof data === 'string') {
            throw new Error(data);
        } else {
            throw data;
        }
    }
    return data;
};

// ==================== REVENUE APIs ====================

// Lấy thống kê doanh thu theo khoảng thời gian
export const getRevenue = async (revenueRequest) => {
    return apiRequest(`${API_BASE_URL}/Revenue`, {
        method: 'POST',
        body: revenueRequest,
    });
};

// Hàm tiện ích để tạo request thống kê doanh thu theo ngày
export const getDailyRevenue = async (startDate, endDate) => {
    const request = {
        startDate: startDate,
        endDate: endDate,
        timeUnit: 'day'
    };
    return getRevenue(request);
};

// Hàm tiện ích để tạo request thống kê doanh thu theo tuần
export const getWeeklyRevenue = async (startDate, endDate) => {
    const request = {
        startDate: startDate,
        endDate: endDate,
        timeUnit: 'week'
    };
    return getRevenue(request);
};

// Hàm tiện ích để tạo request thống kê doanh thu theo tháng
export const getMonthlyRevenue = async (startDate, endDate) => {
    const request = {
        startDate: startDate,
        endDate: endDate,
        timeUnit: 'month'
    };
    return getRevenue(request);
};

// Hàm tiện ích để tạo request thống kê doanh thu theo năm
export const getYearlyRevenue = async (startDate, endDate) => {
    const request = {
        startDate: startDate,
        endDate: endDate,
        timeUnit: 'year'
    };
    return getRevenue(request);
};

// Hàm tiện ích để lấy doanh thu của tháng hiện tại
export const getCurrentMonthRevenue = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return getDailyRevenue(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
    );
};

// Hàm tiện ích để lấy doanh thu của năm hiện tại
export const getCurrentYearRevenue = async () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    return getMonthlyRevenue(
        startOfYear.toISOString().split('T')[0],
        endOfYear.toISOString().split('T')[0]
    );
};

// Hàm tiện ích để lấy doanh thu 7 ngày gần nhất
export const getLastSevenDaysRevenue = async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 7 ngày bao gồm hôm nay

    return getDailyRevenue(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
    );
};

// Hàm tiện ích để lấy doanh thu 30 ngày gần nhất
export const getLastThirtyDaysRevenue = async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // 30 ngày bao gồm hôm nay

    return getDailyRevenue(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
    );
};