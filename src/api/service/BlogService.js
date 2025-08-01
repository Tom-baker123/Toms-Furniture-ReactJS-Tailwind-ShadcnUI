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

// [1.] Lấy tất cả tin tức
export const getNews = async () => {
    const data = await apiRequest("/News", { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [2.] Lấy tin tức theo id
export const getNewsById = async (id) => {
    const data = await apiRequest(`/News/${id}`, { method: "GET" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [3.] Tạo mới tin tức
export const createNews = async (newsData, imageFile) => {
    const formData = new FormData();
    Object.entries(newsData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }
    const data = await apiRequest("/News", {
        method: "POST",
        body: formData,
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [4.] Cập nhật tin tức
export const updateNews = async (newsData, imageFile) => {
    const formData = new FormData();
    Object.entries(newsData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }
    const data = await apiRequest("/News", {
        method: "PUT",
        body: formData,
    });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

// [5.] Xóa tin tức
export const deleteNews = async (id) => {
    const data = await apiRequest(`/News/${id}`, { method: "DELETE" });
    if (data.error) {
        return { success: false, message: data.message };
    }
    return data;
};

export default {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
