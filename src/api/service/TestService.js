import { apiRequest } from "@/hooks/useApiRequets";
import { API_BASE_URL } from "../apiConfig";

// Lấy tất cả test
export const getAllTests = async () => {
    try {
        const response = await apiRequest(`${API_BASE_URL}/Test`, "GET");
        return response; // API trả về danh sách TestGetVModel
    } catch (error) {
        throw new Error(error.message || "Lỗi khi lấy danh sách Test");
    }
};

// Lấy chi tiết test theo id
export const getTestById = async (id) => {
    try {
        const response = await apiRequest(`${API_BASE_URL}/Test/${id}`, "GET");
        if (!response) {
            throw new Error("Không tìm thấy Test");
        }
        return response;
    } catch (error) {
        throw new Error(error.message || "Lỗi khi lấy thông tin Test");
    }
};

// Tạo mới test
export const createTest = async (testData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Test`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testData),
        });

        // Kiểm tra content-type để parse đúng kiểu
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.message || data || "Lỗi khi tạo Test");
        }
        // Nếu backend trả về plain text, coi như thành công
        return { isSuccess: true, message: data };
    } catch (error) {
        throw new Error(error.message || "Lỗi khi tạo Test");
    }
};

// Cập nhật test theo id
export const updateTest = async (id, testData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Test/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testData),
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.message || data || "Lỗi khi cập nhật Test");
        }
        return { isSuccess: true, message: data };
    } catch (error) {
        throw new Error(error.message || "Lỗi khi cập nhật Test");
    }
};

// Xóa test theo id
export const deleteTest = async (id) => {
    try {
        const response = await apiRequest(`${API_BASE_URL}/Test/${id}`, {
            method: "DELETE",
        });
        if (!response.isSuccess) {
            throw new Error(response.message || "Lỗi khi xóa Test");
        }
        return response;
    } catch (error) {
        throw new Error(error.message || "Lỗi khi xóa Test");
    }
};