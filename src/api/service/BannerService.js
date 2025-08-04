import { API_BASE_URL } from '../apiConfig';

// Hàm gọi API dùng chung
const apiRequest = async (url, { method = 'GET', body, headers = {} } = {}) => {
    const options = {
        method,
        headers: {
            ...headers,
        },
    };

    // Nếu body là FormData thì không set Content-Type
    if (body && !(body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    } else if (body) {
        options.body = body;
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

// Lấy danh sách tất cả banner
export const getAllBanners = async () => {
    return apiRequest(`${API_BASE_URL}/Banner`);
};

// Lấy banner theo ID
export const getBannerById = async (id) => {
    return apiRequest(`${API_BASE_URL}/Banner/${id}`);
};

// Tạo mới banner
export const createBanner = async (bannerData, imageFile, imageFileMobile) => {
    const formData = new FormData();

    // Format dates to ISO string if they exist
    const formattedData = { ...bannerData };
    if (formattedData.StartDate) {
        formattedData.StartDate = new Date(formattedData.StartDate).toISOString();
    }
    if (formattedData.EndDate) {
        formattedData.EndDate = new Date(formattedData.EndDate).toISOString();
    }

    console.log('Formatted banner data:', formattedData);

    // Thêm các trường dữ liệu banner
    Object.keys(formattedData).forEach(key => {
        if (formattedData[key] !== null && formattedData[key] !== undefined) {
            formData.append(key, formattedData[key]);
        }
    });

    // Thêm file ảnh
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    if (imageFileMobile) {
        formData.append('imageFileMobile', imageFileMobile);
    }

    return apiRequest(`${API_BASE_URL}/Banner`, {
        method: 'POST',
        body: formData,
    });
};

// Cập nhật banner
export const updateBanner = async (bannerData, imageFile, imageFileMobile) => {
    const formData = new FormData();

    // Format dates to ISO string if they exist
    const formattedData = { ...bannerData };
    if (formattedData.StartDate) {
        formattedData.StartDate = new Date(formattedData.StartDate).toISOString();
    }
    if (formattedData.EndDate) {
        formattedData.EndDate = new Date(formattedData.EndDate).toISOString();
    }

    // Thêm các trường dữ liệu banner
    Object.keys(formattedData).forEach(key => {
        if (formattedData[key] !== null && formattedData[key] !== undefined) {
            formData.append(key, formattedData[key]);
        }
    });

    // Thêm file ảnh nếu có
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    if (imageFileMobile) {
        formData.append('imageFileMobile', imageFileMobile);
    }

    return apiRequest(`${API_BASE_URL}/Banner`, {
        method: 'PUT',
        body: formData,
    });
};

// Xóa banner
export const deleteBanner = async (id) => {
    return apiRequest(`${API_BASE_URL}/Banner/${id}`, {
        method: 'DELETE',
    });
};
