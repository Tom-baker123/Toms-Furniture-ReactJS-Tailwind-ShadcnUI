import { apiRequest } from "@/hooks/useApiRequets";
import { API_BASE_URL } from "../apiConfig";

// Lấy tất cả test
export const getAllTests = () => {
    return apiRequest(`${API_BASE_URL}/Test`, "GET");
};

// Lấy chi tiết test theo id
export const getTestById = (id) => {
    return apiRequest(`${API_BASE_URL}/Test/${id}`, "GET");
};

// Tạo mới test
export const createTest = async (testData) => {
    return await apiRequest(`${API_BASE_URL}/Test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
    });
};

// Cập nhật test theo id
export const updateTest = async (id, testData) => {
    return await apiRequest(`${API_BASE_URL}/Test/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
    });
};

// Xóa test theo id
export const deleteTest = async (id) => {
    return await apiRequest(`${API_BASE_URL}/Test/${id}`, {
        method: 'DELETE',
    });
};