import { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook để gọi API toàn cục
const useApi = (apiFunction, initialQueries = {}) => {
  // Sử dụng useMemo để đảm bảo initialQueries ổn định
  const memoizedQueries = useMemo(() => initialQueries, [JSON.stringify(initialQueries)]);

  // Trạng thái quản lý dữ liệu, loading, và lỗi
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm fetch data, sử dụng useCallback để tối ưu
  const fetchData = useCallback(
    async (queries = memoizedQueries) => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API với các query params
        const response = await apiFunction(queries);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, memoizedQueries]
  );

  // Gọi API lần đầu khi component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm refetch để gọi lại API với queries mới
  const refetch = useCallback(
    (newQueries) => {
      fetchData(newQueries);
    },
    [fetchData]
  );

  return { data, loading, error, refetch };
};

export default useApi;