import { API_BASE_URL } from "../apiConfig";
import { apiRequest } from "../../hooks/useApiRequets";

// Lấy tất cả loại phòng
export const getAllRoomTypes = async () => {
    return await apiRequest(`${API_BASE_URL}/RoomType`, {
        method: "GET"
    });
};

// Lấy loại phòng theo ID
export const getRoomTypeById = async (id) => {
    return await apiRequest(`${API_BASE_URL}/RoomType/${id}`, {
        method: "GET"
    });
};

// Thêm loại phòng mới
export const createRoomType = async (roomTypeData, imageFile) => {
    const formData = new FormData();
    formData.append("roomTypeVModel.RoomTypeName", roomTypeData.RoomTypeName);
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }
    return await apiRequest(`${API_BASE_URL}/RoomType`, {
        method: "POST",
        body: formData
    });
};

// Sửa loại phòng
export const updateRoomType = async (roomTypeData, imageFile) => {
    const formData = new FormData();
    formData.append("roomTypeVModel.Id", roomTypeData.Id);
    formData.append("roomTypeVModel.RoomTypeName", roomTypeData.RoomTypeName);
    if (roomTypeData.IsActive !== undefined) {
        formData.append("roomTypeVModel.IsActive", roomTypeData.IsActive.toString());
    }
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }
    return await apiRequest(`${API_BASE_URL}/RoomType`, {
        method: "PUT",
        body: formData
    });
};

// Xoá loại phòng
export const deleteRoomType = async (id) => {
    return await apiRequest(`${API_BASE_URL}/RoomType/${id}`, {
        method: "DELETE"
    });
};
