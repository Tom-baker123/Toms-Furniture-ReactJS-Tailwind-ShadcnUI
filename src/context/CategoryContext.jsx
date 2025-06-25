import { createContext, useState, useEffect, useCallback } from 'react';
import { getAllCategories } from '@/api/api';

// Tạo Context
export const CategoryContext = createContext();

// Provider để bọc ứng dụng hoặc các component cần dùng danh mục
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(null);
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

  // Gọi API khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Hàm refetch để gọi lại API
  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider value={{ categories, loading, error, refetch }}>
      {children}
    </CategoryContext.Provider>
  );
};