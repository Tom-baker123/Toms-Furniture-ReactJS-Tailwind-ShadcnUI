import { createContext, useState, useEffect, useCallback } from "react";
import { getAllCategories, getAllStoreInformations } from "@/api/api";

// Tạo Context chung cho ứng dụng
export const APIContext = createContext();

// Provider để bọc ứng dụng hoặc các component cần dùng danh mục và thông tin cửa hàng
export const APIProvider = ({ children }) => {
    const [categories, setCategories] = useState(null);
    const [storeInformation, setStoreInformation] = useState(null); // State cho thông tin cửa hàng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm fetch danh mục
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm fetch thông tin cửa hàng
    const fetchStoreInformation = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllStoreInformations();
            // Lấy bản ghi đầu tiên nếu tồn tại
            setStoreInformation(response.length > 0 ? response[0] : null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Gọi API khi component mount
    useEffect(() => {
        fetchCategories();
        fetchStoreInformation();
    }, [fetchCategories, fetchStoreInformation]);

    // Hàm refetch để gọi lại API
    const refetch = useCallback(() => {
        fetchCategories();
        fetchStoreInformation();
    }, [fetchCategories, fetchStoreInformation]);

    return <APIContext.Provider value={{ categories, storeInformation, loading, error, refetch }}>{children}</APIContext.Provider>;
};
